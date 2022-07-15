import { SystemProgram, Transaction } from "@solana/web3.js";
import { Mint, createInitializeAccountInstruction, getAssociatedTokenAddress, getAccount, TokenAccountNotFoundError, createTransferInstruction } from "@solana/spl-token";


export const handleDrop = async (connection, rowData, wallet) => {
    const { address, mintAddress, amount } = rowData;
    const tx1 = new Transaction();

    console.log("rowdata", rowData);
    console.log("publickey", wallet.publicKey)
    const solTransferIx = SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: address,
        lamports: 100000
    })

    tx1.add(solTransferIx);

    const sig = await wallet.sendTransaction(tx1, connection);

    console.log("sig", sig);
    return;




    const tx = new Transaction();


    const associatedTokenAccountAddress = await getAssociatedTokenAddress(mintAddress, address, false);
    const accountExists = await associatedTokenAccountExists(connection, associatedTokenAccountAddress, mintAddress);

    if (!accountExists) {
        tx.add(createInitializeAccountInstruction(associatedTokenAccountAddress, mintAddress, address));
    }
    const transferIx = createTransferInstruction(wallet.publicKey, associatedTokenAccountAddress, address, Number(amount))
    tx.add(transferIx);

    try {
        const sig = await wallet.sendTransaction(tx, connection)
        console.log(sig);
    } catch (e) {
        // propagate failure to top level.
        console.log("failed!!!");
        console.log(e)
    }
}

const associatedTokenAccountExists = async (connection, associatedTokenAccountAddress) => {
    try {
        await getAccount(connection, associatedTokenAccountAddress);
        return true;
    } catch (e) {
        if (e instanceof TokenAccountNotFoundError) {
            return false;
        } else {
            throw e;
        }

    }


}
