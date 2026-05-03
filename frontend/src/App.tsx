import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./Dashboard";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <nav className="bg-blue-600 p-4 text-white shadow-md flex justify-between">
          <h1 className="text-xl font-bold">Task Manager</h1>
          <div>
            {/* We will add auth links later */}
            <span className="font-semibold">User</span>
          </div>
        </nav>

        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
