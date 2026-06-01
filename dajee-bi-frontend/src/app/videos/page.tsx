import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TrendingVideos from "@/components/sections/videos/TrendingVideos";

export default function VideosPage() {
  return (
    <>
      <Header />

      <main>
        <TrendingVideos />
      </main>

      <Footer />
    </>
  );
}