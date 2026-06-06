import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InfluencersGrid from "@/components/sections/influenceurs/InfluencersGrid";
import ScrollToTop from "@/components/ui/ScrollToTop";
import WhatsAppMe from "@/components/ui/WhatsAppMe";


export default function InfluenceursPage() {
  return (
    <>
      <Header />

      <main>
        <InfluencersGrid />
      </main>
      
      <ScrollToTop />
      <WhatsAppMe />
      <Footer />
    </>
  );
}