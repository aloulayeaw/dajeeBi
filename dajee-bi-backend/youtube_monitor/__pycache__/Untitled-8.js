import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import LiveHero from "@/components/sections/live/LiveHero";
import TopChannelsRanking from "@/components/sections/live/TopChannelsRanking";
import LiveAnalyticsSection from "@/components/sections/live/LiveAnalyticsSection";
import LiveTimelineSection from "@/components/sections/live/LiveTimelineSection";
import LiveStreamsGrid from "@/components/sections/live/LiveStreamsGrid";

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

      <main className="min-h-screen overflow-hidden bg-[#020617] pt-20">
        {/* HERO */}
        <LiveHero lives={lives || []} />

        {/* LIVES EN DIRECT */}
        <section className="relative z-10">
          <LiveStreamsGrid lives={lives || []} />
        </section>

        {/* CLASSEMENT DES MÉDIAS */}
        <section className="relative z-10">
          <TopChannelsRanking />
        </section>

        {/* ANALYTICS RÉELS */}
        <section className="relative z-10">
          <LiveAnalyticsSection analytics={analytics} />
        </section>

        {/* TIMELINE */}
        <section className="relative z-10">
          <LiveTimelineSection />
        </section>
      </main>

      <Footer />
    </>
  );
}