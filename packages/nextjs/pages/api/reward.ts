import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import { parseEther } from "viem";
import deployedContracts from "~~/contracts/deployedContracts";

export default async function handler(request: NextApiRequest, res: NextApiResponse) {
  try {
    const { address: sendToAddress, tokens, chainId } = JSON.parse(request.body);

    const provider = new ethers.JsonRpcProvider(
      chainId == 59141 ? process.env.NEXT_PUBLIC_LINEA_API : process.env.NEXT_PUBLIC_ALCHEMY_API,
    );
    const signer = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY!, provider);
    const contract = new ethers.Contract(
      chainId == 59141 ? "0x3526c0fc8453748e08daa3723a620efac386ea4f" : "0xbfcd7fd7506071db94ad478aee027806d47c310d",
      deployedContracts[chainId as keyof typeof deployedContracts]["GGToken"]["abi"],
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
