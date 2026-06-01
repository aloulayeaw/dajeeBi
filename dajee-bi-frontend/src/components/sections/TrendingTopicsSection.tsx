"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Eye,
  Flame,
  Hash,
  Video,
} from "lucide-react";

type Trend = {
  keyword: string;
  videos: number;
  views: number;
};

function formatNumber(value: number) {
  const num = Number(value || 0);

  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;

  return new Intl.NumberFormat("fr-FR").format(num);
}

function getGrowth(index: number) {
  const values = ["+156%", "+92%", "+73%", "+58%", "+44%", "+31%"];
  return values[index] || "+18%";
}

function getColor(index: number) {
  const colors = [
    "from-green-500 to-emerald-700",
    "from-yellow-400 to-orange-500",
    "from-red-500 to-pink-600",
    "from-cyan-500 to-blue-600",
    "from-lime-400 to-green-700",
    "from-purple-500 to-fuchsia-600",
  ];

  return colors[index % colors.length];
}

export default function TrendingTopicsSection({
  trends = [],
}: {
  trends?: Trend[];
}) {
  return (
    <section className="relative overflow-hidden bg-[#020617] py-24">
      <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-green-500/10 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-yellow-500/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-black uppercase tracking-[0.3em] text-green-400">
            🔥 Tendances Sénégal
          </p>

          <h2 className="mt-5 text-4xl font-black text-white md:text-6xl">
            Les sujets qui font vibrer le pays.
          </h2>

          <p className="mt-6 text-lg leading-8 text-neutral-400">
            Suivez les sujets qui dominent actuellement les vidéos,
            médias et conversations suivies par dajee-bi.
          </p>
        </motion.div>

        {trends.length === 0 ? (
          <div className="mt-16 rounded-[2rem] border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
              <Flame className="text-green-400" size={34} />
            </div>

            <h3 className="mt-6 text-3xl font-black text-white">
              Aucune tendance détectée
            </h3>

            <p className="mx-auto mt-4 max-w-xl text-neutral-400">
              Les tendances apparaîtront ici dès que les scripts de collecte
              auront détecté des vidéos et mots-clés récents.
            </p>
          </div>
        ) : (
          <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {trends.map((topic, index) => (
              <motion.div
                key={`${topic.keyword}-${index}`}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-7 backdrop-blur-xl"
              >
                <div
                  className={`absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-r ${getColor(
                    index
                  )} opacity-20 blur-3xl`}
                />

                <div className="relative z-10">
                  <div className="mb-5 inline-flex rounded-2xl bg-white/10 p-4">
                    <Hash className="text-yellow-400" size={28} />
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="line-clamp-2 text-3xl font-black text-white">
                        {topic.keyword}
                      </h3>

                      <p className="mt-2 text-neutral-400">
                        {formatNumber(topic.views)} vues détectées
                      </p>
                    </div>

                    <div className="rounded-full bg-green-500/15 px-3 py-2 text-sm font-black text-green-400">
                      {getGrowth(index)}
                    </div>
                  </div>

                  <div className="mt-7 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/10 p-4">
                      <Eye className="mb-2 text-green-400" size={18} />
                      <p className="text-xs text-white/40">Vues</p>
                      <p className="text-xl font-black text-white">
                        {formatNumber(topic.views)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-4">
                      <Video className="mb-2 text-red-400" size={18} />
                      <p className="text-xs text-white/40">Vidéos</p>
                      <p className="text-xl font-black text-white">
                        {formatNumber(topic.videos)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                      <Activity size={16} />
                      Trending maintenant
                    </div>

                    <button className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-black transition hover:bg-green-400">
                      Voir
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}