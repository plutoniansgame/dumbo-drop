import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export const Rows = ({ rows }) => {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>Address</TableCell>
                        <TableCell >Mint Address</TableCell>
                        <TableCell >Amount</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.address.toBase58() + String(Math.random())}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {<a target="_blank" href={`https://solscan.io/account/${row.address.toBase58()}`}>{row.address.toBase58()}</a>}
                            </TableCell>
                            <TableCell>{<a target="_blank" href={`https://solscan.io/account/${row.mintAddress.toBase58()}`}>{row.mintAddress.toBase58()}</a>}</TableCell>
                            <TableCell>{row.amount}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

// import { Stack } from "@mui/material"

// export const Rows = ({ rows }) => {
//     return <Stack>
//         {rows.map(r => <div key={r.address.toBase58() + String(Math.random())}>
//             <span>{r?.address.toBase58()}</span>
//             <span>{r?.mintAddress.toBase58()}</span>
//             <span>{r.amount}</span>
//         </div>)}
//     </Stack>
// }