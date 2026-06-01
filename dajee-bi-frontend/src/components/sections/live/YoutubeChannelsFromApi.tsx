"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownUp,
  ArrowUpRight,
  ChevronDown,
  Eye,
  PlayCircle,
  Search,
  Sparkles,
  Trophy,
  Users,
  Video,
} from "lucide-react";
import { fetchMediaChannels } from "@/lib/api";

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

type SortKey = "subscribers" | "views" | "videos";
type SortMode = "desc" | "asc";

function formatNumber(value: number) {
  const num = Number(value || 0);
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}Md`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return new Intl.NumberFormat("fr-FR").format(num);
}

export default function YoutubeChannelsFromApi() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const [sortKey, setSortKey] = useState<SortKey>("subscribers");
  const [sortMode, setSortMode] = useState<SortMode>("desc");
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function loadChannels() {
      try {
        const data = await fetchMediaChannels();
        setChannels(data);
      } catch (error) {
        console.error("Erreur récupération médias:", error);
      } finally {
        setLoading(false);
      }
    }

    loadChannels();
  }, []);

  const stats = useMemo(() => {
    return {
      totalChannels: channels.length,
      totalSubscribers: channels.reduce((acc, item) => acc + Number(item.subscribers || 0), 0),
      totalViews: channels.reduce((acc, item) => acc + Number(item.views || 0), 0),
      totalVideos: channels.reduce((acc, item) => acc + Number(item.videos || 0), 0),
    };
  }, [channels]);

  const filteredChannels = useMemo(() => {
    return channels
      .filter((channel) =>
        channel.name.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => {
        const aValue = Number(a[sortKey] || 0);
        const bValue = Number(b[sortKey] || 0);
        return sortMode === "desc" ? bValue - aValue : aValue - bValue;
      });
  }, [channels, query, sortKey, sortMode]);

  const visibleChannels = filteredChannels.slice(0, visibleCount);
  const hasMore = visibleCount < filteredChannels.length;

  function toggleSort() {
    setSortMode((current) => (current === "desc" ? "asc" : "desc"));
    setVisibleCount(6);
  }

  return (
    <section className="relative overflow-hidden bg-[#f8fafc] py-24 text-neutral-950">
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-green-400/20 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-red-400/10 blur-3xl" />
      <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-yellow-300/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1500px] px-5 md:px-8">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-green-700">
              Données PostgreSQL
            </p>

            <h2 className="mt-4 max-w-4xl font-heading text-4xl font-black leading-tight md:text-6xl">
              Classement des médias par{" "}
              <span className="text-green-700">puissance digitale</span>.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-600">
              Les chaînes TV et Web TV sénégalaises classées depuis les données
              synchronisées dans ta base dajee-bi.
            </p>
          </div>

          <div className="rounded-[2rem] border border-black/5 bg-white p-5 shadow-xl shadow-black/5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-neutral-500">Chaînes</p>
                <p className="text-2xl font-black">{stats.totalChannels}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Abonnés</p>
                <p className="text-2xl font-black text-green-700">
                  {formatNumber(stats.totalSubscribers)}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Vues</p>
                <p className="text-2xl font-black text-red-600">
                  {formatNumber(stats.totalViews)}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Vidéos</p>
                <p className="text-2xl font-black text-yellow-600">
                  {formatNumber(stats.totalVideos)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10 flex flex-col gap-4 rounded-[2rem] border border-black/5 bg-white p-4 shadow-xl shadow-black/5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisibleCount(6);
              }}
              placeholder="Rechercher une chaîne..."
              className="w-full rounded-full border border-black/10 bg-neutral-50 py-4 pl-12 pr-5 text-sm font-semibold outline-none transition focus:border-green-600"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { key: "subscribers", label: "Abonnés" },
              { key: "views", label: "Vues" },
              { key: "videos", label: "Vidéos" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setSortKey(item.key as SortKey);
                  setVisibleCount(6);
                }}
                className={`rounded-full px-5 py-3 text-sm font-black transition ${
                  sortKey === item.key
                    ? "bg-green-700 text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={toggleSort}
              className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-green-700"
            >
              <ArrowDownUp size={16} />
              {sortMode === "desc" ? "Plus → moins" : "Moins → plus"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-[430px] animate-pulse rounded-[2rem] bg-white shadow-xl shadow-black/5"
              />
            ))}
          </div>
        ) : (
          <>
            <motion.div layout className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <AnimatePresence>
                {visibleChannels.map((channel, index) => (
                <motion.div
                    layout
                    key={channel.id}
                    initial={{ opacity: 0, y: 35, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.96 }}
                    transition={{ duration: 0.45, delay: index * 0.04 }}
                    whileHover={{ y: -10 }}
                    className="group relative overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-2xl shadow-black/10"
                >
                    <Link href={`/channels/${channel.id}`}>
                    <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-green-400/20 blur-3xl transition group-hover:scale-150" />

                    <div className="relative h-56 overflow-hidden cursor-pointer">
                        <img
                        src={channel.thumbnail_url || channel.logo_url}
                        alt={channel.name}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-black text-white shadow-lg">
                        <Trophy size={16} />
                        #{index + 1}
                        </div>

                        <div className="absolute right-4 top-4 rounded-full bg-red-600 px-4 py-2 text-sm font-black text-white shadow-lg">
                        YouTube
                        </div>

                        <div className="absolute bottom-5 left-5 right-5">
                        <h3 className="line-clamp-2 text-2xl font-black text-white transition group-hover:text-green-300">
                            {channel.name}
                        </h3>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/75">
                            {channel.description ||
                            "Chaîne média sénégalaise suivie par dajee-bi."}
                        </p>
                        </div>
                    </div>

                    <div className="relative z-10 p-5">
                        <div className="grid grid-cols-3 gap-3">
                        <div className="rounded-2xl bg-green-50 p-3 transition hover:scale-[1.03]">
                            <Users className="mb-2 text-green-700" size={18} />
                            <p className="text-[11px] text-neutral-500">Abonnés</p>
                            <p className="text-lg font-black">
                            {formatNumber(channel.subscribers)}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-yellow-50 p-3 transition hover:scale-[1.03]">
                            <Eye className="mb-2 text-yellow-600" size={18} />
                            <p className="text-[11px] text-neutral-500">Vues</p>
                            <p className="text-lg font-black">
                            {formatNumber(channel.views)}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-red-50 p-3 transition hover:scale-[1.03]">
                            <Video className="mb-2 text-red-600" size={18} />
                            <p className="text-[11px] text-neutral-500">Vidéos</p>
                            <p className="text-lg font-black">
                            {formatNumber(channel.videos)}
                            </p>
                        </div>
                        </div>

                        <div className="mt-5 flex items-center justify-between rounded-2xl bg-neutral-950 p-4 text-white transition duration-300 group-hover:bg-green-700">
                        <div className="flex items-center gap-3">
                            <PlayCircle className="text-red-400" />

                            <div>
                            <p className="text-xs text-white/50">
                                Analytics & détails
                            </p>

                            <p className="font-black text-green-400">
                                Ouvrir la chaîne
                            </p>
                            </div>
                        </div>

                        <ArrowUpRight className="text-green-400 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </div>
                    </div>
                    </Link>
                </motion.div>
                ))}
            </AnimatePresence>
            </motion.div>

            {hasMore && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => setVisibleCount((count) => count + 6)}
                  className="inline-flex items-center gap-2 rounded-full bg-green-700 px-8 py-4 text-sm font-black text-white shadow-xl shadow-green-700/20 transition hover:-translate-y-1 hover:bg-green-800"
                >
                  Voir plus de chaînes
                  <ChevronDown size={18} />
                </button>
              </div>
            )}
          </>
        )}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 rounded-[2rem] border border-green-200 bg-green-50 p-6"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="text-green-700" />
            <p className="font-bold text-neutral-800">
              Ces données sont servies après synchronisation YouTube.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}