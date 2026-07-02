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
    <header className="bg-white shadow-sm border-b px-8 py-4 flex items-center justify-between">

      <h1 className="text-2xl font-bold text-blue-600">
        ☁️ My Drive
      </h1>

      <input
        type="text"
        placeholder="Search files..."
        value={search}
        onChange={handleChange}
        className="w-2/3 px-5 py-3 rounded-full border border-gray-300"
      />

      <div className="flex items-center gap-4">

        <div
          title={user?.email}
          className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl"
        >
          {initial}
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>

    </header>
  );
}

export default Navbar;