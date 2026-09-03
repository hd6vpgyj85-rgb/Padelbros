import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import TopProducts from "../components/home/TopProducts";
import LevelsSection from "../components/home/LevelsSection";
import WhyUs from "../components/home/WhyUs";
import Testimonials from "../components/home/Testimonials";
import VisitUs from "../components/home/VisitUs";
import CtaFooter from "../components/home/CtaFooter";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

function HomePage() {
  useDocumentTitle("Padelbros | La tienda de padel en Cd. Juárez");

  return (
    <>
      <Hero />
      <Features />
      <TopProducts />
      <LevelsSection />
      <WhyUs />
      <Testimonials />
      <VisitUs />
      <CtaFooter />
    </>
  );
}

export default HomePage;
