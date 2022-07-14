import { useState } from "react";
import { AppBar } from "@mui/material"
import { Box } from "@mui/material"
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from "@solana/wallet-adapter-react";
import { CsvFileAcceptor } from "../Components/CsvFileAcceptor";
import { Rows } from "../Components/Rows";
import { Paper } from "@mui/material"
import dumbo from "../dumbo.png";

export const Home = () => {
    const wallet = useWallet();
    const [rows, setRows] = useState([]);

    const onRowsLoaded = (data) => {
        setRows(data);
    }

    return <Box height="1000px">
        <Stack direction={"column"}>
            <AppBar position={"sticky"} sx={{ padding: "8px" }}>
                <Stack direction="row" justifyContent={"space-between"}>
                    <Typography variant="h4"> 🐘 Dropper</Typography>
                    <WalletMultiButton />
                </Stack>
            </AppBar>
            {rows.length ? <Paper height="1000px" width="100%">
                <Rows
                    columns={[
                        { width: 200, label: "address", dataKey: "address" },
                        { width: 200, label: "mint address", dataKey: "mintAddress" },
                        { width: 200, label: "amount", dataKey: "amount" }
                    ]}
                    rowHeight={28}
                    onRowClick={(row) => { console.log("row?", row) }}
                    headerHeight={28}
                    rowCount={rows.length}
                    rowGetter={({ index }) => rows[index]}
                />
            </Paper>
                :
                <CsvFileAcceptor onRowsLoaded={onRowsLoaded} />}
        </Stack >
    </Box >
}
