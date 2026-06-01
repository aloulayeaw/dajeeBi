import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InfluencersGrid from "@/components/sections/influenceurs/InfluencersGrid";

export default function InfluenceursPage() {
  return (
    <>
      <Header />

      <main>
        <InfluencersGrid />
      </main>

      <Footer />
    </>
  );
}