// import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { AutoSizer, Column, Table } from 'react-virtualized';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';


export const Rows = ({ columns, rowHeight, onRowClick, headerHeight, rowCount, rowGetter }) => {
    const headerRenderer = ({ label, columnIndex }) => {
        return <h1>hi</h1>
    }

    const cellRenderer = ({ cellData, columnIndex }) => {
        console.log("celldata", cellData)
        return (
            <TableCell
                component="div"
                variant="body"
                style={{ height: rowHeight }}
            >
                {<span>hi</span>}
            </TableCell>
        );
    }

    const getRowClassName = () => {
    }

    return (
        // <AutoSizer>{({ height, width }) => {
        <Table
            height={500}
            width={1000}
            rowHeight={rowHeight}
            gridStyle={{
                direction: 'inherit',
            }}
            headerHeight={headerHeight}
            // rowClassName={getRowClassName}
            rowCount={rowCount}
            rowGetter={rowGetter}
            cellRenderer={cellRenderer}
        ></Table>
        // }}
        // </AutoSizer>
    );
}

export const RowsOld = ({ rows }) => {
    return (
        <TableContainer component={Paper}>
            <Table >
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