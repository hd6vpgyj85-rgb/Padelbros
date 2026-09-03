import { BrowserRouter, Route, Routes } from "react-router-dom";
import PromoBar from "./components/layout/PromoBar";
import Header from "./components/layout/Header";
import BottomTabBar from "./components/layout/BottomTabBar";
import HomePage from "./pages/HomePage";
import PalasPage from "./pages/PalasPage";

function App() {
  return (
    <BrowserRouter>
      <PromoBar />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/palas" element={<PalasPage />} />
        </Routes>
      </main>
      <BottomTabBar />
    </BrowserRouter>
  );
}

export default App;
