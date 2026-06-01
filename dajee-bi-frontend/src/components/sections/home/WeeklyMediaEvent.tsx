"use client";

import { motion } from "framer-motion";
import {
  Eye,
  Flame,
  MessageCircle,
  Radio,
  Users,
  ArrowUpRight,
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

function formatNumber(value: number) {
  const num = Number(value || 0);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return new Intl.NumberFormat("fr-FR").format(num);
}

export default function WeeklyMediaEvent({
  event,
}: {
  event?: WeeklyEvent | null;
}) {
  return (
    <section className="relative overflow-hidden bg-white py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-[2.5rem] bg-neutral-950 shadow-2xl shadow-black/20"
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
            <div className="relative p-8 text-white md:p-12">
              <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-green-500/20 blur-3xl" />

              <div className="relative z-10">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-black text-white">
                  <Flame size={16} />
                  Événement média de la semaine
                </div>

                <h2 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">
                  {event?.title || "Aucun événement dominant détecté"}
                </h2>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
                  Cet événement concentre actuellement la plus forte couverture
                  médiatique parmi les vidéos et médias suivis par dajee-bi.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-xl">
                    <Eye className="mb-3 text-green-400" />
                    <p className="text-sm text-white/50">Vues cumulées</p>
                    <p className="text-3xl font-black">
                      {formatNumber(event?.views || 0)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-xl">
                    <Radio className="mb-3 text-red-400" />
                    <p className="text-sm text-white/50">Vidéos publiées</p>
                    <p className="text-3xl font-black">
                      {formatNumber(event?.videos || 0)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-xl">
                    <Users className="mb-3 text-yellow-400" />
                    <p className="text-sm text-white/50">Médias actifs</p>
                    <p className="text-3xl font-black">
                      {formatNumber(event?.channels || 0)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-xl">
                    <MessageCircle className="mb-3 text-blue-400" />
                    <p className="text-sm text-white/50">Commentaires</p>
                    <p className="text-3xl font-black">
                      {formatNumber(event?.comments || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex items-center bg-gradient-to-br from-green-700 to-green-950 p-8 md:p-12">
              <div className="w-full rounded-[2rem] bg-white p-7 shadow-2xl">
                <p className="text-sm font-black uppercase tracking-[0.25em] text-green-700">
                  Couverture média
                </p>

                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <p className="text-6xl font-black text-neutral-950">
                      {event?.coverage_score || 0}%
                    </p>
                    <p className="mt-2 text-neutral-500">
                      des médias suivis ont relayé ce sujet
                    </p>
                  </div>

                  <div className="rounded-full bg-green-100 p-4 text-green-700">
                    <Flame size={34} />
                  </div>
                </div>

                <div className="mt-8 h-5 overflow-hidden rounded-full bg-neutral-100">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{
                      width: `${Math.min(event?.coverage_score || 0, 100)}%`,
                    }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1 }}
                    className="h-full rounded-full bg-green-700"
                  />
                </div>

                <div className="mt-8 rounded-2xl bg-neutral-950 p-5 text-white">
                  <p className="text-sm font-black text-green-400">
                    Lecture dajee-bi
                  </p>

                  <p className="mt-3 text-sm leading-7 text-white/70">
                    Plus un événement est repris par plusieurs chaînes, plus son
                    impact médiatique est fort. dajee-bi mesure donc les vues,
                    mais aussi la couverture réelle par les médias suivis.
                  </p>
                </div>

                <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-700 px-5 py-3 text-sm font-black text-white transition hover:bg-green-800">
                  Voir l’analyse
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}