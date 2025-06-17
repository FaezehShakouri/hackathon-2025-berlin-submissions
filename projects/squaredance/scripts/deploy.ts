import "@nomiclabs/hardhat-ethers";
import pkg from "hardhat";
const { ethers } = pkg;
import {FunctionFragment} from "ethers";
import fs from 'fs';

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying as:", deployer.address);

    const DiamondCutFacet = await ethers.getContractFactory("DiamondCutFacet");
    const diamondCutFacet = await DiamondCutFacet.deploy();
    await diamondCutFacet.waitForDeployment();
    const diamondCutFacetAddress = await diamondCutFacet.getAddress();
    console.log("DiamondCutFacet deployed at:", diamondCutFacetAddress);

    const Diamond = await ethers.getContractFactory("CapTableDiamond");
    const diamond = await Diamond.deploy(deployer.address, diamondCutFacetAddress);
    await diamond.waitForDeployment();
    const diamondAddress = await diamond.getAddress();
    console.log("Diamond deployed at:", diamondAddress);
    fs.writeFileSync('.env', `DIAMOND_ADDRESS=${diamondAddress}\n`);

    const AdminFacet = await ethers.getContractFactory("AdminFacet");
    const adminFacet = await AdminFacet.deploy();
    await adminFacet.waitForDeployment();
    const adminFacetAddress = await adminFacet.getAddress();
    console.log("AdminFacet deployed at:", adminFacetAddress);

    const ContributorFacet = await ethers.getContractFactory("ContributorFacet");
    const contributorFacet = await ContributorFacet.deploy();
    await contributorFacet.waitForDeployment();
    const contributorFacetAddress = await contributorFacet.getAddress();
    console.log("ContributorFacet deployed at:", contributorFacetAddress);

    const IssuanceFacet = await ethers.getContractFactory("IssuanceFacet");
    const issuanceFacet = await IssuanceFacet.deploy();
    await issuanceFacet.waitForDeployment();
    const issuanceFacetAddress = await issuanceFacet.getAddress();
    console.log("IssuanceFacet deployed at:", issuanceFacetAddress);

    const diamondCut = await ethers.getContractAt("IDiamondCut", diamondAddress);

    const extractSelectors = (iface: any) =>
        iface.fragments
            .filter((f: any): f is FunctionFragment => f.type === "function")
            .map((f: FunctionFragment) => iface.getFunction(f.name)?.selector);

    const adminSelectors = extractSelectors(AdminFacet.interface);
    const contributorSelectors = extractSelectors(ContributorFacet.interface);
    const issuanceSelectors = extractSelectors(IssuanceFacet.interface);

    console.log("AdminFacet selectors:", adminSelectors);
    console.log("ContributorFacet selectors:", contributorSelectors);
    console.log("IssuanceFacet selectors:", issuanceSelectors);

    const cut = [
        {
            facetAddress: adminFacetAddress,
            action: 0,
            functionSelectors: adminSelectors
        },
        {
            facetAddress: contributorFacetAddress,
            action: 0,
            functionSelectors: contributorSelectors
        },
        {
            facetAddress: issuanceFacetAddress,
            action: 0,
            functionSelectors: issuanceSelectors
        }
    ];

    const tx = await diamondCut.diamondCut(cut, ethers.ZeroAddress, "0x");
    await tx.wait();
    console.log("All facets added via diamondCut.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});