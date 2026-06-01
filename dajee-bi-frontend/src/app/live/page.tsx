import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import LiveHero from "@/components/sections/live/LiveHero";
// import LiveChannelsGrid from "@/components/sections/live/LiveChannelsGrid";
import TopChannelsRanking from "@/components/sections/live/TopChannelsRanking";
import LiveAnalyticsSection from "@/components/sections/live/LiveAnalyticsSection";
import LiveTimelineSection from "@/components/sections/live/LiveTimelineSection";
// import YoutubeChannelsFromApi from "@/components/sections/live/YoutubeChannelsFromApi";
import LiveStreamsGrid from "@/components/sections/live/LiveStreamsGrid";

export default function LivePage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        <LiveHero />
        <LiveStreamsGrid />

        {/* <LiveChannelsGrid /> */}
        
        {/* <YoutubeChannelsFromApi /> */}
        
        <TopChannelsRanking />

        <LiveAnalyticsSection />

        <LiveTimelineSection />
      </main>

      <Footer />
    </>
  );
}