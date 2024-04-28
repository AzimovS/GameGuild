import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const ggtoken = await deploy("GGToken", {
    from: deployer,
    // Contract constructor arguments
    args: [deployer],
    log: true,
    waitConfirmations: 5,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });
  const ggTokenContract = await hre.ethers.getContract<Contract>("GGToken", deployer);
  const contractAcontract = await ggTokenContract.waitForDeployment();
  console.log(contractAcontract);

  const BASE_URI = "https://ironsoul0.github.io/brain/";
  // const rewardAccounts = [
  //   "0x8593561a4742D799535390BC5C7B992867e50A09",
  //   "0x0482Bb438b284a20E2384A07E3ccc83A968c4fC4",
  //   "0xF189Cc449626135aC793636D3bC39301a29607ec",
  //   "0xdac17f958d2ee523a2206206994597c13d831ec7",
  //   "0xd945f759d422ae30a6166838317b937de08380e3",
  //   "0x89012446b350CeacDe47402d831059797dcE8aC6",
  // ];

  // const rewardTokens = rewardAccounts.map(() => parseEther(Math.floor(Math.random() * 100 + 1).toString()));

  // for (let i = 0; i < rewardTokens.length; i++) {
  //   console.log(formatEther(rewardTokens[i]));
  // }
  // console.log(rewardAccounts, rewardTokens);
  // ggTokenContract.rewardTokensBatch(rewardAccounts, rewardTokens);

  const nftContract = await deploy("BrainNFT", {
    from: deployer,
    // Contract constructor arguments
    args: [ggtoken?.address, BASE_URI],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  await ggTokenContract.setBurner(nftContract.address);

  // Get the deployed contract to interact with it after deploying.
  // const yourContract = await hre.ethers.getContract<Contract>("YourContract", deployer);
  // console.log("👋 Initial greeting:", await yourContract.greeting());
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["YourContract"];
