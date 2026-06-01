"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Activity, MapPin, Radio, TrendingUp, ShieldCheck } from "lucide-react";

const stats = [
  { label: "Régions suivies", value: "14", icon: MapPin },
  { label: "Web TV monitorées", value: "37", icon: Radio },
  { label: "Tendances en cours", value: "128", icon: TrendingUp },
];

export default function SenegalMapSection() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="absolute left-0 top-20 h-80 w-80 rounded-full bg-green-400/20 blur-3xl" />
      <div className="absolute right-0 bottom-10 h-96 w-96 rounded-full bg-yellow-400/25 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[0.85fr_1.15fr]">
        <motion.div
          initial={{ opacity: 0, x: -35 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-black uppercase tracking-[0.3em] text-green-700">
            🇸🇳 Sénégal connecté
          </p>

          <h2 className="mt-4 font-heading text-4xl font-black leading-tight text-neutral-950 md:text-6xl">
            Le Sénégal en{" "}
            <span className="text-green-700">temps réel</span>, partout, tout le
            temps.
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-600">
            dajee-bi collecte, analyse et visualise les données des médias, des
            réseaux sociaux et des tendances dans tout le pays.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {stats.map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ y: -8 }}
                className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl shadow-black/5"
              >
                <item.icon className="mb-3 text-green-700" />
                <h3 className="text-4xl font-black">{item.value}</h3>
                <p className="mt-1 text-sm text-neutral-500">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[3rem] bg-neutral-950 shadow-2xl shadow-black/20"
        >
          <Image
            src="/images/maps/senegal-network.png"
            alt="Carte connectée du Sénégal"
            width={1200}
            height={800}
            className="h-[620px] w-full object-cover"
          />

          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute left-[30%] top-[35%] h-6 w-6 rounded-full bg-yellow-400 shadow-[0_0_45px_rgba(250,204,21,1)]"
          />

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute left-8 top-8 rounded-3xl border border-white/10 bg-black/70 p-5 text-white backdrop-blur-xl"
          >
            <Activity className="mb-3 text-green-400" />
            <p className="text-sm text-white/60">Flux en temps réel</p>
            <h3 className="text-3xl font-black text-green-400">+42%</h3>
          </motion.div>

          <motion.div
            animate={{ x: [0, 15, 0] }}
            transition={{ duration: 4.5, repeat: Infinity }}
            className="absolute bottom-8 right-8 rounded-3xl border border-white/10 bg-black/70 p-5 text-white backdrop-blur-xl"
          >
            <ShieldCheck className="mb-3 text-green-400" />
            <p className="text-sm text-white/60">Données locales</p>
            <h3 className="text-xl font-black">100% Sénégal</h3>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}