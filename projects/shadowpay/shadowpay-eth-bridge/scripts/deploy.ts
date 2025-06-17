import { ethers } from "hardhat";

async function main() {
  const usdcAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; 
  const backendAddress = "0xf99e85bCdF99FAc150A62F3B45194524F5a2c8A3";

  const ShieldedEscrow = await ethers.getContractFactory("ShieldedEscrow");
  const shieldedEscrow = await ShieldedEscrow.deploy(usdcAddress, backendAddress);

  await shieldedEscrow.waitForDeployment();

  console.log(`ShieldedEscrow deployed to: ${await shieldedEscrow.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
