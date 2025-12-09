"use client";

import { useState } from "react";

interface MintViewProps {
  canMint: boolean;
  isMinting: boolean;
  mintCard: (attack: number, defense: number, rarity: number, specialPower: number) => void;
}

export const MintView = ({ canMint, isMinting, mintCard }: MintViewProps) => {
  const [attack, setAttack] = useState<number>(50);
  const [defense, setDefense] = useState<number>(50);
  const [rarity, setRarity] = useState<number>(10);
  const [specialPower, setSpecialPower] = useState<number>(20);

  const sectionClass = "bg-white rounded-xl shadow-lg p-6 border border-gray-200";
  const titleClass = "font-bold text-gray-900 text-2xl mb-4 pb-2 border-b-2 border-indigo-500";
  const buttonClass =
    "inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md " +
    "transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg active:bg-indigo-800 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 " +
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 disabled:hover:shadow-md";

  return (
    <div className="max-w-3xl mx-auto">
      <div className={sectionClass}>
        <h2 className={titleClass}>🎴 Mint New Card</h2>
        <p className="text-gray-600 mb-6">Create a new card with encrypted attributes. All values are private and secured by FHEVM.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ⚔️ Attack Power
            </label>
            <input
              type="number"
              value={attack}
              onChange={(e) => setAttack(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-lg"
              min="0"
              max="100"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Min: 0</span>
              <span className="font-semibold text-indigo-600">Current: {attack}</span>
              <span>Max: 100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={attack}
              onChange={(e) => setAttack(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🛡️ Defense Power
            </label>
            <input
              type="number"
              value={defense}
              onChange={(e) => setDefense(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-lg"
              min="0"
              max="100"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Min: 0</span>
              <span className="font-semibold text-indigo-600">Current: {defense}</span>
              <span>Max: 100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={defense}
              onChange={(e) => setDefense(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              💎 Rarity Level
            </label>
            <input
              type="number"
              value={rarity}
              onChange={(e) => setRarity(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-lg"
              min="0"
              max="100"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Min: 0</span>
              <span className="font-semibold text-indigo-600">Current: {rarity}</span>
              <span>Max: 100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={rarity}
              onChange={(e) => setRarity(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ✨ Special Power
            </label>
            <input
              type="number"
              value={specialPower}
              onChange={(e) => setSpecialPower(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-lg"
              min="0"
              max="100"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Min: 0</span>
              <span className="font-semibold text-indigo-600">Current: {specialPower}</span>
              <span>Max: 100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={specialPower}
              onChange={(e) => setSpecialPower(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>
        </div>

        {/* Card Preview */}
        <div className="mb-6 p-6 bg-indigo-50 rounded-lg border-2 border-indigo-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Card Preview</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex justify-between items-center p-2 bg-red-50 rounded">
              <span className="font-semibold text-gray-700 text-sm">⚔️ Attack:</span>
              <span className="font-bold text-red-600">{attack}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
              <span className="font-semibold text-gray-700 text-sm">🛡️ Defense:</span>
              <span className="font-bold text-blue-600">{defense}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
              <span className="font-semibold text-gray-700 text-sm">💎 Rarity:</span>
              <span className="font-bold text-purple-600">{rarity}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
              <span className="font-semibold text-gray-700 text-sm">✨ Special:</span>
              <span className="font-bold text-yellow-600">{specialPower}</span>
            </div>
          </div>
        </div>

        <button
          className={buttonClass + " w-full text-lg"}
          disabled={!canMint}
          onClick={() => mintCard(attack, defense, rarity, specialPower)}
        >
          {isMinting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Minting Card...
            </>
          ) : canMint ? (
            "🎴 Mint New Card"
          ) : (
            "Cannot Mint Card"
          )}
        </button>

        <p className="text-xs text-gray-500 mt-3 text-center">
          Note: All card attributes will be encrypted on the blockchain
        </p>
      </div>
    </div>
  );
};

