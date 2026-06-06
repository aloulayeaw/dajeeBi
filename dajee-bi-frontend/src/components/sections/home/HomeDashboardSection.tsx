"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  Eye,
  Heart,
  PlayCircle,
  Radio,
  Sparkles,
  Star,
  TrendingUp,
  Video,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";

type WeeklyEvent = {
  title: string;
  channels?: number;
  videos?: number;
  views?: number;
  likes?: number;
  comments?: number;
  total_views?: number;
  total_videos?: number;
  total_channels?: number;
  coverage_score?: number;
};

type MediaEvent = {
  event_key: string;
  title: string;
  total_videos: number;
  total_views: number;
  total_likes: number;
  total_comments: number;
  total_channels: number;
  coverage_score: number;
  buzz_score: number;
};

type Trend = {
  keyword: string;
  videos: number;
  views: number;
};

type TopVideo = {
  title: string;
  channel_name: string;
  thumbnail_url: string;
  video_url: string;
  views: number;
  likes: number;
  comments: number;
  published_at: string;
};

type Channel = {
  id: number | string;
  name: string;
  description?: string;
  logo?: string;
  thumbnail?: string;
  image?: string;
  channel_logo?: string;
  subscribers?: number;
  views?: number;
  videos?: number;
};

function formatNumber(value?: number) {
  const num = Number(value || 0);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return new Intl.NumberFormat("fr-FR").format(num);
}

function percent(value: number, max: number) {
  if (!max || max <= 0) return 0;
  return Math.min(100, Math.max(6, Math.round((value / max) * 100)));
}

function safeImage(src?: string) {
  return src && src.trim() !== "" ? src : "/images/backgrounds/slideHome.png";
}

function getChannelImage(channel: Channel) {
  return (
    channel.logo ||
    channel.thumbnail ||
    channel.image ||
    channel.channel_logo ||
    "/images/backgrounds/slideHome.png"
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 35, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1 },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0 },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0 },
};

