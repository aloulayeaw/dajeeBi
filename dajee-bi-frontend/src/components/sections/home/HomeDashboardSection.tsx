"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Eye,
  Flame,
  MessageCircle,
  Radio,
  Users,
  PlayCircle,
  TrendingUp,
  Zap,
} from "lucide-react";

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

// type MediaEvent = {
//   event_key: string;
//   title: string;
//   total_videos: number;
//   total_views: number;
//   total_likes: number;
//   total_comments: number;
//   total_channels: number;
//   coverage_score: number;
//   buzz_score: number;
// };

type TopInfluencer = {
  full_name: string;
  role: string;
  photo_url: string;
  global_score: number;
  influence_score: number;
  buzz_score: number;
};

type LiveStream = {
  title: string;
  channel_name: string;
  thumbnail_url: string;
  live_url: string;
  viewers: number;
  likes: number;
  comments: number;
};

type AiAnalysis = {
  title: string;
  text: string;
};

function formatNumber(value: number) {
  const num = Number(value || 0);

  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }

  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }

  return new Intl.NumberFormat("fr-FR").format(num);
}

export default function HomeDashboardSection({
    weeklyEvent,
    trends = [],
    topVideos = [],
    topInfluencers = [],
    lives = [],
    aiAnalysis,
    mediaEvents = [],
}: {
  weeklyEvent?: WeeklyEvent | null;
  trends?: Trend[];
  topVideos?: TopVideo[];
  topInfluencers?: TopInfluencer[];
  lives?: LiveStream[];
  aiAnalysis?: AiAnalysis;
  mediaEvents?: MediaEvent[];
  
}) {
  return (
    <section className="bg-[#f8fafc] pb-20">
      <div className="mx-auto grid max-w-7xl gap-5 px-5 md:px-8 lg:grid-cols-[1.15fr_0.85fr]">
        {/* EVENT */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-[2rem] bg-neutral-950 text-white shadow-xl"
        >
          <div className="relative min-h-[360px] p-7">
            <Image
              src={
                topVideos[0]?.thumbnail_url ||
                "/images/backgrounds/slideHome.png"
              }
              alt="Événement média"
              fill
              className="object-cover opacity-70"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

            <div className="relative z-10 max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-green-700 px-4 py-2 text-xs font-black uppercase">
                <Flame size={14} />
                Événement média de la semaine
              </div>

              <h2 className="text-4xl font-black leading-tight md:text-5xl">
                {weeklyEvent?.title || "Aucun événement dominant"}
              </h2>

              <p className="mt-4 max-w-xl text-white/75">
                L’événement politique ou média le plus relayé cette semaine.
              </p>

              <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-5">
                {[
                  ["Chaînes", weeklyEvent?.channels || 0],
                  ["Vidéos", weeklyEvent?.videos || 0],
                  ["Vues", weeklyEvent?.views || 0],
                  ["Likes", weeklyEvent?.likes || 0],
                  ["Com.", weeklyEvent?.comments || 0],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl bg-white/10 p-4 backdrop-blur-xl"
                  >
                    <p className="text-2xl font-black">
                      {formatNumber(Number(value))}
                    </p>

                    <p className="text-xs text-white/60">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 h-4 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{
                    width: `${Math.min(
                      weeklyEvent?.coverage_score || 0,
                      100
                    )}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-sm font-bold text-green-300">
                Couverture média :{" "}
                {weeklyEvent?.coverage_score || 0}% des chaînes suivies
              </p>
            </div>
          </div>
        </motion.div>

        {/* TRENDS */}
        <Card title="🔥 Tendances actuelles">
          <div className="space-y-4">
            {trends.slice(0, 5).map((item, index) => (
              <div
                key={item.keyword}
                className="flex items-center gap-4"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-sm font-black text-white">
                  {index + 1}
                </div>

                <div className="flex-1">
                  <p className="font-black">{item.keyword}</p>

                  <p className="text-sm text-neutral-500">
                    {formatNumber(item.views)} vues
                  </p>
                </div>

                <div className="text-sm font-black text-green-700">
                  +{156 - index * 23}%
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="🔥 Événements détectés par dajee-bi">
        <div className="space-y-4">
            {mediaEvents.slice(0, 4).map((event, index) => (
            <div
                key={event.event_key}
                className="rounded-2xl border border-black/5 p-4"
            >
                <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-sm font-black text-white">
                    {index + 1}
                    </div>

                    <div>
                    <p className="font-black leading-tight">
                        {event.title}
                    </p>

                    <p className="text-xs text-neutral-500">
                        {event.total_channels} médias actifs
                    </p>
                    </div>
                </div>

                <div className="rounded-full bg-green-100 px-3 py-2 text-sm font-black text-green-700">
                    {event.buzz_score}/100
                </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-neutral-50 p-3">
                    <p className="text-xs text-neutral-500">Vidéos</p>

                    <p className="text-lg font-black">
                    {formatNumber(event.total_videos)}
                    </p>
                </div>

                <div className="rounded-xl bg-neutral-50 p-3">
                    <p className="text-xs text-neutral-500">Vues</p>

                    <p className="text-lg font-black">
                    {formatNumber(event.total_views)}
                    </p>
                </div>

                <div className="rounded-xl bg-neutral-50 p-3">
                    <p className="text-xs text-neutral-500">Couverture</p>

                    <p className="text-lg font-black">
                    {event.coverage_score}%
                    </p>
                </div>
                </div>
            </div>
            ))}
        </div>
        </Card>

        {/* TOP VIDEOS */}
        <Card title="▶ Top vidéos virales">
          <div className="grid gap-4 sm:grid-cols-2">
            {topVideos.slice(0, 4).map((video) => (
              <a
                key={video.video_url}
                href={video.video_url}
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"
              >
                <div className="relative h-36">
                  <Image
                    src={
                      video.thumbnail_url ||
                      "/images/channel/xaalat.jpg"
                    }
                    alt={video.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-black/20" />

                  <PlayCircle className="absolute right-3 top-3 text-white" />
                </div>

                <div className="p-3">
                  <h3 className="line-clamp-2 text-sm font-black">
                    {video.title}
                  </h3>

                  <p className="mt-1 text-xs text-neutral-500">
                    {video.channel_name}
                  </p>

                  <p className="mt-2 text-xs font-bold text-green-700">
                    {formatNumber(video.views)} vues
                  </p>
                </div>
              </a>
            ))}
          </div>
        </Card>

        {/* INFLUENCERS */}
        <Card title="🏆 Top influenceurs">
          <div className="space-y-4">
            {topInfluencers.slice(0, 5).map((item, index) => (
              <div
                key={item.full_name}
                className="flex items-center gap-4"
              >
                <div className="text-lg font-black text-neutral-400">
                  {index + 1}
                </div>

                <div className="h-11 w-11 overflow-hidden rounded-full bg-green-100">
                  {item.photo_url ? (
                    <Image
                      src={item.photo_url}
                      alt={item.full_name}
                      width={44}
                      height={44}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-black text-green-700">
                      {item.full_name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-black">{item.full_name}</p>

                  <p className="text-sm text-neutral-500">
                    {item.role}
                  </p>
                </div>

                <div className="rounded-xl border border-green-200 px-3 py-2 font-black text-green-700">
                  {Math.round(item.global_score)}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* LIVES */}
        <Card title="🔴 Lives en cours">
          <div className="space-y-4">
            {lives.slice(0, 3).map((live) => (
              <a
                key={live.live_url}
                href={live.live_url}
                target="_blank"
                rel="noreferrer"
                className="flex gap-3 rounded-2xl border border-black/5 p-3 transition hover:bg-neutral-50"
              >
                <div className="relative h-16 w-24 overflow-hidden rounded-xl bg-neutral-100">
                  <Image
                    src={
                      live.thumbnail_url ||
                      "/images/channel/xaalat.jpg"
                    }
                    alt={live.title}
                    fill
                    className="object-cover"
                  />

                  <span className="absolute right-1 top-1 rounded bg-red-600 px-2 py-0.5 text-[10px] font-black text-white">
                    LIVE
                  </span>
                </div>

                <div className="flex-1">
                  <p className="line-clamp-2 text-sm font-black">
                    {live.title}
                  </p>

                  <p className="text-xs text-neutral-500">
                    {live.channel_name}
                  </p>

                  <p className="text-xs font-bold text-red-600">
                    {formatNumber(live.viewers)} viewers
                  </p>
                </div>
              </a>
            ))}
          </div>
        </Card>

        {/* MEDIA */}
        <Card title="📺 Médias les plus vus (7 derniers jours)">
          <div className="space-y-4">
            {topVideos.slice(0, 5).map((video, index) => (
              <div key={`${video.channel_name}-${index}`}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-bold">
                    {video.channel_name}
                  </span>

                  <span className="text-neutral-500">
                    {formatNumber(video.views)}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-green-600"
                    style={{
                      width: `${Math.max(
                        18,
                        100 - index * 15
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* BUZZ */}
        <Card title="📈 Évolution du buzz">
          <div className="flex h-64 items-end gap-3 rounded-2xl bg-neutral-50 p-5">
            {[28, 44, 35, 55, 63, 82, 100].map((h, i) => (
              <div
                key={i}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div
                  className="w-full rounded-t-xl bg-green-600"
                  style={{ height: `${h}%` }}
                />

                <span className="text-xs text-neutral-400">
                  {20 + i}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* AI */}
        <Card title="🤖 Analyse">
          <div className="rounded-2xl bg-green-50 p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-700 text-white">
                <Zap size={22} />
              </div>

              <div>
                <p className="font-black">Analyse automatique</p>

                <p className="text-sm text-neutral-500">
                  Résumé intelligent
                </p>
              </div>
            </div>

            <p className="leading-7 text-neutral-700">
              {aiAnalysis?.text ||
                "Les analyses intelligentes apparaîtront ici automatiquement."}
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}

function Card({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`rounded-[2rem] border border-black/5 bg-white p-5 shadow-xl shadow-black/5 ${className}`}
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-black text-neutral-950">
          {title}
        </h2>

        <button className="text-sm font-black text-green-700">
          Voir tout
        </button>
      </div>

      {children}
    </motion.div>
  );
}