import { Transaction } from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";

export const sleep = ms => new Promise(r => setTimeout(r, ms));

export const makeDropTransaction = async (connection, wallet, rowData, index) => {
    const { address, mintAddress, amount } = rowData;

    const tx = new Transaction();

    const associatedTokenAccountAddress = await Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, mintAddress, address, false);
    const accountExists = await associatedTokenAccountExists(connection, associatedTokenAccountAddress, mintAddress);
    await sleep(500);

    if (!accountExists) {
        const createAssociatedTokenAccountIx = Token.createAssociatedTokenAccountInstruction(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, mintAddress, associatedTokenAccountAddress, address, wallet.publicKey);
        tx.add(createAssociatedTokenAccountIx);
    }

    const issuerAssociatedTokenAccountAddress = await Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, mintAddress, wallet.publicKey, false);
    const transferIx = Token.createTransferInstruction(TOKEN_PROGRAM_ID, issuerAssociatedTokenAccountAddress, associatedTokenAccountAddress, wallet.publicKey, [], Number(amount))
    tx.add(transferIx);

    try {
        await sleep(500);
        const { blockhash } = await connection.getRecentBlockhash();
        tx.feePayer = wallet.publicKey;
        tx.recentBlockhash = blockhash;

        return { index, transaction: tx };
    } catch (e) {
        return null;
    }
}

const associatedTokenAccountExists = async (connection, associatedTokenAccountAddress) => {
    const account = await connection.getAccountInfo(associatedTokenAccountAddress);
    return !!account;
}
