import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import { parseEther } from "viem";
import deployedContracts from "~~/contracts/deployedContracts";

export default async function handler(request: NextApiRequest, res: NextApiResponse) {
  try {
    const { address: sendToAddress, tokens } = JSON.parse(request.body);

    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_ALCHEMY_API);
    const signer = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY!, provider);
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_GGTOKEN_CONTRACT_ADDRESS as string,
      deployedContracts[11155111]["GGToken"]["abi"],
      signer,
    );

    // Perform the contract function call
    await contract.rewardTokens(sendToAddress, parseEther(tokens));

    res.status(200).json({
      success: true,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: e });
  }
}
