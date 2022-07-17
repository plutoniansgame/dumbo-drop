import { useState, useEffect } from "react";
import { Stack, Box } from "@mui/material";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { PublicKey } from "@solana/web3.js";

export const CsvFileAcceptor = ({ onRowsLoaded, setLoading }) => {
    const { isFocused, isDragAccept, isDragReject, getInputProps, getRootProps } = useDropzone({ maxFiles: 1, accept: { 'text/csv': [".csv", ".txt"] }, onDrop });

    function onDrop(acceptedFiles) {
        setLoading(true);
        const file = acceptedFiles[0];
        const parsed = [];

        if (file) {
            Papa.parse(file, {
                skipEmptyLines: true,
                step: (results, parser) => {
                    let { data } = results;
                    let [address, mintAddress, amount] = data;

                    address = new PublicKey(address);
                    mintAddress = new PublicKey(mintAddress);

                    parsed.push({ address, mintAddress, amount });
                },
                complete: () => {
                    onRowsLoaded(parsed);
                    setLoading(false);
                }
            })
        }
    }

    return <Stack direction="row" justifyContent={"center"}>
        <Box {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
        </Box>
    </Stack>
};
