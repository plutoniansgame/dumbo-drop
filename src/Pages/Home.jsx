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
import { makeDropTransaction, sleep } from "../util/airdrop";
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
    const [currentBatch, setCurrentBatch] = useState(0);
    const [batchCount, setBatchCount] = useState(0);
    // const [processedTransactionsCount, setProcessedTransactionsCount] = useState(0)

    const onRowsLoaded = (data) => {
        setRows(data);
    }

    const makeBatches = (batchSize = 20, input = []) => {
        let buf = [];
        let batches = [];
        for (let i = 0; i < input.length; i++) {
            if (buf.length == batchSize || input[i + 1] === undefined) {
                batches.push([...buf]);
                buf.length = 0;
            }
            buf.push(input[i])
        }

        return batches;
    }

    const mapFailuresToCsv = (failures) => {
        let buf = "";
        failures.forEach(f => {
            buf += `${f.address},${f.mintAddress},${f.amount}\n`;
        })
        return buf
    }

    const handleGoButtonClick = async () => {
        // setBatches(makeBatches(20, rows));
        const batches = makeBatches(20, rows);
        const mappa = new Map();
        const tmpFailures = [];
        // let processedTxCount = 0;

        setLoading(true);
        setBatchCount(batches.length);

        for (let batch of batches) {
            setDropState("preparing");
            const transactions = [];

            for (let i = 0; i < batch.length; i++) {
                let row = batch[i];
                const { transaction } = await makeDropTransaction(connection, wallet, row, i);
                mappa.set(`${currentBatch}${i}`, row);
                transactions.push(transaction);
                setProgress(((i + 1) / batch.length) * 100)
            }

            const signed = await wallet.signAllTransactions(transactions);
            const serialized = signed.map(t => t.serialize());
            setProgress(0);
            setDropState("running");

            for (let i = 0; i < serialized.length; i++) {
                try {
                    const signature = await connection.sendRawTransaction(serialized[i]);
                } catch (e) {
                    console.log(e);
                    tmpFailures.push(`${currentBatch}${i}`);
                    console.log({ failures })
                }

                await sleep(500);
                setProgress(((i + 1) / batch.length) * 100);
            }
            setCurrentBatch(currentBatch + 1);
        }
        if (failures.length) {
            const failedRows = tmpFailures.map(n => mappa.get(n))
            setFailures(failedRows);
        }
        setDropState("done");
        setProgress(0)
        setLoading(false);
    }

    return <Box sx={{ height: 500 }}>
        <Stack direction={"column"}>
            <AppBar position={"sticky"} sx={{ padding: "8px", marginBottom: 20 }}>
                <Stack direction="row" justifyContent={"space-between"}>
                    <Box sx={{ width: "200px" }}>
                        <Stack direction="row" justifyContent={"space-between"} >
                            <Typography variant="h4">🐘 Dropper</Typography>
                        </Stack>
                    </Box>
                    <WalletMultiButton />
                </Stack>
            </AppBar>
            <Stack direction={"column"} justifyItems={"space-around"} alignItems={"center"} spacing={10}>
                {rowsLoading ? <CircularProgress /> : null}
                {rows.length ?
                    <>
                        {loading ?
                            <>
                                <Typography variant="h1">{dropState}: {Math.round(progress)}%</Typography>
                                <Typography variant="h2">Batch {currentBatch + 1} of {batchCount}</Typography>
                                {/* <Typography variant="h3">Processed {processedTransactionsCount} of {rows.length} transactions.</Typography> */}
                                {dropState == "preparing" ? <Typography variant="p">
                                    Make sure that you have unlocked your wallet by the time preparation is complete,
                                    or you may not be able to sign the transactions.
                                </Typography> : null}
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
