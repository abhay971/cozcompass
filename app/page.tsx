import CompassStage from "@/components/CompassStage";
import CompassJourney from "@/components/CompassJourney";
import CustomCursor from "@/components/CustomCursor";
import Hero from "@/components/hero/Hero";
import CozPromise from "@/components/sections/CozPromise";
import WhyUs from "@/components/sections/WhyUs";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import Vetting from "@/components/sections/Vetting";
import Markets from "@/components/sections/Markets";
import Pricing from "@/components/sections/Pricing";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      {/* single persistent 3D compass behind the page; CompassJourney drives where it sits */}
      <CompassStage />
      <CompassJourney />
      <CustomCursor />
      <Hero />
      <CozPromise />
      <WhyUs />
      <Services />
      <Process />
      <Vetting />
      <Markets />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
