import { useState } from "react";
import Layout from "../components/Layout";
import FileList from "../components/FileList";

function Starred() {
  const [search, setSearch] = useState("");

  return (
    <Layout onSearch={setSearch}>
      <FileList filter="starred" search={search} />
    </Layout>
  );
}

export default Starred;