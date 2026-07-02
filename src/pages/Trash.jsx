import { useState } from "react";
import Layout from "../components/Layout";
import FileList from "../components/FileList";

function Trash() {
  const [search, setSearch] = useState("");

  return (
    <Layout onSearch={setSearch}>
      <FileList filter="trash" search={search} />
    </Layout>
  );
}

export default Trash;