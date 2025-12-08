"use client";

interface DashboardViewProps {
  chainId?: number;
  accounts?: readonly string[];
  ethersSigner: any;
  contractAddress?: string;
  isDeployed?: boolean;
  fhevmInstance: any;
  fhevmStatus: string;
  fhevmError: Error | null;
  myCardsCount: number;
}

export const DashboardView = ({
  chainId,
  accounts,
  ethersSigner,
  contractAddress,
  isDeployed,
  fhevmInstance,
  fhevmStatus,
  fhevmError,
  myCardsCount,
}: DashboardViewProps) => {
  const sectionClass = "bg-white rounded-xl shadow-lg p-6 border border-gray-200";
  const titleClass = "font-bold text-gray-900 text-xl mb-4 pb-2 border-b-2 border-indigo-500";

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-indigo-600 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-3">Welcome to CardFusion</h1>
        <p className="text-indigo-100 text-lg">Privacy-preserving Card Fusion System with FHEVM</p>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-indigo-700 rounded-lg p-4">
            <div className="text-3xl font-bold">{myCardsCount}</div>
            <div className="text-indigo-200 text-sm mt-1">Total Cards</div>
          </div>
          <div className="bg-indigo-700 rounded-lg p-4">
            <div className="text-3xl font-bold">{isDeployed ? "✓" : "✗"}</div>
            <div className="text-indigo-200 text-sm mt-1">Contract Status</div>
          </div>
          <div className="bg-indigo-700 rounded-lg p-4">
            <div className="text-3xl font-bold">{fhevmInstance ? "✓" : "..."}</div>
            <div className="text-indigo-200 text-sm mt-1">Encryption Ready</div>
          </div>
        </div>
      </div>

      {/* Connection Info */}
      <div className={sectionClass}>
        <h2 className={titleClass}>Connection Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="Network Chain ID" value={chainId?.toString() || "Not connected"} />
          <InfoItem 
            label="Wallet Address" 
            value={ethersSigner?.address ? `${ethersSigner.address.slice(0, 6)}...${ethersSigner.address.slice(-4)}` : "No wallet"} 
          />
          <InfoItem 
            label="Contract Address" 
            value={contractAddress ? `${contractAddress.slice(0, 6)}...${contractAddress.slice(-4)}` : "Not available"} 
          />
          <InfoItem 
            label="Contract Status" 
            value={isDeployed ? "Deployed" : "Not deployed"} 
            success={isDeployed} 
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={sectionClass}>
          <h2 className={titleClass}>Encryption Status</h2>
          <div className="space-y-3">
            <StatusItem label="FHEVM Instance" status={fhevmInstance ? "ready" : "loading"} />
            <StatusItem label="Initialization" status={fhevmStatus} />
            {fhevmError && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">Error: {fhevmError instanceof Error ? fhevmError.message : "Unknown error"}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className={sectionClass}>
          <h2 className={titleClass}>Quick Actions</h2>
          <div className="space-y-3">
            <p className="text-gray-600 text-sm">Get started with CardFusion:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-indigo-600 font-bold">1.</span>
                <span>Mint your first card with encrypted attributes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-indigo-600 font-bold">2.</span>
                <span>View and decrypt your card collection</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-indigo-600 font-bold">3.</span>
                <span>Fuse two cards to create a powerful new one</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function InfoItem({ label, value, success }: { label: string; value: string; success?: boolean }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <p className={`text-sm font-semibold ${success === true ? "text-green-600" : success === false ? "text-red-600" : "text-gray-900"}`}>
        {value}
      </p>
    </div>
  );
}

function StatusItem({ label, status }: { label: string; status: string }) {
  const isReady = status === "ready" || status === "initialized";
  const isLoading = status === "loading" || status === "initializing";
  
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
        isReady ? "bg-green-100 text-green-700" : 
        isLoading ? "bg-yellow-100 text-yellow-700" : 
        "bg-gray-100 text-gray-700"
      }`}>
        {status}
      </span>
    </div>
  );
}

