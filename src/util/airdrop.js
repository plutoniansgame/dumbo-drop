import { Transaction } from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";

const sleep = ms => new Promise(r => setTimeout(r, ms));

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
        const { blockhash } = await connection.getRecentBlockhash();
        tx.feePayer = wallet.publicKey;
        tx.recentBlockhash = blockhash;

        return { index, transaction: tx };
    } catch (e) {
        return null;
    }
}

const associatedTokenAccountExists = async (connection, associatedTokenAccountAddress) => {
    try {
        const account = await connection.getAccountInfo(associatedTokenAccountAddress);

        console.log("ata?", associatedTokenAccountAddress.toBase58())
        if (account) {
            const { data } = account;
            console.log("data", data)
            return true;
        } else {
            return false;
        }
    } catch (e) {
        // if (e instanceof TokenAccountNotFoundError) {
        //     return false;
        // } else {
        throw e;
        // }

    }


}
