import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import HomeLayout from "./components/layout/HomeLayout";
import CategoryLayout from "./components/layout/CategoryLayout";
import SearchLayout from "./components/layout/SearchLayout";
import HomePage from "./pages/HomePage";
import PalasPage from "./pages/PalasPage";
import MochilasPage from "./pages/MochilasPage";
import TenisPage from "./pages/TenisPage";
import AccesoriosPage from "./pages/AccesoriosPage";
import RopaPage from "./pages/RopaPage";
import OfertasPage from "./pages/OfertasPage";
import SearchPage from "./pages/SearchPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<HomeLayout />}>
            <Route path="/" element={<HomePage />} />
          </Route>
          <Route element={<CategoryLayout />}>
            <Route path="/palas" element={<PalasPage />} />
            <Route path="/mochilas" element={<MochilasPage />} />
            <Route path="/tenis" element={<TenisPage />} />
            <Route path="/accesorios" element={<AccesoriosPage />} />
            <Route path="/ropa" element={<RopaPage />} />
            <Route path="/ofertas" element={<OfertasPage />} />
            <Route path="/producto/:id" element={<ProductDetailPage />} />
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Route>
          <Route element={<SearchLayout />}>
            <Route path="/buscar" element={<SearchPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
