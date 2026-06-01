"use client";

import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Eye, Heart, MessageCircle, Radio, TrendingUp } from "lucide-react";

const liveData = [
  { time: "18h00", viewers: 4200, likes: 900, comments: 240 },
  { time: "18h15", viewers: 8700, likes: 1600, comments: 480 },
  { time: "18h30", viewers: 15200, likes: 2500, comments: 900 },
  { time: "18h45", viewers: 23600, likes: 3900, comments: 1500 },
  { time: "19h00", viewers: 31800, likes: 5200, comments: 2300 },
  { time: "19h15", viewers: 28400, likes: 6100, comments: 2700 },
];

const engagementData = [
  { name: "TFM", value: 88 },
  { name: "Seneweb", value: 81 },
  { name: "Walf", value: 72 },
  { name: "2STV", value: 63 },
  { name: "iTV", value: 55 },
];

export default function LiveAnalyticsSection() {
  return (
    <section className="relative overflow-hidden bg-[#020617] py-24 text-white">
      <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-green-500/15 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-red-500/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <p className="text-sm font-black uppercase tracking-[0.3em] text-green-400">
            📈 Analytics YouTube Live
          </p>

          <h2 className="mt-4 font-heading text-4xl font-black md:text-6xl">
            Viewers, likes et commentaires en direct.
          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/60">
            Une vue claire sur l’évolution des audiences live, les pics
            d’attention et l’engagement généré par chaque chaîne.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-4">
          {[
            { label: "Pic viewers", value: "31.8K", icon: Eye },
            { label: "Likes cumulés", value: "6.1K", icon: Heart },
            { label: "Commentaires", value: "2.7K", icon: MessageCircle },
            { label: "Croissance", value: "+28%", icon: TrendingUp },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur-xl"
            >
              <item.icon className="mb-4 text-green-400" />
              <h3 className="text-4xl font-black">{item.value}</h3>
              <p className="mt-2 text-sm text-white/50">{item.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-[2.5rem] border border-white/10 bg-white/10 p-6 backdrop-blur-xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50">Évolution live</p>
                <h3 className="text-2xl font-black">Audience minute par minute</h3>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-black">
                <Radio size={15} />
                LIVE
              </div>
            </div>

            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={liveData}>
                  <defs>
                    <linearGradient id="viewers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="likes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.35)" />
                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="viewers"
                    stroke="#22c55e"
                    strokeWidth={4}
                    fill="url(#viewers)"
                  />

                  <Area
                    type="monotone"
                    dataKey="likes"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    fill="url(#likes)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-[2.5rem] border border-white/10 bg-white/10 p-6 backdrop-blur-xl"
          >
            <p className="text-sm text-white/50">Comparaison médias</p>
            <h3 className="mb-6 text-2xl font-black">Score d’engagement</h3>

            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.35)" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#22c55e" radius={[14, 14, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}