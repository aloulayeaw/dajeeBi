"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Flame,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";

import { fetchMediaChannels } from "@/lib/api";

type Channel = {
  id: string;
  name: string;
  description: string;
  thumbnail_url: string;
  logo_url: string;
  subscribers: number;
  buzz_score: number;
  growth_score: number;
  influence_score: number;
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

export default function BuzzChannels() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChannels() {
      try {
        const data = await fetchMediaChannels();
        setChannels(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadChannels();
  }, []);

  const topBuzz = useMemo(() => {
    return [...channels]
      .sort((a, b) => b.buzz_score - a.buzz_score)
      .slice(0, 8);
  }, [channels]);

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-12">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-red-600">
            Top buzz
          </p>

          <h2 className="mt-4 text-4xl font-black text-neutral-950 md:text-6xl">
            Les chaînes qui dominent actuellement.
          </h2>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-[380px] animate-pulse rounded-[2rem] bg-neutral-100"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {topBuzz.map((channel, index) => (
              <motion.div
                key={channel.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                transition={{ delay: index * 0.05 }}
                className="group overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-2xl shadow-black/5"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={channel.thumbnail_url || channel.logo_url}
                    alt={channel.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  <div className="absolute left-4 top-4 rounded-full bg-red-600 px-4 py-2 text-sm font-black text-white">
                    🔥 #{index + 1}
                  </div>

                  <div className="absolute bottom-5 left-5 right-5">
                    <h3 className="line-clamp-2 text-2xl font-black text-white">
                      {channel.name}
                    </h3>
                  </div>
                </div>

                <div className="p-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-red-50 p-4">
                      <Flame className="mb-2 text-red-600" size={18} />

                      <p className="text-xs text-neutral-500">
                        Buzz Score
                      </p>

                      <p className="text-2xl font-black text-red-600">
                        {Math.round(channel.buzz_score)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-green-50 p-4">
                      <TrendingUp
                        className="mb-2 text-green-700"
                        size={18}
                      />

                      <p className="text-xs text-neutral-500">
                        Growth
                      </p>

                      <p className="text-2xl font-black text-green-700">
                        {Math.round(channel.growth_score)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-neutral-100 p-4">
                    <div className="flex items-center gap-3">
                      <Users size={18} />

                      <div>
                        <p className="text-xs text-neutral-500">
                          Abonnés
                        </p>

                        <p className="font-black">
                          {formatNumber(channel.subscribers)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {channel.buzz_score >= 70 && (
                      <div className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
                        🔥 Viral
                      </div>
                    )}

                    {channel.growth_score >= 50 && (
                      <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
                        📈 Croissance
                      </div>
                    )}

                    {channel.influence_score >= 70 && (
                      <div className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-yellow-700">
                        ⭐ Influence
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/channels/${channel.id}`}
                    className="mt-5 flex items-center justify-between rounded-2xl bg-neutral-950 p-4 text-white transition hover:bg-red-600"
                  >
                    <div className="flex items-center gap-3">
                      <Trophy className="text-yellow-400" />

                      <div>
                        <p className="text-xs text-white/50">
                          Analytics
                        </p>

                        <p className="font-black">
                          Voir le média
                        </p>
                      </div>
                    </div>

                    <ArrowUpRight />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}