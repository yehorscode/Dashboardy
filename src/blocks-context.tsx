import React, { createContext, useContext, useState, useEffect } from "react";

export type BlockType = "time" | "weather";

export interface Block {
  id: string;
  type: BlockType;
  x: number;
  y: number;
  visible: boolean;
}

interface BlocksContextType {
  blocks: Block[];
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
  toggleBlock: (id: string) => void;
  addBlock: (type: BlockType) => void;
  removeBlock: (id: string) => void;
  resetBlocks: () => void;
}

const BlocksContext = createContext<BlocksContextType | undefined>(undefined);

const BLOCKS_START: Block[] = [
  { id: "block-1", type: "time", x: -100, y: 0, visible: true },
  { id: "block-2", type: "weather", x: 100, y: 0, visible: true },
];

export function BlocksProvider({ children }: { children: React.ReactNode }) {
  const [blocks, setBlocks] = useState<Block[]>(() => {
    try {
      const saved = localStorage.getItem("newTabBlocks");
      if (saved) return JSON.parse(saved);
    } catch {}
    return BLOCKS_START;
  });

  useEffect(() => {
    localStorage.setItem("newTabBlocks", JSON.stringify(blocks));
  }, [blocks]);

  const toggleBlock = (id: string) => {
    setBlocks(blocks => blocks.map(b => b.id === id ? { ...b, visible: !b.visible } : b));
  };

  const addBlock = (type: BlockType) => {
    const nextId =
      blocks.reduce((max, b) => {
        const n = parseInt(b.id.replace("block-", ""));
        return isNaN(n) ? max : Math.max(max, n);
      }, 1) + 1;
    
    let x = 0, y = 0, step = 120;
    const taken = new Set(blocks.map(b => `${b.x},${b.y}`));
    while (taken.has(`${x},${y}`)) {
      x += step;
      if (x > 300) { x = 0; y += step; }
    }
    setBlocks([...blocks, { id: `block-${nextId}`, type, x, y, visible: true }]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks => blocks.filter(b => b.id !== id));
  };

  const resetBlocks = () => setBlocks(BLOCKS_START);

  return (
    <BlocksContext.Provider value={{ blocks, setBlocks, toggleBlock, addBlock, removeBlock, resetBlocks }}>
      {children}
    </BlocksContext.Provider>
  );
}

export function useBlocks() {
  const ctx = useContext(BlocksContext);
  if (!ctx) throw new Error("useBlocks must be used within BlocksProvider");
  return ctx;
}
