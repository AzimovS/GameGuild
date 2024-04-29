"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useAccount } from "wagmi";
import { GameTemplate } from "~~/components/GameTemplate/component";
import { NumberMemoryIcon } from "~~/components/icons";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { rewardTokens } from "~~/utils/rewardTokens";
import { notification } from "~~/utils/scaffold-eth";

const icon = <NumberMemoryIcon />;

const ProgressBar = ({ progressPercentage }: { progressPercentage: number | string }) => {
  return (
    <div className="w-full h-1 bg-gray-300">
      <div
        className={`h-full ${Number(progressPercentage) < 70 ? "bg-red-600" : "bg-green-600"}`}
        style={{ width: `${Number(progressPercentage) * 100}%` }}
      ></div>
    </div>
  );
};

const REWARD = 10;

const NumberMemory: React.FC = () => {
  const { address: connectedAddress } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  const { push } = useRouter();

  const [activeGame, setActiveGame] = useState(false);
  const [level, setLevel] = useState(3);
  const [guess, setGuess] = useState("");
  const [counter, setCounter] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const [gameActive, setGameActive] = useState(1);
  const [answer, setAnswer] = useState(getRandomInt(Math.pow(10, 2), Math.pow(10, 3)));

  const restartGame = () => {
    setCounter(0);
    setLevel(3);
    setGuess("");
    setAnswer(getRandomInt(Math.pow(10, 2), Math.pow(10, 3)));
    setInputValue("");
    setGameActive(1);
  };

  let res;

  const handleInputChange = (event: any) => {
    setGuess(event.target.value);
    setInputValue(event.target.value);
  };

  const sendUserInput = () => {
    setInputValue("");
    if (guess !== answer.toString()) {
      setGameActive(4);
    } else {
      setGameActive(3);
    }
  };

  const callNextLevel = () => {
    const randNumber = getRandomInt(Math.pow(10, level), Math.pow(10, level + 1));
    setLevel(level + 1);
    setAnswer(randNumber);
    setGameActive(1);
    setCounter(0);
  };

  const returnToHomePage = () => {
    push("/");
  };

  useEffect(() => {
    if (gameActive === 4) {
      notification.success(`Wow! You got ${level * REWARD - 20} GG tokens!`);
      if (connectedAddress) {
        rewardTokens(connectedAddress, (level * REWARD - 20).toString(), targetNetwork?.id);
      }
    }
  }, [gameActive, level]);

  useEffect(() => {
    if (!activeGame) return;

    counter < 1 && setTimeout(() => setCounter(counter + 0.01), 20);

    if (counter >= 1) {
      setGameActive(2);
    }
  }, [activeGame, counter]);

  if (gameActive === 1) {
    res = (
      <>
        <div>
          <p
            className={clsx([
              level <= 5 && "text-8xl",
              level === 6 && "text-7xl",
              level === 7 && "text-6xl",
              level === 8 && "text-5xl",
              level > 8 && "text-4xl",
              "mb-7",
            ])}
            style={{ color: "white" }}
          >
            {" "}
            {answer}{" "}
          </p>
        </div>
        <div className="round-progress">
          <ProgressBar progressPercentage={counter}></ProgressBar>
        </div>
      </>
    );
  } else if (gameActive === 2) {
    res = (
      <>
        <p className="mb-3 round-p">Which number it was?</p>
        <input
          className="block w-full px-4 py-3 text-3xl font-bold text-center text-white border-2 border-gray-600 rounded focus:outline-none bg-gray-750"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
        ></input>

        <button
          onClick={sendUserInput}
          disabled={!inputValue}
          className="py-3 mt-4 font-bold text-white rounded px-14 focus:outline-none bg-purple-950 ring-purple-800 transition-all hover:ring-2"
        >
          Submit
        </button>
      </>
    );
  } else if (gameActive === 3) {
    res = (
      <>
        <p className="round-p"> Number </p>
        <p className="round-p-lg"> {answer} </p>
        <p className="round-p"> Your answer </p>
        <p className="round-p-lg"> {guess} </p>
        <p className="my-4 text-4xl font-bold text-white animate-pulse">Level {level}</p>
        <button
          onClick={callNextLevel}
          className="py-3 mt-2 font-bold text-white rounded px-14 focus:outline-none bg-purple-950 ring-purple-800 transition-all hover:ring-2"
        >
          Next
        </button>
      </>
    );
  } else {
    res = (
      <>
        <p className="round-p"> Number </p>
        <p className="round-p-lg"> {answer} </p>
        <p className="round-p"> Your answer </p>
        <p
          className="round-p-lg "
          style={{
            textDecorationLine: "line-through",
            textDecorationStyle: "solid",
          }}
        >
          {guess}
        </p>
        <h3 className="mt-6 mb-2 text-4xl font-bold text-white">Level: {level}</h3>
        <h3 className="mb-8 text-4xl font-bold text-white">Reward: {level * REWARD - 20} GG tokens</h3>
        <div className="mx-auto">
          <button
            onClick={restartGame}
            className="py-3 mt-2 font-bold text-white rounded px-14 focus:outline-none bg-purple-950 ring-purple-800 transition-all hover:ring-2"
          >
            Try again
          </button>
        </div>
        <button
          onClick={returnToHomePage}
          className="px-4 py-3 mt-4 ml-3 font-bold text-black bg-gray-200 rounded focus:outline-none"
        >
          Main page
        </button>
      </>
    );
  }

  const pregameText = (
    <>
      <div className="flex items-center mt-6 text-white">
        <NumberMemoryIcon className="-ml-4 text-white h-28 w-30" />
        <div className="ml-4">
          <h2 className="text-4xl font-bold text-white fade">Number memory</h2>
          <p className="mt-2 text-xl text-white">Average person can remember 7 numbers at once..</p>
        </div>
      </div>
      <div className="mt-4 mb-4 text-white">
        <p className="mb-5 text-xl font-bold text-white">Description</p>
        <p className="mb-4 text-white">
          The average person can only remember 7 digit numbers reliably, but it&apos;s possible to do much better using
          mnemonic techniques. Some helpful links are provided below.
        </p>
        <div className="mt-4">
          <p>
            <b>Difficulty: </b>9
          </p>
          <p>
            <b>Coins per level: </b>
            {REWARD} GG
          </p>
        </div>
      </div>
    </>
  );

  const gameDesc = (
    <div className="text-center animate-smooth-appear">
      <NumberMemoryIcon className="w-32 mx-auto text-white animate-pulse-fast" />
      <h2 className="text-4xl font-bold text-white fade">Number memory</h2>
      <p className="mt-5 text-2xl text-white">Remember numbers appearing on the screen.</p>
      <p className="mt-2 text-2xl text-white">The test will get progressively harder.</p>
      <p className="mt-2 text-2xl text-white">Click anywhere to start.</p>
    </div>
  );

  return (
    <div className="flex justify-center">
      <div className="mt-5 max-w-4xl mx-auto min-w-[50%] border">
        <GameTemplate
          name="Number Memory"
          icon={icon}
          activeGame={activeGame}
          setActiveGame={setActiveGame}
          pregameText={pregameText}
          gameDesc={gameDesc}
          className="px-4"
        >
          <div className="round-main">{res}</div>
        </GameTemplate>
      </div>
    </div>
  );
};

export default NumberMemory;
