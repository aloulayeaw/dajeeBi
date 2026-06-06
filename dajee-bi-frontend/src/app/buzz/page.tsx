import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BuzzHero from "@/components/sections/buzz/BuzzHero";
import BuzzChannels from "@/components/sections/buzz/BuzzChannels";
import LiveBuzzSection from "@/components/sections/buzz/LiveBuzzSection";
import BreakingBuzz from "@/components/sections/buzz/BreakingBuzz";
import ScrollToTop from "@/components/ui/ScrollToTop";
import WhatsAppMe from "@/components/ui/WhatsAppMe";

export default function BuzzPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        <BuzzHero />
        <BreakingBuzz />
        <BuzzChannels />
        <LiveBuzzSection />
      </main>

      <ScrollToTop />
      <WhatsAppMe />
      <Footer />
    </>
  );
}