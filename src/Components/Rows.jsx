import { Stack } from "@mui/material"

export const Rows = ({ rows }) => {
    return <Stack>
        {rows.map(r => <span key={r.address.toBase58() + String(Math.random())}>{r?.address.toBase58()}</span>)}
    </Stack>
}