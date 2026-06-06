import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TrendingVideos from "@/components/sections/videos/TrendingVideos";
import ScrollToTop from "@/components/ui/ScrollToTop";
import WhatsAppMe from "@/components/ui/WhatsAppMe";

export default function VideosPage() {
  return (
    <>
      <Header />

      <main>
        <TrendingVideos />
      </main>

      <ScrollToTop />
      <WhatsAppMe />
      <Footer />
    </>
  );
}