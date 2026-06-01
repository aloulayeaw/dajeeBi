"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Eye,
  Flame,
  MessageCircle,
  Radio,
  Sparkles,
  Users,
} from "lucide-react";

type WeeklyEvent = {
  title: string;
  views: number;
  videos: number;
  channels: number;
  likes: number;
  comments: number;
  coverage_score: number;
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

type TopInfluencer = {
  full_name: string;
  role: string;
  photo_url: string;
  global_score: number;
  influence_score: number;
  buzz_score: number;
};

type AiAnalysis = {
  title: string;
  text: string;
};

function formatNumber(value: number) {
  const num = Number(value || 0);

  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;

  return new Intl.NumberFormat("fr-FR").format(num);
}

export default function AnalyticsPreviewSection({
  weeklyEvent,
  topVideos = [],
  topInfluencers = [],
  aiAnalysis,
}: {
  weeklyEvent?: WeeklyEvent | null;
  topVideos?: TopVideo[];
  topInfluencers?: TopInfluencer[];
  aiAnalysis?: AiAnalysis;
}) {
  const topVideo = topVideos[0];
  const topInfluencer = topInfluencers[0];

  return (
    <section className="relative overflow-hidden bg-[#f8fafc] py-24">
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-green-400/15 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-yellow-400/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-green-700">
              Analyse
            </p>

            <h2 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-neutral-950 md:text-6xl">
              Ce que les données racontent cette semaine.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-600">
              dajee-bi transforme les vues, vidéos, médias et engagements en
              signaux simples pour comprendre l’actualité numérique.
            </p>
          </div>

          <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-xl shadow-black/5">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-green-100 p-4 text-green-700">
                <Sparkles size={28} />
              </div>

              <div>
                <p className="text-sm text-neutral-500">Lecture automatique</p>
                <p className="text-2xl font-black text-neutral-950">
                  Synthèse intelligente
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-7 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-[2.5rem] border border-black/5 bg-white shadow-2xl shadow-black/10"
          >
            <div className="relative bg-neutral-950 p-8 text-white">
              <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-green-500/20 blur-3xl" />

              <div className="relative z-10">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-black text-white">
                  <Flame size={16} />
                  Événement dominant
                </div>

                <h3 className="max-w-3xl text-4xl font-black leading-tight md:text-5xl">
                  {weeklyEvent?.title || "Aucun événement dominant détecté"}
                </h3>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
                  {aiAnalysis?.text ||
                    "Les prochaines analyses apparaîtront dès que les données seront disponibles."}
                </p>
              </div>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-green-50 p-5">
                <Eye className="mb-3 text-green-700" />
                <p className="text-sm text-neutral-500">Vues cumulées</p>
                <p className="mt-2 text-3xl font-black text-green-700">
                  {formatNumber(weeklyEvent?.views || 0)}
                </p>
              </div>

              <div className="rounded-2xl bg-red-50 p-5">
                <Radio className="mb-3 text-red-600" />
                <p className="text-sm text-neutral-500">Vidéos publiées</p>
                <p className="mt-2 text-3xl font-black text-red-600">
                  {formatNumber(weeklyEvent?.videos || 0)}
                </p>
              </div>

              <div className="rounded-2xl bg-yellow-50 p-5">
                <Users className="mb-3 text-yellow-700" />
                <p className="text-sm text-neutral-500">Médias actifs</p>
                <p className="mt-2 text-3xl font-black text-yellow-700">
                  {formatNumber(weeklyEvent?.channels || 0)}
                </p>
              </div>

              <div className="rounded-2xl bg-neutral-100 p-5">
                <MessageCircle className="mb-3 text-neutral-950" />
                <p className="text-sm text-neutral-500">Commentaires</p>
                <p className="mt-2 text-3xl font-black text-neutral-950">
                  {formatNumber(weeklyEvent?.comments || 0)}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6">
              <div className="rounded-2xl bg-neutral-50 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-black text-neutral-950">
                    Couverture média
                  </p>

                  <p className="font-black text-green-700">
                    {weeklyEvent?.coverage_score || 0}%
                  </p>
                </div>

                <div className="h-4 overflow-hidden rounded-full bg-neutral-200">
                  <div
                    className="h-full rounded-full bg-green-700"
                    style={{
                      width: `${Math.min(
                        weeklyEvent?.coverage_score || 0,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-7">
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-[2.5rem] border border-black/5 bg-white p-7 shadow-2xl shadow-black/10"
            >
              <p className="text-sm font-black uppercase tracking-[0.25em] text-red-600">
                Vidéo la plus visible
              </p>

              <h3 className="mt-4 line-clamp-2 text-3xl font-black text-neutral-950">
                {topVideo?.title || "Aucune vidéo détectée"}
              </h3>

              <p className="mt-3 font-bold text-green-700">
                {topVideo?.channel_name || "—"}
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-green-50 p-4">
                  <p className="text-xs text-neutral-500">Vues</p>
                  <p className="text-xl font-black text-green-700">
                    {formatNumber(topVideo?.views || 0)}
                  </p>
                </div>

                <div className="rounded-2xl bg-red-50 p-4">
                  <p className="text-xs text-neutral-500">Likes</p>
                  <p className="text-xl font-black text-red-600">
                    {formatNumber(topVideo?.likes || 0)}
                  </p>
                </div>

                <div className="rounded-2xl bg-yellow-50 p-4">
                  <p className="text-xs text-neutral-500">Com.</p>
                  <p className="text-xl font-black text-yellow-700">
                    {formatNumber(topVideo?.comments || 0)}
                  </p>
                </div>
              </div>

              {topVideo?.video_url && (
                <a
                  href={topVideo.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-black text-white transition hover:bg-green-700"
                >
                  Voir la vidéo
                  <ArrowUpRight size={16} />
                </a>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="rounded-[2.5rem] border border-black/5 bg-white p-7 shadow-2xl shadow-black/10"
            >
              <p className="text-sm font-black uppercase tracking-[0.25em] text-green-700">
                Influence dominante
              </p>

              <h3 className="mt-4 text-3xl font-black text-neutral-950">
                {topInfluencer?.full_name || "Aucun influenceur détecté"}
              </h3>

              <p className="mt-2 text-neutral-500">
                {topInfluencer?.role || "—"}
              </p>

              <div className="mt-6 rounded-2xl bg-green-50 p-5">
                <p className="text-sm text-neutral-500">Score global</p>
                <p className="mt-2 text-5xl font-black text-green-700">
                  {Math.round(topInfluencer?.global_score || 0)}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}