import { useState } from "react";
import Layout from "../components/Layout";
import DashboardStats from "../components/DashboardStats";
import FileUpload from "../components/FileUpload";
import FileList from "../components/FileList";
import RecentFiles from "../components/RecentFiles";

function Dashboard() {
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const firstName = user?.email?.split("@")[0] || "there";

  const handleUploadComplete = () => {
    setRefreshKey(k => k + 1);
  };

  return (
    <Layout onSearch={setSearch}>
      {/* Welcome Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, color: "#f1f5f9" }}>
          Welcome back, <span style={{
            background: "linear-gradient(135deg, #818cf8, #a78bfa)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>{firstName}</span> 👋
        </h1>
        <p style={{ margin: "6px 0 0 0", color: "#64748b", fontSize: "0.875rem" }}>
          {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>

      <DashboardStats key={`stats-${refreshKey}`} />
      <FileUpload onUploadComplete={handleUploadComplete} />
      <FileList key={`files-${refreshKey}`} search={search} />
      <RecentFiles key={`recent-${refreshKey}`} />
    </Layout>
  );
}

export default Dashboard;