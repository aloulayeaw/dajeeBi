import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnalysisPageContent from "@/components/sections/analysis/AnalysisPageContent";
import ScrollToTop from "@/components/ui/ScrollToTop";
import WhatsAppMe from "@/components/ui/WhatsAppMe";
import { fetchAnalysisDashboard } from "@/lib/api";

export default async function AnalysesPage() {
  const data = await fetchAnalysisDashboard();

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f8fafc] pt-20">
        <AnalysisPageContent data={data} />
      </main>

      <ScrollToTop />
      <WhatsAppMe />
      <Footer />
    </>
  );
}