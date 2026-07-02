import { useState } from "react";
import Layout from "../components/Layout";
import FileList from "../components/FileList";

function MyFiles() {
  const [search, setSearch] = useState("");

  return (
    <Layout onSearch={setSearch}>
      <FileList filter="all" search={search} />
    </Layout>
  );
}

export default MyFiles;