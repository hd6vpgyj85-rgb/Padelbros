import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import TopProducts from "../components/home/TopProducts";
import LevelsSection from "../components/home/LevelsSection";
import WhyUs from "../components/home/WhyUs";
import Testimonials from "../components/home/Testimonials";
import VisitUs from "../components/home/VisitUs";
import CtaFooter from "../components/home/CtaFooter";

function HomePage() {
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
