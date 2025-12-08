"use client";

import { CardAttributes } from "@/hooks/useCardFusion";

interface CollectionViewProps {
  myCards: bigint[];
  cardAttributes: Map<bigint, CardAttributes>;
  canDecrypt: boolean;
  isDecrypting: boolean;
  decryptCardAttributes: (cardId: bigint) => void;
}

export const CollectionView = ({
  myCards,
  cardAttributes,
  canDecrypt,
  isDecrypting,
  decryptCardAttributes,
}: CollectionViewProps) => {
  const sectionClass = "bg-white rounded-xl shadow-lg p-6 border border-gray-200";
  const titleClass = "font-bold text-gray-900 text-2xl mb-4 pb-2 border-b-2 border-indigo-500";

  return (
    <div className={sectionClass}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={titleClass}>🗂️ My Card Collection</h2>
        <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
          {myCards.length} {myCards.length === 1 ? "Card" : "Cards"}
        </span>
      </div>

      {myCards.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <svg className="mx-auto h-20 w-20 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-gray-500 text-xl font-medium mb-2">No cards in your collection yet</p>
          <p className="text-gray-400 text-sm">Head to the Mint Card section to create your first card!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myCards.map((cardId) => {
            const attributes = cardAttributes.get(cardId);
            return (
              <div
                key={cardId.toString()}
                className="border-2 border-gray-300 rounded-xl p-6 hover:shadow-xl transition-all bg-white hover:border-indigo-400"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-xl text-gray-900">Card #{cardId.toString()}</h3>
                  {attributes && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Revealed
                    </span>
                  )}
                </div>
                
                {attributes ? (
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                      <span className="font-semibold text-gray-700 text-sm">⚔️ Attack:</span>
                      <span className="font-bold text-red-600 text-lg">{attributes.attack?.clear?.toString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <span className="font-semibold text-gray-700 text-sm">🛡️ Defense:</span>
                      <span className="font-bold text-blue-600 text-lg">{attributes.defense?.clear?.toString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <span className="font-semibold text-gray-700 text-sm">💎 Rarity:</span>
                      <span className="font-bold text-purple-600 text-lg">{attributes.rarity?.clear?.toString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <span className="font-semibold text-gray-700 text-sm">✨ Special:</span>
                      <span className="font-bold text-yellow-600 text-lg">{attributes.specialPower?.clear?.toString()}</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <svg className="mx-auto h-16 w-16 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p className="text-gray-500 text-sm font-medium">Attributes Encrypted</p>
                    <p className="text-gray-400 text-xs mt-1">Click below to reveal</p>
                  </div>
                )}
                
                <button
                  className={`w-full px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                    attributes
                      ? "bg-green-100 text-green-700 cursor-default"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  }`}
                  disabled={!canDecrypt || isDecrypting || !!attributes}
                  onClick={() => decryptCardAttributes(cardId)}
                >
                  {attributes ? "✓ Attributes Revealed" : "🔓 Reveal Attributes"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

