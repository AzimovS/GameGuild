"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const CoinsContext = createContext<{
  coins: number;
  setCoins?: any;
}>({ coins: 0, setCoins: () => null });

export const CoinsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coins, setCoins] = useState(typeof window !== "undefined" ? Number(localStorage.getItem("coins")) : 0);

  useEffect(() => {
    localStorage.setItem("coins", coins.toString());
  }, [coins]);

  return <CoinsContext.Provider value={{ coins, setCoins }}>{children}</CoinsContext.Provider>;
};

export const useCoinsContext = () => useContext(CoinsContext);
