import { BrowserRouter, Route, Routes } from "react-router-dom";
import PromoBar from "./components/layout/PromoBar";
import HomeLayout from "./components/layout/HomeLayout";
import CategoryLayout from "./components/layout/CategoryLayout";
import HomePage from "./pages/HomePage";
import PalasPage from "./pages/PalasPage";
import MochilasPage from "./pages/MochilasPage";
import TenisPage from "./pages/TenisPage";
import AccesoriosPage from "./pages/AccesoriosPage";
import RopaPage from "./pages/RopaPage";
import OfertasPage from "./pages/OfertasPage";

function App() {
  return (
    <BrowserRouter>
      <PromoBar />
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
