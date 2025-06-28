import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./components/layout/Layout";
import Products from "./pages/Products";
import Services from "./pages/Services";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Services />} />
          <Route path="products" element={<Products />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
