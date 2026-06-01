"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Heart, MessageCircle, Radio, ArrowUpRight } from "lucide-react";
import { fetchLiveStreams } from "@/lib/liveApi";

type LiveStream = {
  id: string;
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

function formatNumber(value: number) {
  return new Intl.NumberFormat("fr-FR").format(Number(value || 0));
}

export default function LiveStreamsGrid() {
  const [lives, setLives] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLives() {
      try {
        const data = await fetchLiveStreams();
        setLives(data);
      } catch (error) {
        console.error("Erreur lives:", error);
      } finally {
        setLoading(false);
      }
    }

    loadLives();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#020617] py-24 text-white">
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-red-500/15 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-green-500/15 blur-3xl" />

      <div className="mx-auto max-w-[1500px] px-5 md:px-8">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-red-400">
              🔴 Lives réels
            </p>

            <h2 className="mt-4 font-heading text-4xl font-black md:text-6xl">
              Les directs actifs maintenant.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/60">
              Les lives détectés depuis les chaînes enregistrées dans dajee-bi
            </p>
          </div>

          <div className="rounded-full bg-red-600 px-5 py-3 text-sm font-black">
            LIVE DATA
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-[420px] animate-pulse rounded-[2rem] bg-white/10"
              />
            ))}
          </div>
        ) : lives.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-10 text-center">
            <Radio className="mx-auto mb-4 text-red-400" size={40} />
            <h3 className="text-2xl font-black">Aucun live actif détecté</h3>
            <p className="mt-3 text-white/60">
              Relance le script ou attends qu’une chaîne démarre un direct.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {lives.map((live, index) => (
              <motion.div
                key={live.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 shadow-2xl shadow-black/20 backdrop-blur-xl"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={live.thumbnail || live.channel_logo}
                    alt={live.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-black">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                    LIVE
                  </div>

                  <div className="absolute right-4 top-4 rounded-full bg-black/60 px-4 py-2 text-xs font-black backdrop-blur">
                    #{index + 1}
                  </div>

                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-sm font-bold text-green-400">
                      {live.channel_name}
                    </p>
                    <h3 className="mt-1 line-clamp-2 text-xl font-black">
                      {live.title}
                    </h3>
                  </div>
                </div>

                <div className="p-5">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-green-500/10 p-3">
                      <Eye className="mb-2 text-green-400" size={18} />
                      <p className="text-[11px] text-white/50">Viewers</p>
                      <p className="font-black">
                        {formatNumber(live.viewers)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-red-500/10 p-3">
                      <Heart className="mb-2 text-red-400" size={18} />
                      <p className="text-[11px] text-white/50">Likes</p>
                      <p className="font-black">{formatNumber(live.likes)}</p>
                    </div>

                    <div className="rounded-2xl bg-yellow-500/10 p-3">
                      <MessageCircle
                        className="mb-2 text-yellow-400"
                        size={18}
                      />
                      <p className="text-[11px] text-white/50">Comments</p>
                      <p className="font-black">
                        {formatNumber(live.comments)}
                      </p>
                    </div>
                  </div>

                  <a
                    href={live.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 flex items-center justify-between rounded-2xl bg-black/30 p-4 transition hover:bg-red-600/20"
                  >
                    <div className="flex items-center gap-3">
                      <Radio className="text-red-400" />
                      <div>
                        <p className="text-xs text-white/40">Voir maintenant</p>
                        <p className="font-black text-red-400">YouTube Live</p>
                      </div>
                    </div>

                    <ArrowUpRight className="text-green-400" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}