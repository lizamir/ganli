import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Ribbon from "@/components/Ribbon";
import Story from "@/components/Story";
import Day from "@/components/Day";
import Groups from "@/components/Groups";
import Pickup from "@/components/Pickup";
import AppShowcase from "@/components/AppShowcase";
import Spaces from "@/components/Spaces";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import Reveal from "@/components/Reveal";

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
        <Contact />
      </main>
      <Footer />
      <MobileBar />
      <Reveal />
    </>
  );
}
