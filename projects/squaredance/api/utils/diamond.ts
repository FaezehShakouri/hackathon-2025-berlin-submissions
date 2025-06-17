import dotenv from 'dotenv';

dotenv.config();

export const getDiamondAddress = (): string => {
    const addr = process.env.DIAMOND_ADDRESS;
    if (!addr) throw new Error("Missing DIAMOND_ADDRESS in .env");
    return addr;
};