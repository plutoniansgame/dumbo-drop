import { useState } from "react";
import { AppBar, Button, Link } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { LinearProgress } from "@mui/material";
import { Box } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { CsvFileAcceptor } from "../Components/CsvFileAcceptor";
import { makeDropTransaction } from "../util/airdrop";
import { Connection, clusterApiUrl } from "@solana/web3.js"


export const Home = () => {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rowsLoading, setRowsLoading] = useState(false);
    const [dropState, setDropState] = useState("");
    const [progress, setProgress] = useState(0);
    const [failures, setFailures] = useState([]);

    const onRowsLoaded = (data) => {
        setRows(data);
    }


    const mapFailuresToCsv = (failures) => {
        let buf = "";
        failures.forEach(f => {
            buf += `${f.address},${f.mintAddress},${f.amount}\n`;
        })
        return buf
    }

    const handleGoButtonClick = async () => {
        setLoading(true);
        setDropState("preparing");
        const mappa = new Map();
        const transactions = [];
        const tempFailures = [];

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            const { transaction } = await makeDropTransaction(connection, wallet, row, i);
            mappa.set(i, row);
            transactions.push(transaction);
            setProgress(((i + 1) / rows.length) * 100)
        }

        const signed = await wallet.signAllTransactions(transactions);
        const serialized = signed.map(t => t.serialize());
        setProgress(0);
        setDropState("running");

        for (let i = 0; i < serialized.length; i++) {
            try {
                await connection.sendRawTransaction(serialized[i]);
            } catch (e) {
                console.log(e);
                failures.push(i);
            }

            setProgress(((i + 1) / rows.length) * 100);
        }

        if (failures.length) {
            const failedRows = failures.map(n => mappa.get(n))
            setFailures(failedRows);
        }
        setDropState("done");
        setProgress(0)
        setLoading(false);
    }

    return <Box sx={{ height: 500 }}>
        <Stack direction={"column"}>
            <AppBar position={"sticky"} sx={{ padding: "8px" }}>
                <Stack direction="row" justifyContent={"space-between"}>
                    <Box sx={{ width: "200px" }}>
                        <Stack direction="row" justifyContent={"space-between"} >
                            <Typography variant="h4">🐘 Dropper</Typography>
                        </Stack>
                    </Box>
                    <WalletMultiButton />
                </Stack>
            </AppBar>
            <Stack direction={"column"} alignItems={"center"} spacing={30}>
                {rowsLoading ? <CircularProgress /> : null}
                {rows.length ?
                    <>
                        {loading ?
                            <>
                                <Typography variant="h1">{dropState}: {progress}%</Typography>
                                <LinearProgress sx={{ width: "90%", height: 20, marginTop: 100, marginBottom: 100 }} variant="determinate" value={progress} />
                            </>
                            :
                            dropState == "done" ? <Typography variant="h1">Airdrop completed.</Typography> : <Typography variant="h1">Ready to airdrop to {rows.length} addresses.</Typography>
                        }

                        {dropState == "done" && failures.length ? <Link sx={{ fontSize: 32 }} href={`data:text/csv,${encodeURIComponent(mapFailuresToCsv(failures))}`} target={"_blank"} >Download failed transactions CSV</Link> : <Button disabled={loading} variant={"contained"} sx={{ width: 250 }} onClick={handleGoButtonClick}>GO</Button>}
                    </>
                    : <CsvFileAcceptor onRowsLoaded={onRowsLoaded} setLoading={setRowsLoading} />}
            </Stack>
        </Stack >
    </Box >
}
