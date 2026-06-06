"use client";

import { motion } from "framer-motion";
import {
  Radio,
  Eye,
  PlayCircle,
  TrendingUp,
  Users,
  ArrowUpRight,
  Sparkles,
  Activity,
} from "lucide-react";

type LiveStream = {
  title: string;
  channel_name: string;
  thumbnail?: string;
  live_url: string;
  viewers: number;
  likes: number;
  comments: number;
};

function formatNumber(value: number) {
  const num = Number(value || 0);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return new Intl.NumberFormat("fr-FR").format(num);
}

export default function LiveHero({ lives = [] }: { lives?: LiveStream[] }) {
  const activeLives = lives.length;
  const totalViewers = lives.reduce(
    (sum, live) => sum + Number(live.viewers || 0),
    0
  );
  const totalLikes = lives.reduce(
    (sum, live) => sum + Number(live.likes || 0),
    0
  );
  const channelsCount = new Set(lives.map((live) => live.channel_name)).size;

  const topLives = [...lives]
    .sort((a, b) => Number(b.viewers || 0) - Number(a.viewers || 0))
    .slice(0, 3);

  const kpis = [
    {
      label: "Lives actifs",
      value: formatNumber(activeLives),
      icon: Radio,
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
    {
      label: "Viewers en direct",
      value: formatNumber(totalViewers),
      icon: Eye,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Chaînes en live",
      value: formatNumber(channelsCount),
      icon: PlayCircle,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Likes cumulés",
      value: formatNumber(totalLikes),
      icon: TrendingUp,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#020617] px-5 py-20 text-white md:px-8 md:py-28">
      <div className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-red-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-40 h-[420px] w-[420px] rounded-full bg-emerald-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[130px]" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:70px_70px]" />

      <div className="relative z-10 mx-auto max-w-[1500px]">
        <div className="grid items-center gap-10 xl:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-red-300">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
              </span>
              Monitoring YouTube Live réel
            </div>

            <h1 className="mt-7 max-w-5xl text-4xl font-black leading-tight md:text-6xl xl:text-7xl">
              Suivez les Web TV sénégalaises en{" "}
              <span className="bg-gradient-to-r from-red-400 via-emerald-400 to-yellow-300 bg-clip-text text-transparent">
                temps réel
              </span>
              .
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/60 md:text-lg">
              Les lives affichés proviennent des chaînes enregistrées dans
              dajee-bi et sont mis à jour automatiquement depuis les données
              YouTube.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              {/* <a
                href="#lives"
                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-red-600 px-7 py-5 text-sm font-black shadow-2xl shadow-red-600/25 transition hover:bg-white hover:text-black"
              >
                Voir les lives
                <ArrowUpRight
                  size={18}
                  className="transition group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </a> */}

              <div className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-7 py-5 text-sm font-black text-white/75 backdrop-blur-xl">
                <Activity size={18} className="text-emerald-400" />
                Données en direct
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-r from-red-500/20 via-emerald-500/20 to-blue-500/20 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-white">
                    Signal actuel
                  </p>
                  <p className="text-xs text-white/45">
                    Les médias les plus suivis maintenant
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-black">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                  LIVE DATA
                </div>
              </div>

              <div className="space-y-4">
                {topLives.length > 0 ? (
                  topLives.map((live, index) => (
                    <motion.a
                      key={`${live.channel_name}-${live.live_url}`}
                      href={live.live_url}
                      target="_blank"
                      rel="noreferrer"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 6 }}
                      className="group grid grid-cols-[90px_1fr] gap-4 rounded-[1.5rem] border border-white/10 bg-black/30 p-3 transition hover:border-red-500/40 hover:bg-white/[0.08] sm:grid-cols-[120px_1fr]"
                    >
                      <div className="relative h-24 overflow-hidden rounded-2xl sm:h-28">
                        <img
                          src={
                            live.thumbnail ||
                            "/images/live-placeholder.jpg"
                          }
                          alt={live.title}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                        <div className="absolute left-2 top-2 rounded-lg bg-red-600 px-2 py-1 text-xs font-black">
                          #{index + 1}
                        </div>

                        <div className="absolute bottom-2 right-2 rounded-full bg-red-600 px-2 py-1 text-[10px] font-black">
                          LIVE
                        </div>
                      </div>

                      <div className="min-w-0 py-1">
                        <div className="mb-2 flex items-center gap-2">
                          <Sparkles
                            size={15}
                            className="shrink-0 text-yellow-400"
                          />
                          <p className="line-clamp-1 text-sm font-black">
                            {live.channel_name}
                          </p>
                        </div>

                        <h3 className="line-clamp-2 text-base font-black leading-snug text-white sm:text-lg">
                          {live.title}
                        </h3>

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/55">
                          <span className="inline-flex items-center gap-1 text-emerald-400">
                            <Users size={14} />
                            {formatNumber(live.viewers)} viewers
                          </span>

                          <span className="inline-flex items-center gap-1 text-red-300">
                            <Radio size={14} />
                            En direct
                          </span>
                        </div>
                      </div>
                    </motion.a>
                  ))
                ) : (
                  <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-6 text-center text-white/60">
                    Aucun live réel détecté actuellement.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + index * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition group-hover:opacity-100" />

              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-sm text-white/45">{item.label}</p>
                  <h3 className="mt-3 text-4xl font-black">{item.value}</h3>
                </div>

                <div className={`rounded-2xl ${item.bg} p-4`}>
                  <item.icon className={item.color} size={26} />
                </div>
              </div>

              <div className="relative z-10 mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-500 via-emerald-400 to-yellow-300"
                  style={{ width: `${60 + index * 10}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}