"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, Radio } from "lucide-react";

const channels = [
  {
    name: "TFM Live",
    viewers: "23.5K",
    image: "/images/channel/xaalat.jpg",
  },
  {
    name: "Seneweb TV",
    viewers: "18.6K",
    image: "/images/channel/xaalat.jpg",
  },
  {
    name: "Walf TV",
    viewers: "14.2K",
    image: "/images/channel/xaalat.jpg",
  },
  {
    name: "2STV",
    viewers: "9.8K",
    image: "/images/channel/xaalat.jpg",
  },
  {
    name: "iTV Sénégal",
    viewers: "7.2K",
    image: "/images/channel/xaalat.jpg",
  },
  {
    name: "Xalaat TV",
    viewers: "6.4K",
    image: "/images/channel/xaalat.jpg",
  },
];

export default function LiveChannelsGrid() {
  return (
    <section className="relative overflow-hidden bg-[#020617] py-24 text-white">
      <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-red-500/10 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-red-400">
              🔴 Lives en cours
            </p>

            <h2 className="mt-4 font-heading text-4xl font-black md:text-6xl">
              Les Web TV les plus suivies maintenant.
            </h2>
          </div>

          <div className="rounded-full border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-black text-red-400">
            Mise à jour en temps réel
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {channels.map((channel, index) => (
            <motion.div
              key={channel.name}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
              whileHover={{
                y: -10,
                scale: 1.02,
              }}
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={channel.image}
                  alt={channel.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                  className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-black"
                >
                  <Radio size={14} />
                  LIVE
                </motion.div>

                <div className="absolute bottom-5 left-5 right-5">
                  <h3 className="text-3xl font-black">
                    {channel.name}
                  </h3>

                  <div className="mt-3 flex items-center gap-2 text-white/80">
                    <Eye size={18} />
                    <span className="font-semibold">
                      {channel.viewers} viewers
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-white/40">
                    Engagement
                  </p>

                  <h4 className="text-2xl font-black text-green-400">
                    +{18 + index}%
                  </h4>
                </div>

                <button className="rounded-full bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-green-400">
                  Voir le live
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}