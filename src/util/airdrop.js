import { SystemProgram, Transaction } from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID, MintLayout, AccountLayout, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";


export const handleDrop = async (connection, rowData, wallet) => {
    const { address, mintAddress, amount } = rowData;

    const tx = new Transaction();

    const associatedTokenAccountAddress = await Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, mintAddress, address, false);
    const accountExists = await associatedTokenAccountExists(connection, associatedTokenAccountAddress, mintAddress);

    if (!accountExists) {
        const createAssociatedTokenAccountIx = Token.createAssociatedTokenAccountInstruction(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, mintAddress, associatedTokenAccountAddress, address, wallet.publicKey);
        tx.add(createAssociatedTokenAccountIx);
    }

    const issuerAssociatedTokenAccountAddress = await Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, mintAddress, wallet.publicKey, false);
    const transferIx = Token.createTransferInstruction(TOKEN_PROGRAM_ID, issuerAssociatedTokenAccountAddress, associatedTokenAccountAddress, wallet.publicKey, [], 100)
    tx.add(transferIx);

    try {
        const { blockhash } = await connection.getRecentBlockhash();
        tx.feePayer = wallet.publicKey;
        tx.recentBlockhash = blockhash;

        const signed = await wallet.signTransaction(tx);
        const sig = connection.sendRawTransaction(tx.serialize());

        // associate this row with its transaction.
    } catch (e) {
        // propagate failure to top level.
        console.log("failed!!!");
        console.log(e)
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
