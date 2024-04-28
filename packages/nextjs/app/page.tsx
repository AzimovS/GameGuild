"use client";

import type { NextPage } from "next";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { NFTCard } from "~~/components/NftCard/nftCard";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import rewardIcon from "~~/public/reward.svg";
import { BRONZE_THRESHOLD, GOLD_THRESHOLD, SILVER_THRESHOLD, bronzeNFT, goldNFT, silverNFT } from "~~/utils/nftdata";
import { notification } from "~~/utils/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const { data: synced } = useScaffoldReadContract({
    contractName: "GGToken",
    functionName: "balanceOf",
    args: [connectedAddress],
    watch: true,
  });

  const { data: ownershipCount } = useScaffoldReadContract({
    contractName: "BrainNFT",
    functionName: "getOwnershipCount",
    args: [connectedAddress],
    watch: true,
  });

  const {
    writeContractAsync: nftContract,
    isSuccess: isNFTContractSuccess,
    isError: isNFTContractError,
  } = useScaffoldWriteContract("BrainNFT");

  const claimNFT = (index: number) => {
    nftContract({ functionName: "claimNFT", args: [BigInt(index)] });
    if (isNFTContractError) {
      notification.error("Something went wrong");
    } else if (isNFTContractSuccess) {
      notification.success("NFT was sent");
    }
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div>
          <div className="flex items-center mb-3">
            <img alt="icon" src={rewardIcon.src} />
            <div className="ml-4">
              <p className="text-3xl font-bold text-white">Rewards</p>
              <p className="text-lg text-white opacity-80">Play games and claim exclusive NFTs!</p>
            </div>
          </div>

          <div className="flex">
            {synced != null && (
              <div className="px-4 bg-blue-950 rounded-xl">
                <p className="text-sm text-gray-300">
                  Your GG tokens: <span className="text-md font-bold text-white">{formatEther(synced)}</span>
                </p>
              </div>
            )}
          </div>

          <div className="animate-smooth-appear">
            <p className="inline-block px-4 py-2 mt-8 text-xl text-white rounded-md bg-blue-950">Regular</p>
            <div className="mt-4 grid grid-cols-12 gap-4">
              {bronzeNFT.map((n, i) => (
                <div key={n.image} className="col-span-6">
                  <NFTCard
                    imageUrl={n.image}
                    name={n.name}
                    desc={n.requiredScore}
                    contentLeft={n.gen}
                    contentRight={n.supply}
                    contentMain={n.description}
                    handleClick={() => claimNFT(i + 1)}
                    insufficient={synced == null ? true : Number(formatEther(synced)) < BRONZE_THRESHOLD}
                    owned={!!ownershipCount?.[i + 1]}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="animate-smooth-appear">
            <p className="inline-block px-4 py-2 mt-8 text-xl text-white rounded-md bg-gradient-to-r from-[#6b778b] to-[#abb0b9]">
              Silver
            </p>
            <div className="mt-4 grid grid-cols-12 gap-x-4 gap-y-8 animate-smooth-appear">
              {silverNFT.map((n, i) => (
                <div key={n.image} className="col-span-6">
                  <NFTCard
                    imageUrl={n.image}
                    name={n.name}
                    desc={n.requiredScore}
                    contentLeft={n.gen}
                    contentRight={n.supply}
                    contentMain={n.description}
                    handleClick={() => claimNFT(i + 3)}
                    insufficient={synced == null ? true : Number(formatEther(synced)) < SILVER_THRESHOLD}
                    owned={!!ownershipCount?.[i + 3]}
                  />
                </div>
              ))}
            </div>
          </div>

          <p className="inline-block px-4 py-2 mt-8 text-xl text-white rounded-md bg-gradient-to-r from-[#ffb600] to-[#eed08a]">
            Gold
          </p>
          <div className="mt-4 grid grid-cols-12 gap-4 animate-smooth-appear">
            {goldNFT.map((n, i) => (
              <div key={n.image} className="col-span-6">
                <NFTCard
                  imageUrl={n.image}
                  name={n.name}
                  desc={n.requiredScore}
                  contentLeft={n.gen}
                  contentRight={n.supply}
                  contentMain={n.description}
                  handleClick={() => claimNFT(i + 8)}
                  insufficient={synced == null ? true : Number(formatEther(synced)) < GOLD_THRESHOLD}
                  owned={!!ownershipCount?.[i + 8]}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
