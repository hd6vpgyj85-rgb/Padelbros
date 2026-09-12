import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ProductsProvider } from "./context/ProductsContext";
import { OrdersProvider } from "./context/OrdersContext";
import { AnalyticsProvider } from "./context/AnalyticsContext";
import { ReviewsProvider } from "./context/ReviewsContext";
import { CouponsProvider } from "./context/CouponsContext";
import { CustomersProvider } from "./context/CustomersContext";
import { LoyaltyProvider } from "./context/LoyaltyContext";
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
import NotFoundPage from "./pages/NotFoundPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import FidelidadPage from "./pages/FidelidadPage";
import AdminApp from "./admin/AdminApp";
import WhatsAppButton from "./components/common/WhatsAppButton";
import ScrollToTop from "./components/common/ScrollToTop";

function App() {
  return (
    <ProductsProvider>
      <OrdersProvider>
        <AnalyticsProvider>
          <ReviewsProvider>
            <CouponsProvider>
              <CustomersProvider>
                <LoyaltyProvider>
                  <CartProvider>
                    <BrowserRouter>
                      <ScrollToTop />
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
                          <Route path="/terminos" element={<TermsPage />} />
                          <Route path="/privacidad" element={<PrivacyPage />} />
                        </Route>
                        <Route element={<SearchLayout />}>
                          <Route path="/buscar" element={<SearchPage />} />
                        </Route>
                        <Route path="/fidelidad/:token" element={<FidelidadPage />} />
                        <Route path="/admin/*" element={<AdminApp />} />
                        <Route element={<CategoryLayout />}>
                          <Route path="*" element={<NotFoundPage />} />
                        </Route>
                      </Routes>
                      <WhatsAppButton />
                    </BrowserRouter>
                  </CartProvider>
                </LoyaltyProvider>
              </CustomersProvider>
            </CouponsProvider>
          </ReviewsProvider>
        </AnalyticsProvider>
      </OrdersProvider>
    </ProductsProvider>
  );
}

export default App;
