import { useState } from "react";
import { AppBar, Button } from "@mui/material"
import { Box } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from "@solana/wallet-adapter-react";
import { CsvFileAcceptor } from "../Components/CsvFileAcceptor";
import { Rows } from "../Components/Rows";
import dumbo from "../dumbo.png";

export const Home = () => {
    const wallet = useWallet();
    const [rows, setRows] = useState([]);

    const onRowsLoaded = (data) => {
        setRows(data);
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
            {rows.length ? <Stack>
                <Typography variant="h1">Airdrop to {rows.length} addresses?</Typography>
                <Button onClick={() => console.log("doing it")}>GO</Button>
                <Rows rows={rows} />
            </Stack> : <CsvFileAcceptor onRowsLoaded={onRowsLoaded} />}
        </Stack >
    </Box >
}
