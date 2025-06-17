import express from 'express';
import { ethers } from 'ethers';

const router = express.Router();
const diamondAddress = process.env.DIAMOND_ADDRESS!;

router.post('/', async (req, res) => {
    const { contributorAddress, encryptedCID } = req.body;
    try {
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        const signer = await provider.getSigner();

        const iface = new ethers.Interface([
            "function addContributor(address contributor, string encryptedCID)"
        ]);

        const contract = new ethers.Contract(diamondAddress, iface, signer);
        const tx = await contract.addContributor(contributorAddress, encryptedCID);
        await tx.wait();

        res.status(200).json({ message: 'Contributor added', contributorAddress });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add contributor' });
    }
});

export default router;