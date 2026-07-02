import { useState } from "react";
import Layout from "../components/Layout";
import DashboardStats from "../components/DashboardStats";
import FileUpload from "../components/FileUpload";
import FileList from "../components/FileList";
import RecentFiles from "../components/RecentFiles";

function Dashboard() {
  const [search, setSearch] = useState("");

  return (
    <Layout onSearch={setSearch}>
      <DashboardStats />

      <FileUpload />

      <FileList search={search} />
      <RecentFiles />
    </Layout>
  );
}

export default Dashboard;