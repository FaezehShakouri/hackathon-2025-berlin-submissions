import express from 'express';
import { ethers } from 'ethers';
import {decryptOCF, storeEncryptedOCF} from "../utils/ipfs";
import {getDiamondAddress} from "../utils/diamond";

const router = express.Router();
const diamondAddress = getDiamondAddress();

router.post("/", async (req, res) => {
    try {
        const { to, amount, ocfData, passphrase } = req.body;

        if (!to || !amount || !ocfData || !passphrase) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const provider = new ethers.JsonRpcProvider("http://localhost:8545");
        const signer = await provider.getSigner();

        // Encrypt and store OCF data
        const cid = await storeEncryptedOCF(ocfData, passphrase);

        // Call contract
        const abi = [
            "function issueShares(address to, uint256 amount, string memory cid)"
        ];
        const contract = new ethers.Contract(diamondAddress, abi, signer);

        const tx = await contract.issueShares(to, amount, cid);
        await tx.wait();

        res.status(201).json({ message: "Shares issued", cid });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to issue shares." });
    }
});

router.get("/:address", async (req, res) => {
    try {
        const { address } = req.params;
        const passphrase = req.query.passphrase as string;

        if (!passphrase) return res.status(400).json({ error: "Missing passphrase" });

        const provider = new ethers.JsonRpcProvider("http://localhost:8545");

        const abi = [
            "function getMyShares() view returns (tuple(uint256 amount, string cid)[])"
        ];
        const contract = new ethers.Contract(diamondAddress, abi, await provider.getSigner(address));
        const shares = await contract.getMyShares();

        const decryptedOCFs = await Promise.all(
            shares.map(async (s: any) => {
                const ocf = await decryptOCF(s.cid, passphrase);
                return {
                    amount: s.amount.toString(),
                    cid: s.cid,
                    ocf
                };
            })
        );

        res.json(decryptedOCFs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to retrieve or decrypt shares." });
    }
});

export default router;