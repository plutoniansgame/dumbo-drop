import { useState } from "react";
import { AppBar, Button } from "@mui/material"
import { Box } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { CsvFileAcceptor } from "../Components/CsvFileAcceptor";
import { handleDrop } from "../util/airdrop";
import { Connection, clusterApiUrl } from "@solana/web3.js"


export const Home = () => {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [rows, setRows] = useState([]);

    const onRowsLoaded = (data) => {
        setRows(data);
    }

    const handleGoButtonClick = () => {
        handleDrop(connection, rows[0], wallet).then(() => { console.log("done!") }).catch(() => { console.log("failed") })
    }

    return <Box>
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
            {rows.length ? <Stack direction={"column"} alignItems={"center"} spacing={"space-around"}>
                <Typography>Ready to airdrop to {rows.length} addresses.</Typography>
                <Button variant={"contained"} sx={{ width: 250 }} onClick={handleGoButtonClick}>GO</Button>
            </Stack> : <CsvFileAcceptor onRowsLoaded={onRowsLoaded} />}
        </Stack >
    </Box >
}