export default function HomeDashboardSection({
  weeklyEvent,
  trends = [],
  topVideos = [],
  mediaEvents = [],
  channels = [],
}: {
  weeklyEvent?: WeeklyEvent | null;
  trends?: Trend[];
  topVideos?: TopVideo[];
  mediaEvents?: MediaEvent[];
  channels?: Channel[];
}) {
  const totalViews =
    weeklyEvent?.views ||
    weeklyEvent?.total_views ||
    mediaEvents.reduce((sum, item) => sum + Number(item.total_views || 0), 0);

  const totalVideos =
    weeklyEvent?.videos ||
    weeklyEvent?.total_videos ||
    mediaEvents.reduce((sum, item) => sum + Number(item.total_videos || 0), 0);

  const totalChannels =
    weeklyEvent?.channels ||
    weeklyEvent?.total_channels ||
    mediaEvents.reduce(
      (max, item) => Math.max(max, Number(item.total_channels || 0)),
      0
    );

  const totalLikes =
    weeklyEvent?.likes ||
    mediaEvents.reduce((sum, item) => sum + Number(item.total_likes || 0), 0);

  const totalComments =
    weeklyEvent?.comments ||
    mediaEvents.reduce((sum, item) => sum + Number(item.total_comments || 0), 0);

  const dominantEvent =
    weeklyEvent?.title || mediaEvents[0]?.title || "Signal média dominant";

  const dominantCover = Number(
    weeklyEvent?.coverage_score || mediaEvents[0]?.coverage_score || 0
  );

  const maxTrendViews = Math.max(
    ...trends.map((item) => Number(item.views || 0)),
    1
  );

  const specialChannels = channels.filter((channel) => {
    const name = channel.name.toLowerCase();
    return name.includes("xalaat") || name.includes("seneweb");
  });

  const kpis = [
    {
      label: "Vues analysées",
      value: totalViews,
      icon: Eye,
      helper: "Audience totale collectée",
    },
    {
      label: "Vidéos suivies",
      value: totalVideos,
      icon: Video,
      helper: "Vidéos média indexées",
    },
    {
      label: "Médias actifs",
      value: totalChannels,
      icon: Radio,
      helper: "Chaînes observées",
    },
    {
      label: "Engagement",
      value: totalLikes + totalComments,
      icon: Heart,
      helper: "Likes + commentaires",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#f6f7f2] py-24">
      <div className="pointer-events-none absolute left-[-160px] top-[-140px] h-[460px] w-[460px] rounded-full bg-green-300/30 blur-3xl" />
      <div className="pointer-events-none absolute right-[-180px] top-[260px] h-[520px] w-[520px] rounded-full bg-yellow-300/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-180px] left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-red-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="mb-10 text-center"
        >
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-green-700 shadow-sm">
            <Sparkles size={14} />
            Dajee-bi média intelligence
          </p>

          <h2 className="mx-auto mt-6 max-w-5xl text-4xl font-black tracking-tight text-neutral-950 md:text-7xl">
            Le pouls des médias sénégalais, en direct et en données
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base font-medium leading-8 text-neutral-500 md:text-lg">
            Une page d’accueil plus claire, plus visuelle et plus média : vidéos virales,
            tendances fortes, médias dominants et indicateurs clés.
          </p>
        </motion.div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((item, index) => (
            <KpiCard key={item.label} {...item} index={index} />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8 }}
            className="group overflow-hidden rounded-[2.4rem] bg-neutral-950 shadow-2xl shadow-black/20"
          >
            <div className="relative min-h-[560px] p-6 md:p-10">
              <Image
                src={safeImage(topVideos[0]?.thumbnail_url)}
                alt={dominantEvent}
                fill
                className="object-cover opacity-85 transition duration-1000 group-hover:scale-105"
                unoptimized
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

              <div className="relative z-10 flex min-h-[490px] flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white shadow-lg shadow-red-600/30">
                    <Zap size={14} />
                    Signal média dominant
                  </div>

                  <h3 className="mt-7 max-w-4xl text-4xl font-black leading-tight text-white drop-shadow-2xl md:text-6xl">
                    {dominantEvent}
                  </h3>

                  <p className="mt-5 max-w-2xl text-sm font-medium leading-8 text-white/90 md:text-base">
                    Dajee-bi transforme l’activité des chaînes, des vidéos et des conversations
                    en indicateurs lisibles pour comprendre rapidement ce qui domine l’espace média.
                  </p>
                </div>

                <div>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                    <HeroMini label="Médias" value={totalChannels} />
                    <HeroMini label="Vidéos" value={totalVideos} />
                    <HeroMini label="Vues" value={totalViews} />
                    <HeroMini label="Likes" value={totalLikes} />
                    <HeroMini label="Com." value={totalComments} />
                  </div>

                  <div className="mt-7">
                    <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-[0.18em] text-white/80">
                      <span>Couverture média</span>
                      <span>{Math.round(dominantCover)}%</span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-white/25">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{
                          width: `${Math.min(Math.max(dominantCover, 8), 100)}%`,
                        }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-green-400 via-yellow-300 to-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8 }}
          >
            <Card
              title="Top vidéos virales"
              icon={<PlayCircle size={18} />}
              className="h-full"
            >
              <div className="space-y-4">
                {topVideos.length ? (
                  topVideos.slice(0, 5).map((video, index) => (
                    <VideoRow
                      key={video.video_url || index}
                      video={video}
                      index={index}
                    />
                  ))
                ) : (
                  <EmptyState text="Aucune vidéo virale disponible." />
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="mt-8">
          <Card title="Tendances actuelles" icon={<TrendingUp size={18} />}>
            <div className="grid gap-5 md:grid-cols-2">
              {trends.length ? (
                trends.slice(0, 8).map((item, index) => (
                  <TrendRow
                    key={`${item.keyword}-${index}`}
                    item={item}
                    index={index}
                    maxTrendViews={maxTrendViews}
                  />
                ))
              ) : (
                <EmptyState text="Aucune tendance disponible." />
              )}
            </div>
          </Card>
        </div>

        {specialChannels.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 45 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="mt-8 rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200"
          >
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-red-600">
                  <Star size={14} />
                  Focus médias
                </div>

                <h3 className="mt-4 text-3xl font-black text-slate-950 md:text-4xl">
                  Médias dominants à surveiller
                </h3>

                <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                  Une section dédiée aux médias stratégiques suivis par Dajee-bi.
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
                  initial={{ opacity: 0, x: index % 2 === 0 ? -35 : 35 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.6 }}
                  whileHover={{ y: -6, scale: 1.015 }}
                  className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-sm transition hover:bg-white hover:shadow-xl"
                >
                  <Link
                    href={`/channels/${channel.id}`}
                    className="grid gap-0 md:grid-cols-[190px_1fr]"
                  >
                    <div className="relative h-56 overflow-hidden md:h-full">
                      <img
                        src={getChannelImage(channel)}
                        alt={channel.name}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                      <div className="absolute bottom-4 left-4 rounded-full bg-red-600 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-white">
                        Média suivi
                      </div>
                    </div>

                    <div className="p-5">
                      <h4 className="text-2xl font-black text-slate-950">
                        {channel.name}
                      </h4>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {channel.description ||
                          "Média suivi dans la watchlist Dajee-bi."}
                      </p>

                      <div className="mt-5 grid grid-cols-3 gap-3">
                        <ChannelMini
                          label="Abonnés"
                          value={channel.subscribers}
                        />
                        <ChannelMini label="Vues" value={channel.views} />
                        <ChannelMini label="Vidéos" value={channel.videos} />
                      </div>

                      <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-black text-white transition group-hover:bg-slate-950">
                        Voir la chaîne
                        <ArrowUpRight size={16} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function KpiCard({
  label,
  value,
  helper,
  icon: Icon,
  index,
}: {
  label: string;
  value: number;
  helper: string;
  icon: any;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, rotateX: -8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.4 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group rounded-[1.9rem] border border-black/5 bg-white p-5 shadow-xl shadow-black/5"
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-700 transition duration-300 group-hover:bg-green-700 group-hover:text-white">
          <Icon size={23} />
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-50 text-neutral-300 transition group-hover:bg-neutral-950 group-hover:text-white">
          <ArrowUpRight size={17} />
        </div>
      </div>

      <p className="text-sm font-bold text-neutral-500">{label}</p>
      <p className="mt-1 text-3xl font-black text-neutral-950">
        {formatNumber(value)}
      </p>
      <p className="mt-2 text-xs font-medium text-neutral-400">{helper}</p>
    </motion.div>
  );
}

function Card({
  title,
  icon,
  children,
  className = "",
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.22 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className={`rounded-[2.2rem] border border-black/5 bg-white p-5 shadow-xl shadow-black/5 md:p-6 ${className}`}
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-3 text-xl font-black text-neutral-950">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-lg shadow-black/15">
            {icon || <BarChart3 size={18} />}
          </span>
          {title}
        </h2>

        <button className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-2 text-sm font-black text-green-700 transition hover:bg-green-700 hover:text-white">
          Voir tout
          <ArrowUpRight size={14} />
        </button>
      </div>

      {children}
    </motion.div>
  );
}

function HeroMini({ label, value }: { label: string; value: number }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.03 }}
      className="rounded-2xl border border-white/20 bg-white/20 p-4 shadow-lg backdrop-blur-xl"
    >
      <p className="text-2xl font-black text-white drop-shadow">
        {formatNumber(value)}
      </p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-white/75">
        {label}
      </p>
    </motion.div>
  );
}

