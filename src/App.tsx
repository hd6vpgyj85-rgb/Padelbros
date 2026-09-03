import PromoBar from "./components/layout/PromoBar";
import Header from "./components/layout/Header";
import BottomTabBar from "./components/layout/BottomTabBar";
import Hero from "./components/home/Hero";
import Features from "./components/home/Features";
import TopProducts from "./components/home/TopProducts";
import LevelsSection from "./components/home/LevelsSection";
import WhyUs from "./components/home/WhyUs";
import Testimonials from "./components/home/Testimonials";
import VisitUs from "./components/home/VisitUs";
import CtaFooter from "./components/home/CtaFooter";

function App() {
  return (
    <>
      <PromoBar />
      <Header />
      <main>
        <Hero />
        <Features />
        <TopProducts />
        <LevelsSection />
        <WhyUs />
        <Testimonials />
        <VisitUs />
        <CtaFooter />
      </main>
      <BottomTabBar />
    </>
  );
}

export default App;
