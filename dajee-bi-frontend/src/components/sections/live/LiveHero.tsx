"use client";

import { motion } from "framer-motion";
import { Radio, Eye, PlayCircle, TrendingUp, Users } from "lucide-react"; 

const kpis = [
  { label: "Lives actifs", value: "37", icon: Radio },
  { label: "Viewers cumulés", value: "284K", icon: Eye },
  { label: "Chaînes suivies", value: "52", icon: PlayCircle },
  { label: "Croissance live", value: "+28%", icon: TrendingUp },
];

export default function LiveHero() {
  return (
    <section className="relative overflow-hidden bg-[#020617] px-5 py-24 text-white md:px-8">
      <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-green-500/20 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl"
        >
          <p className="inline-flex rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-black uppercase tracking-[0.25em] text-green-400">
            🔴 Monitoring YouTube Live
          </p>

          <h1 className="mt-8 font-heading text-5xl font-black leading-tight md:text-7xl">
            Suivez les Web TV sénégalaises en{" "}
            <span className="text-green-400">temps réel</span>.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
            Retrouvez les lives actifs, les audiences, les chaînes les plus
            suivies, les pics d’audience et les performances YouTube des médias
            sénégalais.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 md:grid-cols-4">
          {kpis.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur-xl"
            >
              <item.icon className="mb-4 text-green-400" />
              <h3 className="text-4xl font-black">{item.value}</h3>
              <p className="mt-2 text-sm text-white/50">{item.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 rounded-[2.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-sm text-white/50">Signal actuel</p>
              <h2 className="text-3xl font-black">
                Les médias live les plus suivis maintenant
              </h2>
            </div>

            <div className="flex items-center gap-3 rounded-full bg-red-500 px-5 py-3 text-sm font-black">
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
              LIVE DATA
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {["TFM Live", "Seneweb TV", "Walf TV"].map((name, index) => (
              <motion.div
                key={name}
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 3 + index,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="rounded-3xl bg-black/30 p-5"
              >
                <div className="mb-4 flex items-center gap-2 text-red-400">
                  <Radio size={18} />
                  <span className="text-xs font-black">EN DIRECT</span>
                </div>

                <h3 className="text-2xl font-black">{name}</h3>

                <div className="mt-4 flex items-center gap-2 text-white/60">
                  <Users size={18} />
                  {index === 0 ? "23.5K" : index === 1 ? "18.6K" : "14.2K"} viewers
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}