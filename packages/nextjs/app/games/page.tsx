"use client";

import Link from "next/link";

type Game = {
  id: number;
  title: string;
  link: string;
  description: string;
  difficulty: string;
};

const games: Game[] = [
  {
    id: 1,
    title: "Chimp Test",
    link: "chimp-test",
    description: "Are You Smarter Than a Chimpanzee?",
    difficulty: "7",
  },
  {
    id: 2,
    title: "Number Memory",
    link: "number-memory",
    description: "Average person can remember 7 numbers at once",
    difficulty: "9",
  },
  {
    id: 3,
    title: "Reaction Test",
    link: "reaction",
    description: "Let's try to measure your reaction time...",
    difficulty: "5",
  },
];

const GamesPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Games</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {games.map(game => (
          <Link key={game.id} href={`/games/${game.link}`}>
            <div className="bg-slate-400 rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{game.title}</h2>
                <p className="text-gray-600 mb-2">{game.description}</p>
                <div className="bg-gray-200 text-gray-700 py-1 px-2 rounded-full inline-block text-xs">
                  Difficulty: {game.difficulty}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GamesPage;
