"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Radio,
  Eye,
  Trophy,
  Activity,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Zap,
  BarChart3,
  History,
  Flame,
  Play,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";

import { fetchLiveStreams, fetchLiveReportDashboard } from "@/lib/liveApi";

type LiveStream = {
  id: string;
  youtube_video_id?: string;
  channel_name: string;
  channel_logo: string;
  title: string;
  thumbnail: string;
  live_url: string;
  viewers: number;
  likes: number;
  comments: number;
  status: string;
  started_at: string;
};

type LiveSnapshot = {
  live_id: string;
  channel_name: string;
  time: string;
  viewers: number;
  likes: number;
  comments: number;
  chat_activity_score: number;
  messages_per_minute: number;
  collected_at: string;
};

type LiveReport = {
  live_id: string;
  youtube_video_id: string;
  channel_name: string;
  title: string;
  live_url: string;
  thumbnail_url: string;
  status: string;
  peak_viewers: number;
  avg_viewers: number;
  min_viewers: number;
  last_viewers: number;
  total_likes: number;
  total_comments: number;
  chat_activity_score: number;
  avg_messages_per_minute: number;
  snapshots_count: number;
  duration_minutes: number;
  started_at?: string | null;
  ended_at?: string | null;
  first_seen_at?: string | null;
  last_seen_at?: string | null;
};

type ActiveLive = {
  live_id: string;
  youtube_video_id: string;
  channel_name: string;
  title: string;
  live_url: string;
  thumbnail_url: string;
  status: string;
  current_viewers: number;
  peak_viewers: number;
  avg_viewers: number;
  likes: number;
  comments: number;
  snapshots_count: number;
  duration_minutes: number;
  started_at?: string | null;
  ended_at?: string | null;
  last_seen_at?: string | null;
};

type ChannelRanking = {
  channel_name: string;
  total_lives: number;
  peak_viewers: number;
  avg_viewers: number;
  total_likes: number;
  total_comments: number;
  engagement_score: number;
  live_score: number;
};

type LiveEvent = {
  live_id: string;
  channel_name: string;
  event_type: string;
  event_title: string;
  event_description: string;
  value: number;
  previous_value: number;
  growth_percent: number;
  detected_at: string;
};

type LiveDashboard = {
  active_lives: ActiveLive[];
  active_snapshots: LiveSnapshot[];
  ended_reports: LiveReport[];
  channel_ranking: ChannelRanking[];
  events: LiveEvent[];
};

const chartColors = [
  "#22c55e",
  "#ef4444",
  "#eab308",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#ec4899",
  "#94a3b8",
];

const ACTIVE_PER_SLIDE = 4;
const ENDED_PER_SLIDE = 4;
const LIVES_GRID_PER_SLIDE = 3;

function formatNumber(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    notation: Number(value || 0) >= 10000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(Number(value || 0));
}

function getLiveImage(live: LiveStream) {
  return live.thumbnail || live.channel_logo || "/images/live-placeholder.jpg";
}

function safeDate(value?: string | null) {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}

function chunkArray<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }

  return chunks;
}

