import React from "react";

interface Props {
  imageUrl: string;
  name: string;
  desc: string;
  contentLeft: string;
  contentRight: string;
  contentMain: string;
  handleClick?: () => void;
  insufficient: boolean;
  owned?: boolean;
}

export const NFTCard: React.FC<Props> = ({
  imageUrl,
  name,
  desc,
  contentLeft,
  contentMain,
  handleClick,
  insufficient,
  owned,
}: Props) => {
  return (
    <div className="rounded-2xl border-2 border-slate-500">
      <div className="relative">
        <div
          className="rounded-lg h-60"
          style={{
            backgroundImage: "url(" + imageUrl + ")",
            backgroundSize: "contain",
            backgroundRepeat: "none",
          }}
        />
        <div className="absolute z-10 bottom-2 left-4">
          <p className="text-xl font-bold text-black">{name}</p>
          <p className="text-xs text-black">{desc}</p>
        </div>
      </div>
      <hr
        style={{
          borderColor: "#2c3a43",
        }}
      />
      <div className="px-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-300 uppercase">{contentLeft}</p>
        </div>
        <p className="mt-0 mb-4 overflow-hidden text-xs italic text-gray-300">{contentMain}</p>

        {!insufficient && !owned && (
          <button
            style={{ width: "100%" }}
            onClick={handleClick}
            className="block px-4 py-4 my-2 font-bold text-white rounded focus:outline-none bg-purple-950 ring-purple-800 transition-all hover:ring-2"
          >
            Mint NFT Card
          </button>
        )}
        {insufficient && !owned && (
          <div className="py-0.5 mb-2 font-bold text-center text-white rounded focus:outline-none transition-all bg-blue-950">
            <p>Insufficient GG tokens</p>
          </div>
        )}
        {owned && (
          <div className="py-0.5 mb-2 font-bold text-center text-white rounded focus:outline-none transition-all bg-slate-700">
            <p>Already owned</p>
          </div>
        )}
      </div>
    </div>
  );
};
