"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownUp,
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  Eye,
  Grid3X3,
  LayoutList,
  PlayCircle,
  Search,
  Sparkles,
  Star,
  Trophy,
  Users,
  Video,
  Bird,
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
type ViewMode = "grid" | "list";

function formatNumber(value: number) {
  const num = Number(value || 0);

  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}Md`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;

  return new Intl.NumberFormat("fr-FR").format(num);
}

function getChannelImage(channel: Channel) {
  return (
    channel.thumbnail_url ||
    channel.logo_url ||
    "/images/live-placeholder.jpg"
  );
}

function getScore(channel: Channel) {
  const subscribers = Number(channel.subscribers || 0);
  const views = Number(channel.views || 0);
  const videos = Number(channel.videos || 0);

  return subscribers * 2 + views + videos * 200;
}

export default function YoutubeChannelsFromApi() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);
  const [sortKey, setSortKey] = useState<SortKey>("subscribers");
  const [sortMode, setSortMode] = useState<SortMode>("desc");
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  useEffect(() => {
    async function loadChannels() {
      try {
        const data = await fetchMediaChannels();
        setChannels(data || []);
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
      totalSubscribers: channels.reduce(
        (acc, item) => acc + Number(item.subscribers || 0),
        0
      ),
      totalViews: channels.reduce(
        (acc, item) => acc + Number(item.views || 0),
        0
      ),
      totalVideos: channels.reduce(
        (acc, item) => acc + Number(item.videos || 0),
        0
      ),
    };
  }, [channels]);

  const filteredChannels = useMemo(() => {
    const value = query.toLowerCase().trim();

    return channels
      .filter((channel) => {
        if (!value) return true;

        return (
          channel.name?.toLowerCase().includes(value) ||
          channel.description?.toLowerCase().includes(value)
        );
      })
      .sort((a, b) => {
        const aValue = Number(a[sortKey] || 0);
        const bValue = Number(b[sortKey] || 0);

        return sortMode === "desc" ? bValue - aValue : aValue - bValue;
      });
  }, [channels, query, sortKey, sortMode]);

  const topTwoChannels = filteredChannels.slice(0, 2);

  const specialChannels = filteredChannels.filter((channel) => {
    const name = channel.name.toLowerCase();

    return name.includes("xalaat") || name.includes("seneweb");
  });

  const restChannels = filteredChannels.slice(2);
  const visibleChannels = restChannels.slice(0, visibleCount);
  const hasMore = visibleCount < restChannels.length;

  function handleSort(key: SortKey) {
    setSortKey(key);
    setVisibleCount(8);
  }

  function toggleSort() {
    setSortMode((current) => (current === "desc" ? "asc" : "desc"));
    setVisibleCount(8);
  }

  const statCards = [
    {
      label: "Chaînes",
      value: formatNumber(stats.totalChannels),
      icon: Bird,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Abonnés",
      value: formatNumber(stats.totalSubscribers),
      icon: Users,
      color: "text-emerald-700",
      bg: "bg-emerald-50",
    },
    {
      label: "Vues",
      value: formatNumber(stats.totalViews),
      icon: Eye,
      color: "text-blue-700",
      bg: "bg-blue-50",
    },
    {
      label: "Vidéos",
      value: formatNumber(stats.totalVideos),
      icon: Video,
      color: "text-yellow-700",
      bg: "bg-yellow-50",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#f8fafc] py-24 text-slate-950">
      <div className="pointer-events-none absolute -left-32 top-0 h-[520px] w-[520px] rounded-full bg-emerald-300/30 blur-[130px]" />
      <div className="pointer-events-none absolute -right-32 top-40 h-[520px] w-[520px] rounded-full bg-red-300/25 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-yellow-200/40 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-[1500px] px-5 md:px-8">
        <div className="mb-12 grid gap-8 xl:grid-cols-[1fr_0.9fr] xl:items-end">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-700 shadow-xl shadow-emerald-100">
              <Sparkles size={15} />
              Données YouTube
            </div>

            <h2 className="mt-5 max-w-5xl text-4xl font-black leading-tight md:text-6xl">
              Classement des médias par{" "}
              <span className="bg-gradient-to-r from-emerald-700 via-yellow-500 to-red-600 bg-clip-text text-transparent">
                puissance digitale
              </span>
              .
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
              Les chaînes TV et Web TV sénégalaises classées depuis les données
              synchronisées dans ta base dajee-bi.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {statCards.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500">
                      {item.label}
                    </p>
                    <p className="mt-2 text-3xl font-black">{item.value}</p>
                  </div>

                  <div className={`rounded-2xl ${item.bg} p-4`}>
                    <item.icon className={item.color} size={24} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

            {specialChannels.length > 0 && (
              <div className="mb-12 rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200">
                <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-red-600">
                      <Star size={14} />
                      Focus médias
                    </div>

                    <h3 className="mt-4 text-3xl font-black">
                      Médias dominant en live
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Une section dédiée aux médias à surveiller de près.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white">
                    Watchlist
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  {specialChannels.map((channel, index) => (
                    <motion.div
                      key={channel.id}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02 }}
                      className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50"
                    >
                      <Link
                        href={`/channels/${channel.id}`}
                        className="grid gap-0 md:grid-cols-[180px_1fr]"
                      >
                        <div className="relative h-52 overflow-hidden md:h-full">
                          <img
                            src={getChannelImage(channel)}
                            alt={channel.name}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        </div>

                        <div className="p-5">
                          <h4 className="text-2xl font-black">
                            {channel.name}
                          </h4>

                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                            {channel.description ||
                              "Média suivi dans la watchlist dajee-bi."}
                          </p>

                          <div className="mt-5 grid grid-cols-3 gap-3">
                            <div>
                              <p className="text-xs text-slate-400">Abonnés</p>
                              <p className="font-black">
                                {formatNumber(channel.subscribers)}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-slate-400">Vues</p>
                              <p className="font-black">
                                {formatNumber(channel.views)}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-slate-400">Vidéos</p>
                              <p className="font-black">
                                {formatNumber(channel.videos)}
                              </p>
                            </div>
                          </div>

                          <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-black text-white">
                            Voir la chaîne
                            <ArrowUpRight size={16} />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
        <div className="mb-10 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/70">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-xl">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setVisibleCount(8);
                }}
                placeholder="Rechercher une chaîne ou une description..."
                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-5 text-sm font-bold text-slate-950 outline-none placeholder:text-slate-400 transition focus:border-emerald-500 focus:bg-white"
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
                  onClick={() => handleSort(item.key as SortKey)}
                  className={`rounded-2xl px-5 py-4 text-sm font-black transition ${
                    sortKey === item.key
                      ? "bg-emerald-700 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <button
                onClick={toggleSort}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white shadow-xl shadow-slate-300 transition hover:-translate-y-1 hover:bg-red-600"
              >
                <ArrowDownUp size={16} />
                {sortMode === "desc" ? "Plus → moins" : "Moins → plus"}
              </button>

              <div className="flex rounded-2xl bg-slate-100 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-black transition ${
                    viewMode === "grid"
                      ? "bg-white text-emerald-700 shadow"
                      : "text-slate-500"
                  }`}
                >
                  <Grid3X3 size={16} />
                  Grid
                </button>

                <button
                  onClick={() => setViewMode("list")}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-black transition ${
                    viewMode === "list"
                      ? "bg-white text-red-600 shadow"
                      : "text-slate-500"
                  }`}
                >
                  <LayoutList size={16} />
                  Liste
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="h-[430px] animate-pulse rounded-[2rem] bg-white shadow-xl shadow-slate-200"
              />
            ))}
          </div>
        ) : filteredChannels.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center shadow-xl shadow-slate-200">
            <Search className="mx-auto mb-4 text-red-500" size={44} />
            <h3 className="text-2xl font-black">Aucune chaîne trouvée</h3>
            <p className="mt-3 text-slate-500">
              Essaie avec un autre nom de média.
            </p>
          </div>
        ) : (
          <>
            {topTwoChannels.length > 0 && (
              <div className="mb-12">
                <div className="mb-5 flex items-center gap-3">
                  <Trophy className="text-yellow-500" />
                  <div>
                    <h3 className="text-3xl font-black">
                      Les deux médias en tête
                    </h3>
                    <p className="text-sm text-slate-500">
                      Les chaînes les plus puissantes selon le classement actuel.
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  {topTwoChannels.map((channel, index) => (
                    <motion.div
                      key={channel.id}
                      initial={{ opacity: 0, y: 30, scale: 0.96 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -8 }}
                      className="group overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl shadow-slate-300/70"
                    >
                      <Link href={`/channels/${channel.id}`}>
                        <div className="relative h-80 overflow-hidden">
                          <img
                            src={getChannelImage(channel)}
                            alt={channel.name}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                          <div className="absolute left-5 top-5 rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-black text-black shadow-xl">
                            #{index + 1} TOP MÉDIA
                          </div>

                          <div className="absolute right-5 top-5 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white">
                            YouTube
                          </div>

                          <div className="absolute bottom-6 left-6 right-6">
                            <h3 className="text-4xl font-black text-white">
                              {channel.name}
                            </h3>

                            <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-6 text-white/75">
                              {channel.description ||
                                "Chaîne média sénégalaise suivie par dajee-bi."}
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-3 p-5 sm:grid-cols-3">
                          <div className="rounded-2xl bg-emerald-50 p-4">
                            <Users className="mb-2 text-emerald-700" />
                            <p className="text-xs text-slate-500">Abonnés</p>
                            <p className="text-2xl font-black">
                              {formatNumber(channel.subscribers)}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-blue-50 p-4">
                            <Eye className="mb-2 text-blue-700" />
                            <p className="text-xs text-slate-500">Vues</p>
                            <p className="text-2xl font-black">
                              {formatNumber(channel.views)}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-red-50 p-4">
                            <Video className="mb-2 text-red-600" />
                            <p className="text-xs text-slate-500">Vidéos</p>
                            <p className="text-2xl font-black">
                              {formatNumber(channel.videos)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}


            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-black">Toutes les chaînes</h3>
                <p className="text-sm text-slate-500">
                  Affichage en {viewMode === "grid" ? "grille" : "liste"}.
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {viewMode === "grid" ? (
                <motion.div
                  key="grid"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
                >
                  {visibleChannels.map((channel, index) => (
                    <motion.div
                      layout
                      key={channel.id}
                      initial={{ opacity: 0, y: 35, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.45, delay: index * 0.035 }}
                      whileHover={{ y: -10 }}
                      className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/70"
                    >
                      <ChannelCard channel={channel} index={index + 3} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-5"
                >
                  {visibleChannels.map((channel, index) => (
                    <motion.div
                      key={channel.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.035 }}
                      whileHover={{ x: 6 }}
                      className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/70"
                    >
                      <ChannelListItem channel={channel} index={index + 3} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {hasMore && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => setVisibleCount((count) => count + 8)}
                  className="inline-flex items-center gap-3 rounded-2xl bg-emerald-700 px-8 py-5 text-sm font-black text-white shadow-xl shadow-emerald-200 transition hover:-translate-y-1 hover:bg-slate-950"
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
          className="mt-12 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-50 p-3">
                <BarChart3 className="text-emerald-700" />
              </div>

              <div>
                <p className="font-black">Synchronisation YouTube active</p>
                <p className="text-sm text-slate-500">
                  Ces données sont servies après synchronisation avec ta base
                  dajee-bi.
                </p>
              </div>
            </div>

            <div className="rounded-full bg-red-600 px-5 py-3 text-sm font-black text-white">
              DATA API
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ChannelCard({
  channel,
  index,
}: {
  channel: Channel;
  index: number;
}) {
  return (
    <Link href={`/channels/${channel.id}`}>
      <div className="relative h-56 overflow-hidden">
        <img
          src={getChannelImage(channel)}
          alt={channel.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

        <div className="absolute left-4 top-4 rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white">
          #{index}
        </div>

        <div className="absolute right-4 top-4 rounded-full bg-red-600 px-4 py-2 text-sm font-black text-white">
          YouTube
        </div>

        <div className="absolute bottom-5 left-5 right-5">
          <h3 className="line-clamp-2 text-2xl font-black text-white">
            {channel.name}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/75">
            {channel.description ||
              "Chaîne média sénégalaise suivie par dajee-bi."}
          </p>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-3 gap-3">
          <Metric label="Abonnés" value={channel.subscribers} icon={Users} />
          <Metric label="Vues" value={channel.views} icon={Eye} />
          <Metric label="Vidéos" value={channel.videos} icon={Video} />
        </div>

        <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-950 p-4 text-white transition group-hover:bg-emerald-700">
          <div className="flex items-center gap-3">
            <PlayCircle className="text-red-400" />

            <div>
              <p className="text-xs text-white/50">Analytics & détails</p>
              <p className="font-black">Ouvrir la chaîne</p>
            </div>
          </div>

          <ArrowUpRight className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
      </div>
    </Link>
  );
}

function ChannelListItem({
  channel,
  index,
}: {
  channel: Channel;
  index: number;
}) {
  return (
    <Link
      href={`/channels/${channel.id}`}
      className="grid gap-0 lg:grid-cols-[280px_1fr_220px]"
    >
      <div className="relative h-60 overflow-hidden lg:h-full">
        <img
          src={getChannelImage(channel)}
          alt={channel.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />

        <div className="absolute left-4 top-4 rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white">
          #{index}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-3xl font-black">{channel.name}</h3>

        <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-500">
          {channel.description ||
            "Chaîne média sénégalaise suivie par dajee-bi."}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Metric label="Abonnés" value={channel.subscribers} icon={Users} />
          <Metric label="Vues" value={channel.views} icon={Eye} />
          <Metric label="Vidéos" value={channel.videos} icon={Video} />
        </div>
      </div>

      <div className="flex items-center border-t border-slate-200 p-6 lg:border-l lg:border-t-0">
        <div className="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-600 px-5 py-4 font-black text-white transition group-hover:bg-slate-950">
          Ouvrir
          <ArrowUpRight size={18} />
        </div>
      </div>
    </Link>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Users;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <Icon className="mb-2 text-emerald-700" size={18} />
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="text-lg font-black">{formatNumber(value)}</p>
    </div>
  );
}