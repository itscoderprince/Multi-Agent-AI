const Artifact = () => {
  return (
    <aside className="hidden lg:flex w-72 xl:w-80 h-screen border-l border-white/6 flex-col overflow-hidden shrink-0 bg-[#0d0f14] p-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/6">
        <h3 className="text-sm font-medium text-slate-300">Artifact</h3>
      </div>
      <div className="flex-1 flex items-center justify-center text-xs text-zinc-500">
        No active artifact
      </div>
    </aside>
  );
};

export default Artifact;
