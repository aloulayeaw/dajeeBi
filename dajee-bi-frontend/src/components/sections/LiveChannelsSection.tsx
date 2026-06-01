"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Eye,
  Radio,
  ArrowUpRight,
  MessageCircle,
  Heart,
} from "lucide-react";

type LiveStream = {
  title: string;
  channel_name: string;
  thumbnail_url: string;
  live_url: string;
  viewers: number;
  likes: number;
  comments: number;
};

function formatNumber(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }

  return value.toString();
}

export default function LiveChannelsSection({
  lives = [],
}: {
  lives?: LiveStream[];
}) {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-green-400/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
        >
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-green-700">
              🔴 Live monitoring
            </p>

            <h2 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-neutral-950 md:text-6xl">
              Les Web TV suivies en temps réel.
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-neutral-600">
              dajee-bi détecte automatiquement les lives les plus suivis
              des médias sénégalais et africains.
            </p>
          </div>

          <button className="rounded-full bg-neutral-950 px-6 py-4 font-bold text-white transition hover:bg-green-700">
            Voir tous les lives
          </button>
        </motion.div>

        <div className="mt-16 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {lives.map((live, index) => (
            <motion.div
              key={`${live.channel_name}-${index}`}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                delay: index * 0.08,
              }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-2xl shadow-black/5"
            >
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={
                    live.thumbnail_url ||
                    "/images/channel/xaalat.jpg"
                  }
                  alt={live.channel_name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white shadow-lg">
                  <Radio size={12} />
                  EN DIRECT
                </div>

                <div className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-2 text-xs font-bold text-white backdrop-blur-xl">
                  {formatNumber(live.viewers)} viewers
                </div>

                <div className="absolute bottom-5 left-5 right-5">
                  <p className="mb-2 text-sm font-bold text-green-400">
                    {live.channel_name}
                  </p>

                  <h3 className="line-clamp-2 text-2xl font-black leading-tight text-white">
                    {live.title}
                  </h3>

                  <div className="mt-4 flex items-center gap-5 text-sm text-white/80">
                    <div className="flex items-center gap-2">
                      <Eye size={15} />
                      {formatNumber(live.viewers)}
                    </div>

                    <div className="flex items-center gap-2">
                      <Heart size={15} />
                      {formatNumber(live.likes)}
                    </div>

                    <div className="flex items-center gap-2">
                      <MessageCircle size={15} />
                      {formatNumber(live.comments)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-neutral-500">
                    Activité détectée
                  </p>

                  <h4 className="text-2xl font-black text-green-700">
                    Forte audience
                  </h4>
                </div>

                <a
                  href={live.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700"
                >
                  Regarder
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {lives.length === 0 && (
          <div className="mt-16 rounded-[2rem] border border-black/5 bg-neutral-50 p-14 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <Radio className="text-red-600" size={34} />
            </div>

            <h3 className="mt-6 text-3xl font-black text-neutral-950">
              Aucun live détecté
            </h3>

            <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-neutral-600">
              dajee-bi n’a détecté aucun live actif pour le moment.
              Les lives médias apparaîtront automatiquement ici.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}