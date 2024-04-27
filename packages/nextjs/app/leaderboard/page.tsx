"use client";

import clsx from "clsx";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const UserRow = ({ address, score, index }: { address: string; score: string; index: number }) => {
  const { address: connectedAddress } = useAccount();

  return (
    <div className={clsx(["flex mx-2 justify-between"])}>
      <div className="flex flex-col items-start justify-center">
        <div className="flex items-center">
          <div>
            <p className="flex flex-col w-6 text-white truncate align-middle text-md font-regular">{index}</p>
          </div>
          <div className="ml-6 w-36">
            <Address size="sm" address={address} />
            {address === connectedAddress ? " (you)" : ""}
          </div>
          <p
            style={{ borderColor: "#784FFE", color: "#E7DFFF" }}
            className="flex items-center justify-center w-32 h-6 py-1 py-4 ml-24 text-xs font-bold border-2 rounded-md"
          >
            {score}
          </p>
        </div>
      </div>
    </div>
  );
};

const LeaderboardPage = () => {
  const { data: users } = useScaffoldReadContract({
    contractName: "GGToken",
    functionName: "getUsers",
    watch: true,
  });

  if (users) {
    (users as any[]).sort((a, b) => {
      return Number(b.balance) - Number(a.balance);
    });
  }

  return (
    <>
      <div className="mt-8 mx-auto">
        <div>
          <div className="flex items-center">
            <div className="ml-4">
              <p className="text-3xl font-bold text-white">Leaderboard</p>
              <p className="text-lg text-white opacity-80">TOP 10 participants sorted by on-chain GG tokens</p>
            </div>
          </div>

          {users && users.length > 0 && (
            <div>
              {users.map((user: any, index: any) => (
                <UserRow key={index} score={formatEther(user.balance)} address={user.addr} index={index + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LeaderboardPage;
