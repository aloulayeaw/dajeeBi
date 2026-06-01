"use client";

import { motion } from "framer-motion";
import { Award, Eye, PlayCircle, TrendingUp, Users } from "lucide-react";

const rankings = [
  {
    rank: 1,
    name: "Seneweb TV",
    subscribers: "1.8M",
    views: "420M",
    growth: "+24%",
  },
  {
    rank: 2,
    name: "TFM Live",
    subscribers: "1.2M",
    views: "380M",
    growth: "+19%",
  },
  {
    rank: 3,
    name: "Walf TV",
    subscribers: "950K",
    views: "290M",
    growth: "+16%",
  },
  {
    rank: 4,
    name: "2STV",
    subscribers: "720K",
    views: "210M",
    growth: "+12%",
  },
  {
    rank: 5,
    name: "iTV Sénégal",
    subscribers: "540K",
    views: "180M",
    growth: "+9%",
  },
];

export default function TopChannelsRanking() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-12">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-green-700">
            Classement YouTube
          </p>

          <h2 className="mt-4 font-heading text-4xl font-black text-neutral-950 md:text-6xl">
            Les chaînes les plus puissantes.
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-[2.5rem] border border-black/5 bg-white p-6 shadow-2xl shadow-black/5">
            <div className="grid gap-4">
              {rankings.map((channel, index) => (
                <motion.div
                  key={channel.name}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 8 }}
                  className="grid items-center gap-4 rounded-3xl border border-black/5 bg-neutral-50 p-5 md:grid-cols-[60px_1fr_120px_120px_100px]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-700 text-xl font-black text-white">
                    {channel.rank}
                  </div>

                  <div>
                    <h3 className="text-xl font-black">{channel.name}</h3>
                    <p className="text-sm text-neutral-500">
                      Chaîne TV / Web TV sénégalaise
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-neutral-400">Abonnés</p>
                    <p className="font-black">{channel.subscribers}</p>
                  </div>

                  <div>
                    <p className="text-xs text-neutral-400">Vues</p>
                    <p className="font-black">{channel.views}</p>
                  </div>

                  <div className="font-black text-green-700">
                    {channel.growth}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-neutral-950 p-7 text-white shadow-2xl shadow-black/20">
            <Award className="mb-5 text-yellow-400" size={42} />

            <h3 className="text-3xl font-black">
              Classement basé sur la puissance digitale.
            </h3>

            <p className="mt-5 leading-8 text-white/60">
              Le score combine abonnés, vues totales, activité live, engagement,
              croissance récente et régularité de publication.
            </p>

            <div className="mt-8 grid gap-4">
              {[
                { label: "Abonnés", icon: Users },
                { label: "Vues totales", icon: Eye },
                { label: "Lives actifs", icon: PlayCircle },
                { label: "Croissance", icon: TrendingUp },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-4 rounded-2xl bg-white/10 p-4"
                >
                  <item.icon className="text-green-400" />
                  <span className="font-bold">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}