"use client";

interface StatusViewProps {
  isMinting: boolean;
  isFusing: boolean;
  isDecrypting: boolean;
  isRefreshing: boolean;
  canMint: boolean;
  canFuse: boolean;
  canDecrypt: boolean;
  fhevmInstance: any;
  fhevmStatus: string;
  fhevmError: Error | null;
}

export const StatusView = ({
  isMinting,
  isFusing,
  isDecrypting,
  isRefreshing,
  canMint,
  canFuse,
  canDecrypt,
  fhevmInstance,
  fhevmStatus,
  fhevmError,
}: StatusViewProps) => {
  const sectionClass = "bg-white rounded-xl shadow-lg p-6 border border-gray-200";
  const titleClass = "font-bold text-gray-900 text-xl mb-4 pb-2 border-b-2 border-indigo-500";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className={sectionClass}>
        <h2 className={titleClass}>⚙️ System Status</h2>
        
        {/* Encryption System */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Encryption System (FHEVM)</h3>
          <div className="space-y-3">
            <StatusItem label="FHEVM Instance" status={fhevmInstance ? "ready" : "loading"} />
            <StatusItem label="Initialization Status" status={fhevmStatus} />
            {fhevmError && (
              <div className="mt-3 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-red-800">Error Detected</p>
                    <p className="text-sm text-red-700 mt-1">{fhevmError instanceof Error ? fhevmError.message : "Unknown error occurred"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Operations Status */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Operations Status</h3>
          <div className="space-y-3">
            <OperationStatus 
              label="Minting Cards" 
              active={isMinting} 
              enabled={canMint}
              description="Create new cards with encrypted attributes"
            />
            <OperationStatus 
              label="Fusing Cards" 
              active={isFusing} 
              enabled={canFuse}
              description="Combine two cards into a new one"
            />
            <OperationStatus 
              label="Decrypting Attributes" 
              active={isDecrypting} 
              enabled={canDecrypt}
              description="Reveal encrypted card attributes"
            />
            <OperationStatus 
              label="Refreshing Data" 
              active={isRefreshing} 
              enabled={!isRefreshing}
              description="Update card collection from blockchain"
            />
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className={sectionClass}>
        <h2 className={titleClass}>System Information</h2>
        <div className="space-y-4">
          <InfoRow 
            icon="🔒"
            title="Fully Homomorphic Encryption"
            description="All card attributes are encrypted on the blockchain using FHEVM technology"
          />
          <InfoRow 
            icon="🔐"
            title="Privacy Preservation"
            description="Card values remain private until you choose to decrypt them"
          />
          <InfoRow 
            icon="⚡"
            title="On-Chain Operations"
            description="All minting and fusion operations are executed directly on the blockchain"
          />
          <InfoRow 
            icon="🔄"
            title="Decentralized"
            description="No central authority can access your encrypted card data"
          />
        </div>
      </div>

      {/* Legend */}
      <div className={sectionClass}>
        <h2 className={titleClass}>Status Legend</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Ready</span>
            <span className="text-sm text-gray-600">Operation is available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Loading</span>
            <span className="text-sm text-gray-600">System is initializing</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Active</span>
            <span className="text-sm text-gray-600">Operation in progress</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-600">Unavailable</span>
            <span className="text-sm text-gray-600">Operation cannot be performed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function StatusItem({ label, status }: { label: string; status: string }) {
  const isReady = status === "ready" || status === "initialized";
  const isLoading = status === "loading" || status === "initializing";
  
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
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

function OperationStatus({ 
  label, 
  active, 
  enabled, 
  description 
}: { 
  label: string; 
  active: boolean; 
  enabled: boolean;
  description: string;
}) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-800">{label}</span>
        <div className="flex items-center gap-2">
          {active && (
            <span className="flex items-center text-xs font-semibold text-blue-600 px-3 py-1 bg-blue-100 rounded-full">
              <svg className="animate-spin h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Active
            </span>
          )}
          {!active && (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              enabled ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
            }`}>
              {enabled ? "Ready" : "Unavailable"}
            </span>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  );
}

function InfoRow({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <span className="text-2xl flex-shrink-0">{icon}</span>
      <div>
        <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
        <p className="text-xs text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );
}

