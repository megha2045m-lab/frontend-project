import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children, onSearch }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar onSearch={onSearch} />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;