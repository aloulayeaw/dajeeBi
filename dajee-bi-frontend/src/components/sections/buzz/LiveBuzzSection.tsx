"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  MessageCircle,
  Radio,
  Users,
} from "lucide-react";

import { fetchLiveStreams } from "@/lib/api";

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
  chat_activity_score: number;
  messages_per_minute: number;
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

export default function LiveBuzzSection() {
  const [lives, setLives] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLives() {
      try {
        const data = await fetchLiveStreams();
        setLives(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadLives();
  }, []);

  const topLives = useMemo(() => {
    return [...lives]
      .sort(
        (a, b) =>
          b.chat_activity_score - a.chat_activity_score
      )
      .slice(0, 6);
  }, [lives]);

  return (
    <section className="bg-[#f8fafc] py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-12">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-red-600">
            Lives explosifs
          </p>

          <h2 className="mt-4 text-4xl font-black text-neutral-950 md:text-6xl">
            Les directs les plus actifs.
          </h2>
        </div>

        {loading ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-[300px] animate-pulse rounded-[2rem] bg-white"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {topLives.map((live, index) => (
              <motion.a
                key={live.id}
                href={live.live_url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                transition={{ delay: index * 0.05 }}
                className="group overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-2xl shadow-black/5"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={live.thumbnail}
                    alt={live.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-black text-white">
                    <Radio size={16} />
                    LIVE
                  </div>

                  <div className="absolute right-4 top-4 rounded-full bg-black/70 px-4 py-2 text-sm font-black text-white backdrop-blur-xl">
                    🔥 {Math.round(live.chat_activity_score)}
                  </div>

                  <div className="absolute bottom-5 left-5 right-5">
                    <h3 className="line-clamp-2 text-3xl font-black text-white">
                      {live.title}
                    </h3>

                    <p className="mt-3 text-sm font-bold text-white/70">
                      {live.channel_name}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 p-5">
                  <div className="rounded-2xl bg-red-50 p-4">
                    <Users
                      className="mb-2 text-red-600"
                      size={18}
                    />

                    <p className="text-xs text-neutral-500">
                      Viewers
                    </p>

                    <p className="font-black text-red-600">
                      {formatNumber(live.viewers)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-green-50 p-4">
                    <Flame
                      className="mb-2 text-green-700"
                      size={18}
                    />

                    <p className="text-xs text-neutral-500">
                      Likes
                    </p>

                    <p className="font-black text-green-700">
                      {formatNumber(live.likes)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-yellow-50 p-4">
                    <MessageCircle
                      className="mb-2 text-yellow-700"
                      size={18}
                    />

                    <p className="text-xs text-neutral-500">
                      Chat
                    </p>

                    <p className="font-black text-yellow-700">
                      {formatNumber(live.comments)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-neutral-100 p-4">
                    <Radio
                      className="mb-2 text-neutral-950"
                      size={18}
                    />

                    <p className="text-xs text-neutral-500">
                      Msg/min
                    </p>

                    <p className="font-black">
                      {Math.round(
                        live.messages_per_minute
                      )}
                    </p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}