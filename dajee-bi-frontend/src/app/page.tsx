import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import HeroSection from "@/components/sections/home/HeroSection";
import HomeDashboardSection from "@/components/sections/home/HomeDashboardSection";
import FacebookInfluenceSection from "@/components/sections/home/FacebookInfluenceSection";
import FacebookPoliticalPosts from "@/components/sections/home/FacebookPoliticalPosts";

import {
  fetchHomeDashboard,
  fetchFacebookPoliticalPosts,
  fetchFacebookPoliticalRanking,
} from "@/lib/api";

const facebookPosts =
  await fetchFacebookPoliticalPosts();

export default async function Home() {
  const data = await fetchHomeDashboard();

  const facebookRanking =
    await fetchFacebookPoliticalRanking();

  return (
    <>
      <Header />

      <main className="bg-[#f8fafc]">
        <HeroSection stats={data.stats} />

        <HomeDashboardSection
          weeklyEvent={data.weekly_event}
          trends={data.trends}
          topVideos={data.top_videos}
          topInfluencers={data.top_influencers}
          lives={data.live_streams}
          aiAnalysis={data.ai_analysis}
          mediaEvents={data.media_events}
        />

        <FacebookInfluenceSection
            leaders={facebookRanking || []}
        />

        <FacebookPoliticalPosts
            posts={facebookPosts || []}
        />
      </main>

      <Footer />
    </>
  );
}