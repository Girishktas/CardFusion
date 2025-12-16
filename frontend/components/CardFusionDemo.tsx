"use client";

import { useFhevm } from "../fhevm/useFhevm";
import { useInMemoryStorage } from "../hooks/useInMemoryStorage";
import { useMetaMaskEthersSigner } from "../hooks/metamask/useMetaMaskEthersSigner";
import { useCardFusion } from "@/hooks/useCardFusion";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { DashboardView } from "./views/DashboardView";
import { MintView } from "./views/MintView";
import { CollectionView } from "./views/CollectionView";
import { FuseView } from "./views/FuseView";
import { StatusView } from "./views/StatusView";

/**
 * Main CardFusion demo component
 * Handles wallet connection and card management
 */
export const CardFusionDemo = () => {
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();
  const {
    provider,
    chainId,
    accounts,
    isConnected,
    connect,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
    initialMockChains,
  } = useMetaMaskEthersSigner();

  //////////////////////////////////////////////////////////////////////////////
  // FHEVM instance
  //////////////////////////////////////////////////////////////////////////////

  const {
    instance: fhevmInstance,
    status: fhevmStatus,
    error: fhevmError,
  } = useFhevm({
    provider,
    chainId,
    initialMockChains,
    enabled: true,
  });

  //////////////////////////////////////////////////////////////////////////////
  // useCardFusion hook
  //////////////////////////////////////////////////////////////////////////////

  const cardFusion = useCardFusion({
    instance: fhevmInstance,
    fhevmDecryptionSignatureStorage,
    eip1193Provider: provider,
    chainId,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
  });

  //////////////////////////////////////////////////////////////////////////////
  // View state management
  //////////////////////////////////////////////////////////////////////////////

  const [currentView, setCurrentView] = useState<string>("dashboard");

  //////////////////////////////////////////////////////////////////////////////
  // UI Stuff
  //////////////////////////////////////////////////////////////////////////////

  const buttonClass =
    "inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md " +
    "transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg active:bg-indigo-800 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 " +
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 disabled:hover:shadow-md";

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="mb-8">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Welcome to CardFusion</h2>
            <p className="text-xl text-gray-600">Privacy-preserving Card Fusion System</p>
          </div>
          <button
            className={buttonClass + " text-lg px-8 py-4"}
            disabled={isConnected}
            onClick={connect}
          >
            Connect Wallet
          </button>
          <p className="mt-4 text-sm text-gray-500">Connect your MetaMask wallet to get started</p>
        </div>
      </div>
    );
  }

  // Only show deployment error when chainId is known and contract is not deployed
  if (chainId !== undefined && cardFusion.isDeployed === false) {
    return (
      <div className="flex gap-6">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} isConnected={isConnected} />
        <div className="flex-1">
          <div className="max-w-2xl mx-auto mt-12">
            <div className="bg-red-50 border-2 border-red-400 rounded-xl p-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-red-800 mb-2">Contract Not Deployed</h3>
                  <p className="text-red-700 mb-4">
                    The CardFusion contract is not deployed on the current network.
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-red-200">
                    <p className="text-sm text-gray-700 font-mono">
                      npx hardhat deploy --network localhost
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render view based on currentView
  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <DashboardView
            chainId={chainId}
            accounts={accounts}
            ethersSigner={ethersSigner}
            contractAddress={cardFusion.contractAddress}
            isDeployed={cardFusion.isDeployed}
            fhevmInstance={fhevmInstance}
            fhevmStatus={fhevmStatus}
            fhevmError={fhevmError ?? null}
            myCardsCount={cardFusion.myCards.length}
          />
        );
      case "mint":
        return (
          <MintView
            canMint={cardFusion.canMint ?? false}
            isMinting={cardFusion.isMinting}
            mintCard={cardFusion.mintCard}
          />
        );
      case "collection":
        return (
          <CollectionView
            myCards={cardFusion.myCards}
            cardAttributes={cardFusion.cardAttributes}
            canDecrypt={cardFusion.canDecrypt ?? false}
            isDecrypting={cardFusion.isDecrypting}
            decryptCardAttributes={cardFusion.decryptCardAttributes}
          />
        );
      case "fuse":
        return (
          <FuseView
            myCards={cardFusion.myCards}
            cardAttributes={cardFusion.cardAttributes}
            canFuse={cardFusion.canFuse ?? false}
            isFusing={cardFusion.isFusing}
            fuseCards={cardFusion.fuseCards}
          />
        );
      case "status":
        return (
          <StatusView
            isMinting={cardFusion.isMinting}
            isFusing={cardFusion.isFusing}
            isDecrypting={cardFusion.isDecrypting}
            isRefreshing={cardFusion.isRefreshing}
            canMint={cardFusion.canMint ?? false}
            canFuse={cardFusion.canFuse ?? false}
            canDecrypt={cardFusion.canDecrypt ?? false}
            fhevmInstance={fhevmInstance}
            fhevmStatus={fhevmStatus}
            fhevmError={fhevmError ?? null}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <Sidebar currentView={currentView} onViewChange={setCurrentView} isConnected={isConnected} />
      
      {/* Main Content Area */}
      <div className="flex-1 min-h-screen">
        {renderView()}

        {/* Status Messages */}
        {cardFusion.message && (
          <div className={`mt-6 bg-white rounded-xl shadow-lg p-6 border-l-4 ${
            cardFusion.message.includes("success") || cardFusion.message.includes("completed") 
              ? "border-green-500 bg-green-50" 
              : cardFusion.message.includes("fail") || cardFusion.message.includes("error")
              ? "border-red-500 bg-red-50"
              : "border-indigo-500 bg-indigo-50"
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {cardFusion.message.includes("success") || cardFusion.message.includes("completed") ? (
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : cardFusion.message.includes("fail") || cardFusion.message.includes("error") ? (
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-gray-900">Status Update</h3>
                <p className="text-sm text-gray-700 mt-1">{cardFusion.message}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

