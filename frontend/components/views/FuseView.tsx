"use client";

import { CardAttributes } from "@/hooks/useCardFusion";

interface FuseViewProps {
  myCards: bigint[];
  cardAttributes: Map<bigint, CardAttributes>;
  canFuse: boolean;
  isFusing: boolean;
  fuseCards: (card1: bigint, card2: bigint) => void;
}

export const FuseView = ({
  myCards,
  cardAttributes,
  canFuse,
  isFusing,
  fuseCards,
}: FuseViewProps) => {
  const sectionClass = "bg-white rounded-xl shadow-lg p-6 border border-gray-200";
  const titleClass = "font-bold text-gray-900 text-2xl mb-4 pb-2 border-b-2 border-indigo-500";
  const buttonClass =
    "inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md " +
    "transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg active:bg-indigo-800 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 " +
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 disabled:hover:shadow-md";

  if (myCards.length < 2) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className={sectionClass}>
          <h2 className={titleClass}>🔮 Fuse Cards</h2>
          <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <svg className="mx-auto h-20 w-20 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 text-xl font-medium mb-2">Not Enough Cards</p>
            <p className="text-gray-400 text-sm">You need at least 2 cards to perform fusion</p>
            <p className="text-gray-400 text-sm mt-4">
              Current cards: <span className="font-bold text-indigo-600">{myCards.length}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className={sectionClass}>
        <h2 className={titleClass}>🔮 Fuse Cards</h2>
        <p className="text-gray-600 mb-6">Combine two cards to create a new one! The new card will have merged attributes based on both parent cards.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              First Card
            </label>
            <select
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-lg"
              id="card1"
            >
              {myCards.map((id) => {
                const attrs = cardAttributes.get(id);
                return (
                  <option key={id.toString()} value={id.toString()}>
                    Card #{id.toString()} {attrs ? `(Revealed)` : `(Encrypted)`}
                  </option>
                );
              })}
            </select>
            {(() => {
              const card1Select = typeof document !== "undefined" ? document.getElementById("card1") as HTMLSelectElement : null;
              const selectedId = card1Select ? BigInt(card1Select.value) : myCards[0];
              const attrs = cardAttributes.get(selectedId);
              return (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Card Preview</p>
                  {attrs ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">⚔️ Attack:</span>
                        <span className="font-bold text-red-600">{attrs.attack?.clear?.toString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">🛡️ Defense:</span>
                        <span className="font-bold text-blue-600">{attrs.defense?.clear?.toString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">💎 Rarity:</span>
                        <span className="font-bold text-purple-600">{attrs.rarity?.clear?.toString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">✨ Special:</span>
                        <span className="font-bold text-yellow-600">{attrs.specialPower?.clear?.toString()}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-2">Attributes encrypted</p>
                  )}
                </div>
              );
            })()}
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Second Card
            </label>
            <select
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-lg"
              id="card2"
            >
              {myCards.map((id) => {
                const attrs = cardAttributes.get(id);
                return (
                  <option key={id.toString()} value={id.toString()}>
                    Card #{id.toString()} {attrs ? `(Revealed)` : `(Encrypted)`}
                  </option>
                );
              })}
            </select>
            {(() => {
              const card2Select = typeof document !== "undefined" ? document.getElementById("card2") as HTMLSelectElement : null;
              const selectedId = card2Select ? BigInt(card2Select.value) : myCards[myCards.length > 1 ? 1 : 0];
              const attrs = cardAttributes.get(selectedId);
              return (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Card Preview</p>
                  {attrs ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">⚔️ Attack:</span>
                        <span className="font-bold text-red-600">{attrs.attack?.clear?.toString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">🛡️ Defense:</span>
                        <span className="font-bold text-blue-600">{attrs.defense?.clear?.toString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">💎 Rarity:</span>
                        <span className="font-bold text-purple-600">{attrs.rarity?.clear?.toString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">✨ Special:</span>
                        <span className="font-bold text-yellow-600">{attrs.specialPower?.clear?.toString()}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-2">Attributes encrypted</p>
                  )}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Warning Box */}
        <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
          <div className="flex items-start">
            <svg className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="text-sm font-bold text-yellow-800 mb-1">Important Notice</h4>
              <p className="text-sm text-yellow-700">Both original cards will be burned during the fusion process. This action cannot be undone.</p>
            </div>
          </div>
        </div>

        <button
          className={buttonClass + " w-full text-lg"}
          disabled={!canFuse}
          onClick={() => {
            const card1Select = document.getElementById("card1") as HTMLSelectElement;
            const card2Select = document.getElementById("card2") as HTMLSelectElement;
            const card1 = BigInt(card1Select.value);
            const card2 = BigInt(card2Select.value);
            if (card1 !== card2) {
              fuseCards(card1, card2);
            } else {
              alert("Please select two different cards to fuse!");
            }
          }}
        >
          {isFusing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Fusing Cards...
            </>
          ) : canFuse ? (
            "🔮 Fuse Cards Together"
          ) : (
            "Cannot Fuse Cards"
          )}
        </button>
      </div>
    </div>
  );
};

