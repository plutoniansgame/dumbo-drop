import { useState } from "react";
import { Stack, Box } from "@mui/material";
import { useDropzone } from "react-dropzone";
import csv from "csv-parser";

export const CsvFileAcceptor = () => {
    const { acceptedFiles, isFocused, isDragAccept, isDragReject, getInputProps, getRootProps } = useDropzone({ maxFiles: 1, accept: { 'text/csv': [".csv", ".txt"] } });

    return <Stack direction="row" justifyContent={"center"}>
        <Box {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
        </Box>
    </Stack>
};