import { create } from 'ipfs-core'
import CryptoJS from 'crypto-js'

export async function storeEncryptedOCF(
    ocfObject: any,
    passphrase: string
): Promise<string> {
    const json = JSON.stringify(ocfObject)
    const encrypted = CryptoJS.AES.encrypt(json, passphrase).toString()

    const ipfs = await create()
    const { cid } = await ipfs.add(new TextEncoder().encode(encrypted))
    await ipfs.stop()
    return cid.toString()
}

export async function decryptOCF(cid: string, passphrase: string): Promise<any> {
    const ipfs = await create()
    const chunks = []
    for await (const chunk of ipfs.cat(cid)) {
        chunks.push(chunk)
    }
    await ipfs.stop()
    const encrypted = new TextDecoder().decode(Uint8Array.from(chunks.flat()))
    const decrypted = CryptoJS.AES.decrypt(encrypted, passphrase).toString(CryptoJS.enc.Utf8)
    return JSON.parse(decrypted)
}