function VideoRow({ video, index }: { video: TopVideo; index: number }) {
  return (
    <motion.a
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.55 }}
      viewport={{ once: true }}
      whileHover={{ x: 6, scale: 1.01 }}
      href={video.video_url}
      target="_blank"
      rel="noreferrer"
      className="group grid grid-cols-[124px_1fr] gap-3 rounded-[1.5rem] border border-black/5 bg-[#fbfbfa] p-3 transition hover:bg-white hover:shadow-xl"
    >
      <div className="relative h-24 overflow-hidden rounded-2xl bg-neutral-100">
        <Image
          src={safeImage(video.thumbnail_url)}
          alt={video.title}
          fill
          className="object-cover transition duration-700 group-hover:scale-110"
          unoptimized
        />

        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur-xl">
          <PlayCircle size={22} />
        </div>
      </div>

      <div className="min-w-0">
        <p className="line-clamp-2 text-sm font-black text-neutral-950">
          {video.title}
        </p>

        <p className="mt-1 line-clamp-1 text-xs font-semibold text-neutral-500">
          {video.channel_name}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2 text-xs font-black">
          <span className="text-green-700">{formatNumber(video.views)} vues</span>
          <span className="text-neutral-400">{formatNumber(video.likes)} likes</span>
        </div>
      </div>
    </motion.a>
  );
}

function TrendRow({
  item,
  index,
  maxTrendViews,
}: {
  item: Trend;
  index: number;
  maxTrendViews: number;
}) {
  const width = percent(Number(item.views || 0), maxTrendViews);

  return (
    <motion.div
      initial={{ opacity: 0, x: -26 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.55 }}
      viewport={{ once: true }}
      className="rounded-[1.4rem] bg-[#fbfbfa] p-4"
    >
      <div className="mb-3 flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-700 text-sm font-black text-white shadow-lg shadow-green-700/20">
          {index + 1}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-black text-neutral-950">
            {item.keyword}
          </p>
          <p className="text-xs font-medium text-neutral-500">
            {formatNumber(item.views)} vues • {formatNumber(item.videos)} vidéos
          </p>
        </div>

        <p className="rounded-full bg-white px-3 py-2 text-sm font-black text-green-700 shadow-sm">
          {width}%
        </p>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-neutral-200">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${width}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-green-700 via-yellow-400 to-red-500"
        />
      </div>
    </motion.div>
  );
}

function ChannelMini({
  label,
  value,
}: {
  label: string;
  value?: number;
}) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm">
      <p className="text-xs font-semibold text-slate-400">{label}</p>
      <p className="mt-1 font-black text-slate-950">
        {formatNumber(value || 0)}
      </p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-black/10 bg-neutral-50 p-6 text-center text-sm font-semibold text-neutral-400">
      {text}
    </div>
  );
}