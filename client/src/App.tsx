function App() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Temporary placeholder — will be replaced in Step 3 */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-accent-green animate-pulse" />
            <span className="font-mono text-sm text-gray-500 uppercase tracking-widest">
              System Online
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            AI Incident Dashboard
          </h1>
          <p className="text-gray-500 font-mono text-sm">
            Security Operations Center — v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;