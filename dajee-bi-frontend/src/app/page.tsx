export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import HeroSection from "@/components/sections/home/HeroSection";
import HomeDashboardSection from "@/components/sections/home/HomeDashboardSection";
import FacebookInfluenceSection from "@/components/sections/home/FacebookInfluenceSection";
import FacebookPoliticalPosts from "@/components/sections/home/FacebookPoliticalPosts";
import XPoliticalImpactSection from "@/components/sections/home/XPoliticalImpactSection";
import ScrollToTop from "@/components/ui/ScrollToTop";
import WhatsAppMe from "@/components/ui/WhatsAppMe";


import {
  fetchHomeDashboard,
  fetchFacebookPoliticalPosts,
  fetchFacebookPoliticalRanking,
  fetchXPoliticalRanking,
  fetchXPoliticalPosts,
} from "@/lib/api";

export default async function Home() {
  let data: any = null;
  let facebookRanking: any[] = [];
  let facebookPosts: any[] = [];
  const xRanking = await fetchXPoliticalRanking();
  const xPosts = await fetchXPoliticalPosts();

  try {
    data = await fetchHomeDashboard();
  } catch (error) {
    console.error(
      "Erreur récupération dashboard accueil:",
      error
    );
  }

  try {
    facebookRanking =
      await fetchFacebookPoliticalRanking();
  } catch (error) {
    console.error(
      "Erreur récupération classement Facebook:",
      error
    );
  }

  try {
    facebookPosts =
      await fetchFacebookPoliticalPosts();
  } catch (error) {
    console.error(
      "Erreur récupération posts Facebook:",
      error
    );
  }

  return (
    <>
      <Header />

      <main className="bg-[#f8fafc] min-h-screen">
        <HeroSection
          stats={data?.stats ?? {}}
        />

        <HomeDashboardSection
          weeklyEvent={data?.weekly_event ?? null}
          trends={data?.trends ?? []}
          topVideos={data?.top_videos ?? []}
          mediaEvents={data?.media_events ?? []}
          channels={data?.channels ?? []}
        />
        {/* <FacebookInfluenceSection
          leaders={facebookRanking ?? []}
        /> */}

        <FacebookPoliticalPosts
          posts={facebookPosts ?? []}
        />
        <XPoliticalImpactSection
          ranking={xRanking || []}
          posts={xPosts || []}
        />
      </main>
      
      <ScrollToTop />
      <WhatsAppMe />
      <Footer />
    </>
  );
}