import { useState } from "react";

function Navbar({ onSearch }) {
  const [search, setSearch] = useState("");

  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));
  const initial = user?.email?.charAt(0).toUpperCase() || "?";

  const handleChange = (e) => {
    setSearch(e.target.value);

    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-30">

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl shadow-md shadow-blue-500/20 font-bold">
          ☁️
        </div>
        <h1 className="text-xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-800 bg-clip-text text-transparent hidden sm:block">
          My Drive
        </h1>
      </div>

      <div className="w-1/2 md:w-2/3 max-w-2xl relative mx-4">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
          🔍
        </span>
        <input
          type="text"
          placeholder="Search files by name, type..."
          value={search}
          onChange={handleChange}
          className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400 shadow-inner text-sm"
        />
      </div>

      <div className="flex items-center gap-4">

        <div
          title={user?.email}
          className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/10 cursor-pointer hover:scale-105 transition-transform"
        >
          {initial}
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
          className="bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border border-transparent hover:border-red-100 active:scale-[0.98]"
        >
          Logout
        </button>

      </div>

    </header>
  );
}

export default Navbar;