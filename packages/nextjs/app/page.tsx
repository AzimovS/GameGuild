"use client";

import clsx from "clsx";
import type { NextPage } from "next";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";
import { NFTCard } from "~~/components/NftCard/nftCard";
import { SyncIcon } from "~~/components/icons";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import rewardIcon from "~~/public/reward.svg";
import { useCoinsContext } from "~~/services/store/coinsContext";
import { notification } from "~~/utils/scaffold-eth";

const BRONZE_THRESHOLD = 50;
const SILVER_THRESHOLD = 300;
const GOLD_THRESHOLD = 500;

const bronzeNFT = [
  {
    image: "https://ironsoul0.github.io/bronze/brain1.png",
    name: "Smally brain",
    description: "The brains of crypto beginners.",
    requiredScore: "Requires 50 on-chain GG",
    gen: "gen 1 - 1",
    supply: "supply: 12323",
  },
  {
    image: "https://ironsoul0.github.io/bronze/brain2.png",
    name: "Mini brain",
    description: "Another type of brains of crypto beginners.",
    requiredScore: "Requires 50 on-chain GG",
    gen: "gen 1 - 2",
    supply: "supply: 21321",
  },
];
const silverNFT = [
  {
    image: "https://ironsoul0.github.io/silver/brain1.png",
    name: "Miner's brain",
    description: "The brain of average mining enjoyer.",
    requiredScore: "Requires 300 on-chain GG",
    gen: "gen 2 - 1",
    supply: "supply: 423",
  },
  {
    image: "https://ironsoul0.github.io/silver/brain2.png",
    name: "Average brain",
    description: "The brain of experienced crypto dog.",
    requiredScore: "Requires 300 on-chain GG",
    gen: "gen 2 - 2",
    supply: "supply: 321",
  },
  {
    image: "https://ironsoul0.github.io/silver/brain3.png",
    name: "Axis brain",
    description: "The geek brains of the geek personality.",
    requiredScore: "Requires 300 on-chain GG",
    gen: "gen 2 - 3",
    supply: "supply: 453",
  },
  {
    image: "https://ironsoul0.github.io/silver/brain4.png",
    name: "Middly brain",
    description: "The brain of average mining enjoyer.",
    requiredScore: "Requires 300 on-chain GG",
    gen: "gen 2 - 4",
    supply: "supply: 233",
  },
  {
    image: "https://ironsoul0.github.io/silver/brain5.png",
    name: "Minted brain",
    description: "The brain that undergo minting.",
    requiredScore: "Requires 300 on-chain GG",
    gen: "gen 2 - 5",
    supply: "supply: 195",
  },
];
const goldNFT = [
  {
    image: "https://ironsoul0.github.io/gold/brain1.gif",
    name: "Geek brain",
    description: "The brain of the real geek.",
    requiredScore: "Requires 500 on-chain GG",
    gen: "gen 5 - 1",
    supply: "supply: 23",
  },
  {
    image: "https://ironsoul0.github.io/gold/brain2.gif",
    name: "Jet brain",
    description: "The brain of the real jet man.",
    requiredScore: "Requires 500 on-chain GG",
    gen: "gen 5 - 2",
    supply: "supply: 10",
  },
];

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { coins, setCoins } = useCoinsContext();

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

  const { writeContract: ggContract, isSuccess: isGGContractSuccess } = useScaffoldWriteContract("GGToken");
  const {
    writeContract: nftContract,
    isSuccess: isNFTContractSuccess,
    isError: isNFTContractError,
  } = useScaffoldWriteContract("BrainNFT");

  const claimTokens = () => {
    ggContract({ functionName: "claimTokens", args: [parseEther(coins.toString())] });
    if (isGGContractSuccess) {
      notification.success("Token were claimed");
      setCoins(0);
    } else {
      notification.error("Something went wrong");
    }
  };

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
      {synced && ownershipCount ? (
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
              {!!synced && (
                <div className="px-4 bg-blue-950 rounded-xl">
                  <p className="text-sm text-gray-300">Synced on-chain</p>
                  <p className="text-xl font-bold text-white">{formatEther(synced)}</p>
                </div>
              )}
              <div className="ml-4">
                <div className="flex items-center px-4 bg-blue-950 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-300">Pending</p>
                    <div className="block">
                      <p className="mr-2 text-xl font-bold text-white">{coins}</p>
                    </div>
                  </div>
                  <button
                    className={clsx(
                      "px-3 py-2 mt-9 font-bold text-white bg-purple-950 ring-purple-920 rounded focus:outline-none transition-all",
                      coins === 0 && "cursor-not-allowed ring-0 opacity-50",
                      coins > 0 && "hover:ring-2",
                    )}
                    onClick={claimTokens}
                    disabled={coins === 0}
                  >
                    <SyncIcon className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
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
                      insufficient={Number(formatEther(synced)) < BRONZE_THRESHOLD}
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
                      insufficient={Number(formatEther(synced)) < SILVER_THRESHOLD}
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
                    insufficient={Number(formatEther(synced)) < GOLD_THRESHOLD}
                    owned={!!ownershipCount?.[i + 8]}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-14 text-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
    </>
  );
};

export default Home;
