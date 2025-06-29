import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/layout/Layout";
import LoginPage from "./pages/LoginPage";
import Packages from "./pages/Packages";
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import Services from "./pages/Services";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route - Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {" "}
          <Route index element={<Navigate to="services" />} />
          <Route path="services" element={<Services />} />
          <Route path="packages" element={<Packages />} />
          <Route path="products" element={<Products />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
