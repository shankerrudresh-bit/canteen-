import { Navigate, Route, Routes } from "react-router-dom";
import { RoleGate, RoleProvider, useRole } from "./components/RoleGate";
import MenuPage from "./pages/student/MenuPage";
import TrackPage from "./pages/student/TrackPage";
import KitchenDashboard from "./pages/kitchen/KitchenDashboard";

/** Landing route: redirects known roles, otherwise shows the role gate. */
function HomeGate() {
  const { role, setRole } = useRole();
  if (role === "student") return <Navigate to="/menu" replace />;
  if (role === "staff") return <Navigate to="/kitchen" replace />;
  return <RoleGate onEnter={setRole} />;
}

function KitchenRoute() {
  const { role } = useRole();
  if (role !== "staff") return <Navigate to="/" replace />;
  return <KitchenDashboard />;
}

export default function App() {
  return (
    <RoleProvider>
      <Routes>
        <Route path="/" element={<HomeGate />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/track/:token" element={<TrackPage />} />
        <Route path="/kitchen" element={<KitchenRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </RoleProvider>
  );
}