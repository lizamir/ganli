import Header from "@/components/site/layout/Header";
import Hero from "@/components/site/sections/Hero";
import Ribbon from "@/components/site/sections/Ribbon";
import Story from "@/components/site/sections/Story";
import Day from "@/components/site/sections/Day";
import Groups from "@/components/site/sections/Groups";
import Pickup from "@/components/site/sections/Pickup";
import AppShowcase from "@/components/site/sections/app-showcase/AppShowcase";
import Spaces from "@/components/site/sections/Spaces";
import Faq from "@/components/site/sections/Faq";
import Booking from "@/components/site/sections/booking/Booking";
import Contact from "@/components/site/sections/Contact";
import Footer from "@/components/site/layout/Footer";
import MobileBar from "@/components/site/layout/MobileBar";
import Reveal from "@/components/common/Reveal";

/** The marketing site. */
export default function Home() {
  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Header />
      <main id="main">
        <Hero />
        <Ribbon />
        <Story />
        <Day />
        <Groups />
        <Pickup />
        <AppShowcase />
        <Spaces />
        <Faq />
        <Booking />
        <Contact />
      </main>
      <Footer />
      <MobileBar />
      <Reveal />
    </>
  );
}
