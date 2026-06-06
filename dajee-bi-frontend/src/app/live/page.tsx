import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import LiveHero from "@/components/sections/live/LiveHero";
import TopChannelsRanking from "@/components/sections/live/TopChannelsRanking";
import LiveAnalyticsSection from "@/components/sections/live/LiveAnalyticsSection";
import LiveTimelineSection from "@/components/sections/live/LiveTimelineSection";
import LiveStreamsGrid from "@/components/sections/live/LiveStreamsGrid";
import ScrollToTop from "@/components/ui/ScrollToTop";
import WhatsAppMe from "@/components/ui/WhatsAppMe";

import {
  fetchLiveStreams,
  fetchLiveAnalyticsReport,
} from "@/lib/api";

export default async function LivePage() {
  const [lives, analytics] = await Promise.all([
    fetchLiveStreams(),
    fetchLiveAnalyticsReport(),
  ]);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white pt-20">
        <LiveHero lives={lives || []} />

        <LiveStreamsGrid />

        {/* <TopChannelsRanking />

        <LiveAnalyticsSection /> */}

        <LiveTimelineSection /> 
      </main>

      <ScrollToTop />
      <WhatsAppMe />
      <Footer />
    </>
  );
}