function getYoutubeVideoId(url?: string, fallbackId?: string) {
  if (fallbackId && fallbackId.length >= 8) return fallbackId;

  if (!url) return null;

  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
    /youtube\.com\/live\/([^?&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

function getYoutubeEmbedUrl(live: LiveStream) {
  const videoId = getYoutubeVideoId(live.live_url, live.youtube_video_id || live.id);
  if (!videoId) return null;

  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1`;
}

function engagementScore(live: LiveStream) {
  const viewers = Number(live.viewers || 0);
  const likes = Number(live.likes || 0);
  const comments = Number(live.comments || 0);
  if (!viewers) return 0;
  return Math.min(100, Math.round(((likes + comments * 2) / viewers) * 100));
}

export default function LiveStreamsGrid() {
  const [lives, setLives] = useState<LiveStream[]>([]);
  const [dashboard, setDashboard] = useState<LiveDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"active" | "ended">("ended");

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [endedSlideIndex, setEndedSlideIndex] = useState(0);
  const [livesGridSlideIndex, setLivesGridSlideIndex] = useState(0);

  useEffect(() => {
    async function loadLives() {
      try {
        const [liveData, reportData] = await Promise.all([
          fetchLiveStreams(),
          fetchLiveReportDashboard(),
        ]);

        const sortedLives = [...(liveData || [])].sort(
          (a, b) => Number(b.viewers || 0) - Number(a.viewers || 0)
        );

        setLives(sortedLives);
        setDashboard(reportData);
      } catch (error) {
        console.error("Erreur lives:", error);
      } finally {
        setLoading(false);
      }
    }

    loadLives();
  }, []);

  const activeLives = dashboard?.active_lives || [];
  const activeSnapshots = dashboard?.active_snapshots || [];
  const endedReports = dashboard?.ended_reports || [];
  const channelRanking = dashboard?.channel_ranking || [];
  const events = dashboard?.events || [];

  const filteredLives = useMemo(() => {
    const value = query.toLowerCase().trim();
    if (!value) return lives;

    return lives.filter(
      (live) =>
        live.title?.toLowerCase().includes(value) ||
        live.channel_name?.toLowerCase().includes(value)
    );
  }, [lives, query]);

  const activeSlides = useMemo(
    () => chunkArray(activeLives, ACTIVE_PER_SLIDE),
    [activeLives]
  );

  const endedSlides = useMemo(
    () => chunkArray(endedReports, ENDED_PER_SLIDE),
    [endedReports]
  );

  const livesGridSlides = useMemo(
    () => chunkArray(filteredLives, LIVES_GRID_PER_SLIDE),
    [filteredLives]
  );

  const currentActiveSlide = activeSlides[activeSlideIndex] || [];
  const currentEndedSlide = endedSlides[endedSlideIndex] || [];
  const currentLivesGridSlide = livesGridSlides[livesGridSlideIndex] || [];
  const featuredLive = currentLivesGridSlide[0];

  useEffect(() => {
    setLivesGridSlideIndex(0);
  }, [query]);

  useEffect(() => {
    setActiveSlideIndex(0);
  }, [activeLives.length]);

  useEffect(() => {
    setEndedSlideIndex(0);
  }, [endedReports.length]);

  useEffect(() => {
    if (selectedTab !== "active") return;
    if (activeSlides.length <= 1) return;

    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % activeSlides.length);
    }, 9000);

    return () => clearInterval(timer);
  }, [selectedTab, activeSlides.length]);

  useEffect(() => {
    if (selectedTab !== "ended") return;
    if (endedSlides.length <= 1) return;

    const timer = setInterval(() => {
      setEndedSlideIndex((prev) => (prev + 1) % endedSlides.length);
    }, 9000);

    return () => clearInterval(timer);
  }, [selectedTab, endedSlides.length]);

  useEffect(() => {
    if (livesGridSlides.length <= 1) return;

    const timer = setInterval(() => {
      setLivesGridSlideIndex((prev) => (prev + 1) % livesGridSlides.length);
    }, 9000);

    return () => clearInterval(timer);
  }, [livesGridSlides.length]);

  const nextActiveSlide = () => {
    if (!activeSlides.length) return;
    setActiveSlideIndex((prev) => (prev + 1) % activeSlides.length);
  };

  const previousActiveSlide = () => {
    if (!activeSlides.length) return;
    setActiveSlideIndex((prev) =>
      prev === 0 ? activeSlides.length - 1 : prev - 1
    );
  };

  const nextEndedSlide = () => {
    if (!endedSlides.length) return;
    setEndedSlideIndex((prev) => (prev + 1) % endedSlides.length);
  };

  const previousEndedSlide = () => {
    if (!endedSlides.length) return;
    setEndedSlideIndex((prev) =>
      prev === 0 ? endedSlides.length - 1 : prev - 1
    );
  };

  const nextLivesGridSlide = () => {
    if (!livesGridSlides.length) return;
    setLivesGridSlideIndex((prev) => (prev + 1) % livesGridSlides.length);
  };

  const previousLivesGridSlide = () => {
    if (!livesGridSlides.length) return;
    setLivesGridSlideIndex((prev) =>
      prev === 0 ? livesGridSlides.length - 1 : prev - 1
    );
  };

  const totalViewers = activeLives.reduce(
    (sum, live) => sum + Number(live.current_viewers || 0),
    0
  );

  const peakLive = useMemo(() => {
    const fromActive = activeLives
      .map((live) => ({
        channel_name: live.channel_name,
        title: live.title,
        value: Number(live.peak_viewers || live.current_viewers || 0),
        thumbnail: live.thumbnail_url,
        live_url: live.live_url,
      }))
      .sort((a, b) => b.value - a.value)[0];

    if (fromActive?.value) return fromActive;

    const fromEnded = endedReports
      .map((live) => ({
        channel_name: live.channel_name,
        title: live.title,
        value: Number(live.peak_viewers || 0),
        thumbnail: live.thumbnail_url,
        live_url: live.live_url,
      }))
      .sort((a, b) => b.value - a.value)[0];

    if (fromEnded?.value) return fromEnded;

    return null;
  }, [activeLives, endedReports]);

  const topSnapshotChannels = useMemo(() => {
    const totals = new Map<string, number>();

    activeSnapshots.forEach((item) => {
      totals.set(
        item.channel_name,
        (totals.get(item.channel_name) || 0) + Number(item.viewers || 0)
      );
    });

    return [...totals.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([channelName]) => channelName);
  }, [activeSnapshots]);

  const channelSnapshotChartData = useMemo(() => {
    const grouped: Record<string, any> = {};

    activeSnapshots.forEach((item) => {
      const channelName = item.channel_name;
      if (!topSnapshotChannels.includes(channelName)) return;

      if (!grouped[item.time]) grouped[item.time] = { time: item.time };
      grouped[item.time][channelName] = Number(item.viewers || 0);
    });

    return Object.values(grouped).slice(-40);
  }, [activeSnapshots, topSnapshotChannels]);

  const channelBarData = useMemo(() => {
    return channelRanking.slice(0, 10);
  }, [channelRanking]);

  const featuredEmbedUrl = featuredLive ? getYoutubeEmbedUrl(featuredLive) : null;

  return (
    <section className="relative overflow-hidden bg-[#020617] py-24 text-white">
      <div className="pointer-events-none absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-red-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-[1500px] px-5 md:px-8">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-red-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            Lives réels
          </div>

          <h2 className="mt-5 text-4xl font-black md:text-6xl">
            Analytics YouTube Live
          </h2>

          <p className="mt-4 max-w-3xl text-white/55">
            Courbes des lives actifs, bilans des lives terminés sur 48h,
            classement des chaînes et visualisation directe des lives.
          </p>
        </div>

        <div className="mb-8 grid gap-5 md:grid-cols-4">
          <KpiBox icon={Radio} label="Lives actifs" value={activeLives.length} />
          <KpiBox icon={Eye} label="Viewers actuels" value={totalViewers} />
          <KpiBox
            icon={Trophy}
            label="Pic viewers"
            value={peakLive?.value || 0}
            subLabel={peakLive?.channel_name || "Aucune chaîne"}
          />
          <KpiBox
            icon={History}
            label="Terminés 48h"
            value={endedReports.length}
          />
        </div>

        {peakLive && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 overflow-hidden rounded-[2rem] border border-yellow-400/20 bg-gradient-to-r from-yellow-500/10 via-white/[0.045] to-red-500/10 p-5 backdrop-blur-xl"
          >
            <div className="grid gap-5 lg:grid-cols-[280px_1fr_auto] lg:items-center">
              <div className="relative h-44 overflow-hidden rounded-[1.5rem]">
                <img
                  src={peakLive.thumbnail || "/images/live-placeholder.jpg"}
                  alt={peakLive.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute left-4 top-4 rounded-full bg-yellow-400 px-3 py-1 text-xs font-black text-black">
                  PIC VIEWERS
                </div>
              </div>

              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-yellow-400">
                  Chaîne avec le plus gros pic
                </p>
                <h3 className="mt-2 text-3xl font-black">
                  {peakLive.channel_name}
                </h3>
                <p className="mt-3 line-clamp-2 max-w-3xl text-white/60">
                  {peakLive.title}
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-6 text-center">
                <p className="text-sm text-white/45">Pic atteint</p>
                <p className="mt-2 text-5xl font-black text-yellow-400">
                  {formatNumber(peakLive.value)}
                </p>
                <p className="mt-1 text-xs text-white/40">viewers</p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mb-8 grid gap-5 xl:grid-cols-[1.45fr_0.85fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3">
              <Activity className="text-emerald-400" />
              <div>
                <h3 className="text-xl font-black">
                  Évolution des viewers en direct
                </h3>
                <p className="text-sm text-white/45">
                  Uniquement les lives actifs.
                </p>
              </div>
            </div>

            <div className="h-[380px] rounded-3xl border border-white/10 bg-[#07111f] p-4">
              {channelSnapshotChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={channelSnapshotChartData}>
                    <defs>
                      {topSnapshotChannels.map((channel, index) => (
                        <linearGradient
                          key={channel}
                          id={`gradient-${index}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={chartColors[index % chartColors.length]}
                            stopOpacity={0.45}
                          />
                          <stop
                            offset="95%"
                            stopColor={chartColors[index % chartColors.length]}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      ))}
                    </defs>

                    <CartesianGrid
                      stroke="rgba(255,255,255,0.08)"
                      vertical={false}
                    />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.45)" />
                    <YAxis
                      stroke="rgba(255,255,255,0.35)"
                      tickFormatter={(value) => formatNumber(Number(value))}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#020617",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "16px",
                        color: "#fff",
                      }}
                    />

                    {topSnapshotChannels.map((channel, index) => (
                      <Area
                        key={channel}
                        type="monotone"
                        dataKey={channel}
                        stroke={chartColors[index % chartColors.length]}
                        strokeWidth={3}
                        fill={`url(#gradient-${index})`}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart />
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
            <h3 className="text-xl font-black">Classement des chaînes sur 48h</h3>

            <div className="mt-6 h-[420px]">
              {channelBarData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={channelBarData}
                    layout="vertical"
                    margin={{ left: 20, right: 20 }}
                  >
                    <CartesianGrid
                      stroke="rgba(255,255,255,0.08)"
                      horizontal={false}
                    />
                    <XAxis type="number" stroke="rgba(255,255,255,0.35)" />
                    <YAxis
                      dataKey="channel_name"
                      type="category"
                      width={135}
                      stroke="rgba(255,255,255,0.65)"
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#020617",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "16px",
                        color: "#fff",
                      }}
                    />
                    <Bar
                      dataKey="live_score"
                      radius={[0, 14, 14, 0]}
                      fill="#22c55e"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center rounded-3xl bg-black/25 text-center text-white/45">
                  Aucun classement chaîne disponible.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
          <div className="mb-5 flex items-start gap-3">
            <History className="mt-1 text-yellow-400" />
            <div>
              <h3 className="text-2xl font-black">
                Bilans des lives terminés sur 48h
              </h3>
              <p className="text-sm text-white/45">
                Les lives actifs et terminés sont affichés par groupes de 4.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <TabButton
                  active={selectedTab === "active"}
                  onClick={() => setSelectedTab("active")}
                >
                  Actifs
                </TabButton>

                <TabButton
                  active={selectedTab === "ended"}
                  onClick={() => setSelectedTab("ended")}
                >
                  Terminés 48h
                </TabButton>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {selectedTab === "active" ? (
              <motion.div
                key="active"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                {activeLives.length > 0 ? (
                  <>
                    <SlideHeader
                      title="Lives actifs maintenant"
                      subtitle={`Slide ${activeSlideIndex + 1} / ${
                        activeSlides.length
                      } — ${activeLives.length} lives actifs`}
                      onPrev={previousActiveSlide}
                      onNext={nextActiveSlide}
                    />

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeSlideIndex}
                        initial={{ opacity: 0, x: 80 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -80 }}
                        transition={{ duration: 0.45 }}
                        className="grid gap-5 lg:grid-cols-2"
                      >
                        {currentActiveSlide.map((live, index) => (
                          <LiveCard
                            key={live.live_id}
                            live={live}
                            index={index}
                          />
                        ))}
                      </motion.div>
                    </AnimatePresence>

                    <SlideDots
                      total={activeSlides.length}
                      current={activeSlideIndex}
                      onSelect={setActiveSlideIndex}
                      color="red"
                    />
                  </>
                ) : (
                  <EmptyMessage text="Aucun live actif détecté actuellement." />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="ended"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                {endedReports.length > 0 ? (
                  <>
                    <SlideHeader
                      title="Lives passés en slide par 4"
                      subtitle={`Slide ${endedSlideIndex + 1} / ${
                        endedSlides.length
                      } — ${endedReports.length} lives terminés`}
                      onPrev={previousEndedSlide}
                      onNext={nextEndedSlide}
                    />

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={endedSlideIndex}
                        initial={{ opacity: 0, x: 80 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -80 }}
                        transition={{ duration: 0.45 }}
                        className="grid gap-5 lg:grid-cols-2"
                      >
                        {currentEndedSlide.map((report, index) => (
                          <EndedReportCard
                            key={report.live_id}
                            report={report}
                            index={index}
                          />
                        ))}
                      </motion.div>
                    </AnimatePresence>

                    <SlideDots
                      total={endedSlides.length}
                      current={endedSlideIndex}
                      onSelect={setEndedSlideIndex}
                      color="yellow"
                    />
                  </>
                ) : (
                  <EmptyMessage text="Aucun live terminé dans les dernières 48h." />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* {events.length > 0 && (
          <div className="mb-8 rounded-[2rem] border border-red-500/20 bg-red-500/10 p-6 backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-3">
              <Zap className="text-red-400" />
              <div>
                <h3 className="text-2xl font-black">Événements détectés</h3>
                <p className="text-sm text-white/50">
                  Pics de viewers sur les dernières 48h.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {events.slice(0, 6).map((event, index) => (
                <div
                  key={`${event.live_id}-${index}`}
                  className="rounded-3xl border border-white/10 bg-black/25 p-5"
                >
                  <p className="text-sm font-black text-red-400">
                    {event.channel_name}
                  </p>
                  <p className="mt-2 font-black">{event.event_title}</p>
                  <p className="mt-2 text-sm text-white/60">
                    {event.event_description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-2xl font-black">
                      +{event.growth_percent}%
                    </span>
                    <span className="text-sm text-white/45">
                      {formatNumber(event.value)} viewers
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} */}

        <div className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <Play className="text-red-400" />
              <div>
                <h3 className="text-2xl font-black">Lives en slide</h3>
                <p className="text-sm text-white/45">
                  Visualisation directe + liste par groupe de 3 lives.
                </p>
              </div>
            </div>

            <div className="relative w-full md:max-w-md">
              <Search
                size={18}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une chaîne ou un live..."
                className="h-14 w-full rounded-2xl border border-white/10 bg-black/30 pl-12 pr-5 text-sm font-bold text-white outline-none placeholder:text-white/35 focus:border-red-500/60"
              />
            </div>
          </div>

          {loading ? (
            <div className="h-[520px] animate-pulse rounded-[2rem] border border-white/10 bg-white/10" />
          ) : !featuredLive ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-12 text-center">
              <Radio className="mx-auto mb-4 text-red-400" size={44} />
              <h3 className="text-2xl font-black">Aucun live trouvé</h3>
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xl font-black">
                    Slide {livesGridSlideIndex + 1} / {livesGridSlides.length}
                  </h4>
                  <p className="text-sm text-white/45">
                    {filteredLives.length} lives disponibles
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={previousLivesGridSlide}
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/35 text-white transition hover:bg-white hover:text-black"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    onClick={nextLivesGridSlide}
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/35 text-white transition hover:bg-white hover:text-black"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={livesGridSlideIndex}
                  initial={{ opacity: 0, x: 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -80 }}
                  transition={{ duration: 0.45 }}
                  className="grid gap-5 xl:grid-cols-[1.45fr_0.9fr]"
                >
                  <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/30">
                    <div className="relative aspect-video bg-black">
                      {featuredEmbedUrl ? (
                        <iframe
                          src={featuredEmbedUrl}
                          title={featuredLive.title}
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : (
                        <img
                          src={getLiveImage(featuredLive)}
                          alt={featuredLive.title}
                          className="h-full w-full object-cover"
                        />
                      )}

                      <div className="pointer-events-none absolute left-5 top-5 rounded-2xl bg-red-600 px-4 py-2 text-sm font-black">
                        LIVE DIRECT
                      </div>
                    </div>

                    <div className="p-5">
                      <p className="font-black text-emerald-400">
                        {featuredLive.channel_name}
                      </p>
                      <h3 className="mt-2 line-clamp-2 text-2xl font-black">
                        {featuredLive.title}
                      </h3>

                      <div className="mt-5 grid gap-3 md:grid-cols-4">
                        <MiniValue label="Viewers" value={featuredLive.viewers} />
                        <MiniValue label="Likes" value={featuredLive.likes} />
                        <MiniValue
                          label="Commentaires"
                          value={featuredLive.comments}
                        />
                        <MiniValue
                          label="Score"
                          value={`${engagementScore(featuredLive)}/100`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {currentLivesGridSlide.map((live, index) => (
                      <SmallLiveSlideCard
                        key={live.id}
                        live={live}
                        index={index}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              <SlideDots
                total={livesGridSlides.length}
                current={livesGridSlideIndex}
                onSelect={setLivesGridSlideIndex}
                color="red"
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-sm font-black transition ${
        active
          ? "border-emerald-400/30 bg-emerald-500/20 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.12)]"
          : "border-white/10 bg-white/[0.04] text-white/55 hover:bg-white/[0.08] hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function SlideHeader({
  title,
  subtitle,
  onPrev,
  onNext,
}: {
  title: string;
  subtitle: string;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h4 className="text-xl font-black">{title}</h4>
        <p className="mt-1 text-sm text-white/45">{subtitle}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/35 text-white transition hover:bg-white hover:text-black"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={onNext}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/35 text-white transition hover:bg-white hover:text-black"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

function SlideDots({
  total,
  current,
  onSelect,
  color,
}: {
  total: number;
  current: number;
  onSelect: (index: number) => void;
  color: "red" | "yellow";
}) {
  if (total <= 1) return null;

  return (
    <div className="mt-6 flex flex-wrap justify-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={`h-2.5 rounded-full transition ${
            current === index
              ? color === "yellow"
                ? "w-10 bg-yellow-400"
                : "w-10 bg-red-500"
              : "w-2.5 bg-white/25 hover:bg-white/50"
          }`}
        />
      ))}
    </div>
  );
}

function KpiBox({
  icon: Icon,
  label,
  value,
  subLabel,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  subLabel?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl"
    >
      <Icon className="mb-4 text-emerald-400" />
      <p className="text-sm text-white/45">{label}</p>
      <p className="mt-2 text-4xl font-black">{formatNumber(value)}</p>
      {subLabel && (
        <p className="mt-2 line-clamp-1 text-sm font-bold text-yellow-400">
          {subLabel}
        </p>
      )}
    </motion.div>
  );
}

function MiniValue({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl bg-white/[0.05] p-4">
      <p className="text-xs text-white/35">{label}</p>
      <p className="mt-1 text-lg font-black">
        {typeof value === "number" ? formatNumber(value) : value}
      </p>
    </div>
  );
}

function LiveCard({ live, index }: { live: ActiveLive; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      viewport={{ once: true }}
      className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/25"
    >
      <div className="grid gap-0 md:grid-cols-[180px_1fr]">
        <a
          href={live.live_url}
          target="_blank"
          rel="noreferrer"
          className="relative h-44 overflow-hidden"
        >
          <img
            src={live.thumbnail_url || "/images/live-placeholder.jpg"}
            alt={live.title}
            className="h-full w-full object-cover"
          />
          <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-black">
            LIVE
          </span>
        </a>

        <div className="p-5">
          <p className="font-black text-emerald-400">{live.channel_name}</p>
          <h4 className="mt-2 line-clamp-2 text-xl font-black">{live.title}</h4>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <MiniValue label="Actuels" value={live.current_viewers} />
            <MiniValue label="Pic" value={live.peak_viewers} />
            <MiniValue label="Durée" value={`${live.duration_minutes} min`} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function EndedReportCard({
  report,
  index,
}: {
  report: LiveReport;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      viewport={{ once: true }}
      className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/25"
    >
      <div className="grid gap-0 md:grid-cols-[180px_1fr]">
        <a
          href={report.live_url}
          target="_blank"
          rel="noreferrer"
          className="relative h-44 overflow-hidden"
        >
          <img
            src={report.thumbnail_url || "/images/live-placeholder.jpg"}
            alt={report.title}
            className="h-full w-full object-cover"
          />
          <span className="absolute left-3 top-3 rounded-full bg-yellow-500 px-3 py-1 text-xs font-black text-black">
            TERMINÉ
          </span>
        </a>

        <div className="p-5">
          <p className="font-black text-yellow-400">{report.channel_name}</p>
          <h4 className="mt-2 line-clamp-2 text-xl font-black">
            {report.title}
          </h4>

          <p className="mt-2 text-xs text-white/40">
            Fin : {safeDate(report.ended_at || report.last_seen_at)}
          </p>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <MiniValue label="Pic" value={report.peak_viewers} />
            <MiniValue label="Moyenne" value={report.avg_viewers} />
            <MiniValue label="Durée" value={`${report.duration_minutes} min`} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function SmallLiveSlideCard({
  live,
  index,
}: {
  live: LiveStream;
  index: number;
}) {
  return (
    <motion.a
      href={live.live_url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group grid grid-cols-[130px_1fr] overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/25 transition hover:border-red-500/40 hover:bg-white/[0.06]"
    >
      <div className="relative h-32 overflow-hidden">
        <img
          src={getLiveImage(live)}
          alt={live.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-1 text-[10px] font-black">
          LIVE
        </span>
      </div>

      <div className="p-4">
        <p className="line-clamp-1 text-sm font-black text-emerald-400">
          {live.channel_name}
        </p>
        <h4 className="mt-1 line-clamp-2 text-sm font-black">{live.title}</h4>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <MiniValue label="Viewers" value={live.viewers} />
          <MiniValue label="Likes" value={live.likes} />
        </div>
      </div>
    </motion.a>
  );
}

function EmptyMessage({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/25 p-8 text-center text-white/45">
      {text}
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center text-white/45">
      <BarChart3 className="mb-4 text-emerald-400" size={44} />
      <p className="text-xl font-black text-white">
        Pas encore de courbe active
      </p>
      <p className="mt-2 max-w-md text-sm">
        Dès qu’un live actif est détecté et que le script passe plusieurs fois,
        la courbe s’affiche ici.
      </p>
    </div>
  );
}