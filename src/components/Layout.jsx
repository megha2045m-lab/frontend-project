import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children, onSearch }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onSearch={onSearch} />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;