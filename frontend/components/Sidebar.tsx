"use client";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isConnected: boolean;
}

export const Sidebar = ({ currentView, onViewChange, isConnected }: SidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", enabled: true },
    { id: "mint", label: "Mint Card", icon: "🎴", enabled: isConnected },
    { id: "collection", label: "My Collection", icon: "🗂️", enabled: isConnected },
    { id: "fuse", label: "Fuse Cards", icon: "🔮", enabled: isConnected },
    { id: "status", label: "System Status", icon: "⚙️", enabled: isConnected },
  ];

  return (
    <aside className="w-64 bg-white shadow-xl rounded-xl p-4 flex flex-col h-[calc(100vh-4rem)] sticky top-4">
      {/* Logo/Title */}
      <div className="mb-8 pb-4 border-b-2 border-indigo-500">
        <h1 className="text-2xl font-bold text-gray-900">CardFusion</h1>
        <p className="text-xs text-gray-500 mt-1">Privacy Card System</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => item.enabled && onViewChange(item.id)}
            disabled={!item.enabled}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
              currentView === item.id
                ? "bg-indigo-600 text-white shadow-md"
                : item.enabled
                ? "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                : "text-gray-400 cursor-not-allowed opacity-50"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="pt-4 border-t border-gray-200 mt-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-gray-400"}`}></div>
          <span>{isConnected ? "Connected" : "Not Connected"}</span>
        </div>
      </div>
    </aside>
  );
};

