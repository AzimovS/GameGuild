"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useAccount } from "wagmi";
import { GameTemplate } from "~~/components/GameTemplate/component";
import { AlarmIcon, ReactionIcon } from "~~/components/icons";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { rewardTokens } from "~~/utils/rewardTokens";
import { notification } from "~~/utils/scaffold-eth";

const MIN_COUNT_DOWN = 2000;
const MAX_COUNT_DOWN = 4000;
const NUM_ROUND = 4;
const icon = <AlarmIcon />;

const ReactionGame = () => {
  const { address: connectedAddress } = useAccount();
  const { targetNetwork } = useTargetNetwork();

  const { push } = useRouter();

  const [activeGame, setActiveGame] = useState(false);

  const [roundState, setRoundState] = useState(-1);
  const [falseStart, setFalseStart] = React.useState(false);
  const [level, setLevel] = useState(1);
  const [timerStart, setTimerStart] = useState(0);
  const [lastScore, setLastScore] = useState(0);
  const [sumScore, setSumScore] = useState(0);
  const [timerId, setTimerId] = useState(setTimeout(() => "", 1));

  const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  useEffect(() => setRoundState(0), [activeGame]);

  useEffect(() => {
    if (roundState == 0) {
      setTimerId(
        setTimeout(() => {
          setRoundState(1);
          setTimerStart(Date.now());
        }, getRandomInt(MIN_COUNT_DOWN, MAX_COUNT_DOWN)),
      );
    } else clearTimeout(timerId);
  }, [roundState]);

  const handleClick = () => {
    if (roundState == 0) {
      setFalseStart(true);
      setRoundState(2);
    } else if (roundState == 1) {
      setLastScore(Date.now() - timerStart);
      setSumScore(sumScore + Date.now() - timerStart);
      if (level == NUM_ROUND) {
        setRoundState(3);
      } else {
        setFalseStart(false);
        setRoundState(2);
      }
    } else if (roundState == 2) {
      if (!falseStart) setLevel(level + 1);
      setRoundState(0);
    } else if (roundState == 3) {
    }
  };

  const returnToHomePage = () => {
    push("/");
  };

  const restartGame = () => {
    setRoundState(0);
    setSumScore(0);
    setLevel(1);
    setLastScore(0);
  };

  let gameBody;
  if (roundState == 0) {
    gameBody = (
      <div className="px-4 text-center">
        <h2 className="text-2xl font-bold text-white fade">Prepare for green screen..</h2>
      </div>
    );
  } else if (roundState == 1) {
    gameBody = (
      <div className="px-4 text-center">
        <h2 className="text-2xl font-bold text-white fade">Click!</h2>
      </div>
    );
  } else if (roundState == 2) {
    gameBody = (
      <div className="px-4 text-center">
        {falseStart && (
          <>
            <h2 className="text-2xl font-bold text-white fade">Too soon!</h2>
            <p className="mt-5 text-3xl text-white">Click to try again</p>
          </>
        )}
        {!falseStart && (
          <>
            <h2 className="text-2xl font-bold text-white fade">Your result: {lastScore} milliseconds</h2>
            <p className="mt-5 text-3xl text-white">Click to move to the next round</p>
          </>
        )}
      </div>
    );
  } else if (roundState == 3) {
    gameBody = (
      <div className="px-4 text-center">
        <h2 className="text-2xl font-bold text-white fade">Your last result: {lastScore} milliseconds </h2>
        <h2 className="mt-3 text-3xl font-bold text-white fade">
          Average reaction time: {sumScore / NUM_ROUND} milliseconds{" "}
        </h2>
        <div className="mx-auto">
          <button
            onClick={restartGame}
            className="py-3 mt-4 font-bold text-white rounded px-14 focus:outline-none bg-purple-950 ring-purple-800 transition-all hover:ring-2"
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
      </div>
    );
  }

  const pregameText = (
    <>
      <div className="flex items-center mt-4 text-white">
        <ReactionIcon className="mr-4 -ml-4 text-white h-28" />
        <div>
          <h2 className="text-4xl font-bold text-white fade">Reaction game</h2>
          <p className="mt-2 text-xl text-white">Let&apos;s try to measure your reaction time...</p>
        </div>
      </div>
      <div className="mt-4 mb-4 text-white">
        <p className="mb-5 text-xl font-bold text-white">Description</p>
        <p className="mb-4 text-white">The average (median) reaction time is 273 milliseconds.</p>
        <p className="text-white">
          In addition to measuring your reaction time, this test is affected by the latency of your computer and
          monitor. Using a fast computer and low latency / high framerate monitor will improve your score.
        </p>
        <p className="mt-4 text-white">
          Scores in this test are faster than the aim trainer test, because you can react instantly without moving the
          cursor.
        </p>
        <p className="mt-4 text-white">
          This is discused in further detail on the the statistics page. While an average human reaction time may fall
          between 200-250ms, your computer could be adding 10-50ms on top. Some modern TVs add as much as 150ms!
        </p>
        <div className="mt-4">
          <p>
            <b>Difficulty: </b>5
          </p>
          <p>
            <b>Coins for average &gt; 1000MS: </b>
            10 GG
          </p>
          <p>
            <b>Coins for average &lt; 1000MS: </b>
            25 GG
          </p>
          <p>
            <b>Coins for average &lt; 500MS: </b>
            50 GG
          </p>
          <p>
            <b>Coins for average &lt; 250MS: </b>
            100 GG
          </p>
        </div>
      </div>
    </>
  );

  const gameDesc = (
    <div className="text-center animate-smooth-appear">
      <ReactionIcon className="w-32 mx-auto text-white animate-pulse-fast" />
      <h2 className="text-4xl font-bold text-white fade">Reaction time</h2>
      <p className="mt-5 text-2xl text-white">When the black screen turns green, click as quickly as you can.</p>
      <p className="mt-2 text-2xl text-white">Click anywhere to start.</p>
    </div>
  );

  useEffect(() => {
    if (roundState === 3) {
      const avg = sumScore / NUM_ROUND;
      let reward = 10;
      if (avg < 250.0) {
        reward = 100;
      } else if (avg < 500) {
        reward = 50;
      } else if (avg < 1000) {
        reward = 25;
      }

      if (connectedAddress) {
        rewardTokens(connectedAddress, reward.toString(), targetNetwork?.id);
        notification.success(`Wow! You got ${reward} GG tokens!`);
      }
    }
  }, [roundState, sumScore]);

  return (
    <div className="flex justify-center">
      <div className="mt-5 max-w-4xl mx-auto min-w-[50%] border">
        <GameTemplate
          name="Reaction Test"
          icon={icon}
          activeGame={activeGame}
          setActiveGame={setActiveGame}
          className={clsx([!activeGame && "px-4"])}
          pregameText={pregameText}
          gameDesc={gameDesc}
        >
          {roundState != 1 && (
            <div className={clsx("flex items-center justify-center w-full h-screen")} onClick={() => handleClick()}>
              {gameBody}
            </div>
          )}
          {roundState == 1 && (
            <div
              className="flex items-center justify-center w-full h-screen bg-green-500"
              onClick={() => handleClick()}
            >
              {gameBody}
            </div>
          )}
        </GameTemplate>
      </div>
    </div>
  );
};

export default ReactionGame;
