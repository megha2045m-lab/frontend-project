import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children, onSearch }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0f1e",
      backgroundImage: `
        radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.12), transparent),
        radial-gradient(ellipse 40% 40% at 90% 70%, rgba(139,92,246,0.08), transparent)
      `,
      display: "flex",
      flexDirection: "column",
    }}>
      <Navbar onSearch={onSearch} />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <main style={{
          flex: 1,
          padding: "2rem",
          overflowX: "hidden",
          maxWidth: "calc(100vw - 260px)",
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;