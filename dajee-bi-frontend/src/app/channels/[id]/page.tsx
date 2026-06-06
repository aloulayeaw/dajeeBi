"use client";

import { use, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Flame,
  TrendingUp,
  Trophy,
  Users,
  Video,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChannelGrowthChart from "@/components/charts/ChannelGrowthChart";
import { fetchChannelAnalytics, fetchMediaChannels } from "@/lib/api";
import ScrollToTop from "@/components/ui/ScrollToTop";
import WhatsAppMe from "@/components/ui/WhatsAppMe";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

type Channel = {
  id: string;
  name: string;
  description: string;
  thumbnail_url: string;
  logo_url: string;
  subscribers: number;
  views: number;
  videos: number;
  youtube_url: string;
};

type AnalyticsPoint = {
  date: string;
  subscribers: number;
  views: number;
  videos: number;
};

function formatNumber(value: number) {
  const num = Number(value || 0);

  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}Md`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;

  return new Intl.NumberFormat("fr-FR").format(num);
}

export default function ChannelDetailPage({ params }: Props) {
  const { id } = use(params);

  const [analytics, setAnalytics] = useState<AnalyticsPoint[]>([]);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const channels: Channel[] = await fetchMediaChannels();

        const currentChannel = channels.find((item) => item.id === id);
        setChannel(currentChannel || null);

        const analyticsData: AnalyticsPoint[] =
          await fetchChannelAnalytics(id);

        setAnalytics(
          analyticsData.map((item) => ({
            ...item,
            date: new Date(item.date).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
            }),
          }))
        );
      } catch (error) {
        console.error("Erreur page détail chaîne:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const growth = useMemo(() => {
    if (analytics.length < 2) return "0.0";

    const first = analytics[0]?.subscribers || 0;
    const last = analytics[analytics.length - 1]?.subscribers || 0;

    if (first === 0) return "0.0";

    return (((last - first) / first) * 100).toFixed(1);
  }, [analytics]);

  const influenceScore = useMemo(() => {
    if (!channel) return 0;

    let score = 0;
    score += Math.min(channel.subscribers / 100000, 40);
    score += Math.min(channel.views / 10000000, 40);
    score += Math.min(channel.videos / 1000, 20);

    return Math.round(score);
  }, [channel]);

  return (
    <>
      <Header />

      <main className="relative min-h-screen overflow-hidden bg-[#f8fafc] py-20">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-green-400/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-yellow-300/20 blur-3xl" />

        <section className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
          {loading || !channel ? (
            <div className="rounded-[2rem] bg-white p-10 font-bold shadow-xl">
              Chargement...
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-[2.5rem] border border-black/5 bg-white shadow-2xl shadow-black/10"
              >
                <div className="relative h-[320px] overflow-hidden">
                  <img
                    src={channel.thumbnail_url || channel.logo_url}
                    alt={channel.name}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  <div className="absolute bottom-10 left-10 right-10">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="rounded-full bg-green-600 px-5 py-2 text-sm font-black text-white">
                        Média Sénégal
                      </div>

                      <div className="rounded-full bg-red-600 px-5 py-2 text-sm font-black text-white">
                        Influence Score {influenceScore}/100
                      </div>
                    </div>

                    <h1 className="mt-5 max-w-4xl text-4xl font-black text-white md:text-6xl">
                      {channel.name}
                    </h1>

                    <p className="mt-5 max-w-3xl line-clamp-3 text-lg leading-8 text-white/80">
                      {channel.description}
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 p-8 md:grid-cols-4">
                  <div className="rounded-[2rem] bg-green-50 p-6">
                    <Users className="mb-4 text-green-700" size={28} />
                    <p className="text-sm text-neutral-500">Abonnés</p>
                    <h3 className="mt-2 text-3xl font-black">
                      {formatNumber(channel.subscribers)}
                    </h3>
                  </div>

                  <div className="rounded-[2rem] bg-yellow-50 p-6">
                    <Eye className="mb-4 text-yellow-600" size={28} />
                    <p className="text-sm text-neutral-500">Vues</p>
                    <h3 className="mt-2 text-3xl font-black">
                      {formatNumber(channel.views)}
                    </h3>
                  </div>

                  <div className="rounded-[2rem] bg-red-50 p-6">
                    <Video className="mb-4 text-red-600" size={28} />
                    <p className="text-sm text-neutral-500">Vidéos</p>
                    <h3 className="mt-2 text-3xl font-black">
                      {formatNumber(channel.videos)}
                    </h3>
                  </div>

                  <div className="rounded-[2rem] bg-neutral-950 p-6 text-white">
                    <TrendingUp className="mb-4 text-green-400" size={28} />
                    <p className="text-sm text-white/50">Croissance</p>
                    <h3 className="mt-2 text-3xl font-black text-green-400">
                      +{growth}%
                    </h3>
                  </div>
                </div>
              </motion.div>

              <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_0.7fr]">
                <ChannelGrowthChart data={analytics} />

                <div className="space-y-6">
                  <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-xl shadow-black/5">
                    <div className="flex items-center gap-3">
                      <Trophy className="text-yellow-500" />
                      <h3 className="text-2xl font-black">Score Influence</h3>
                    </div>

                    <div className="mt-6">
                      <div className="h-4 overflow-hidden rounded-full bg-neutral-200">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${influenceScore}%` }}
                          transition={{ duration: 1 }}
                          className="h-full rounded-full bg-gradient-to-r from-green-500 via-yellow-400 to-red-500"
                        />
                      </div>

                      <p className="mt-4 text-lg font-black">
                        {influenceScore}/100
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-xl shadow-black/5">
                    <div className="flex items-center gap-3">
                      <Flame className="text-red-500" />
                      <h3 className="text-2xl font-black">Analyse dajee-bi</h3>
                    </div>

                    <div className="mt-5 space-y-4">
                      <div className="rounded-2xl bg-green-50 p-4">
                        <p className="text-sm font-bold text-green-700">
                          Forte présence digitale
                        </p>
                      </div>

                      <div className="rounded-2xl bg-yellow-50 p-4">
                        <p className="text-sm font-bold text-yellow-700">
                          Croissance détectée
                        </p>
                      </div>

                      <div className="rounded-2xl bg-red-50 p-4">
                        <p className="text-sm font-bold text-red-700">
                          Média à fort engagement
                        </p>
                      </div>
                    </div>
                  </div>

                  <a
                    href={channel.youtube_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center rounded-[2rem] bg-red-600 px-8 py-5 text-lg font-black text-white transition hover:-translate-y-1 hover:bg-red-700"
                  >
                    Voir la chaîne YouTube
                  </a>
                </div>
              </div>
            </>
          )}
        </section>
      </main>

      <ScrollToTop />
      <WhatsAppMe />
      <Footer />
    </>
  );
}