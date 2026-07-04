import Layout from "../components/Layout";

function Settings() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userDisplay = user?.email || "Megha";

  return (
    <Layout>
      <div className="max-w-4xl">

        <h1 className="text-4xl font-bold mb-8">
          ⚙️ Settings
        </h1>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">

          <h2 className="text-2xl font-bold mb-4">
            Account
          </h2>

          <div className="space-y-3">

            <p>
              <strong>User:</strong> {userDisplay}
            </p>

            <p>
              <strong>Storage Limit:</strong> 100 MB
            </p>

            <p>
              <strong>Application:</strong> Cloud Based Storage Service
            </p>

          </div>

        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">

          <h2 className="text-2xl font-bold mb-4">
            About
          </h2>

          <p>
            Version: 1.0
          </p>

          <p className="mt-2">
            Built using React, Node.js, Express and MongoDB.
          </p>

        </div>

        <div className="bg-white rounded-xl shadow-md p-6">

          <button
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg"
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>

        </div>

      </div>
    </Layout>
  );
}

export default Settings;