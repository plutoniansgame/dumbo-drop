import { useState } from "react";
import { AppBar } from "@mui/material"
import { Box } from "@mui/system"
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from "@solana/wallet-adapter-react";
import { CsvFileAcceptor } from "../Components/CsvFileAcceptor";
import { Rows } from "../Components/Rows";

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
                    <Typography variant="h4">Dropper </Typography>
                    <WalletMultiButton />
                </Stack>
            </AppBar>
            {rows.length ? <Rows rows={rows} /> : <CsvFileAcceptor onRowsLoaded={onRowsLoaded} />}
        </Stack>
    </Box>
}
