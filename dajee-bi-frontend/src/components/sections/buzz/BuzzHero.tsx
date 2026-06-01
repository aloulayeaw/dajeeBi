"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Flame,
  Radio,
  TrendingUp,
  Zap,
} from "lucide-react";

export default function BuzzHero() {
  return (
    <section className="relative overflow-hidden bg-[#f8fafc] py-24">
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-red-400/20 blur-3xl" />

      <div className="absolute right-0 top-20 h-[28rem] w-[28rem] rounded-full bg-yellow-300/20 blur-3xl" />

      <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-green-400/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm font-black uppercase tracking-[0.3em] text-red-600">
            Buzz Sénégal
          </p>

          <h1 className="mt-5 max-w-5xl font-heading text-5xl font-black leading-tight text-neutral-950 md:text-7xl">
            Les médias, lives et chaînes qui{" "}
            <span className="text-red-600">
              explosent actuellement.
            </span>
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-8 text-neutral-600">
            dajee-bi détecte automatiquement les chaînes qui
            montent, les lives explosifs et les tendances
            digitales au Sénégal.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/live"
              className="rounded-full bg-red-600 px-7 py-4 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-red-700"
            >
              Voir les lives
            </Link>

            <Link
              href="/channels"
              className="rounded-full border border-black/10 bg-white px-7 py-4 text-sm font-black text-neutral-950 transition hover:bg-neutral-100"
            >
              Explorer les médias
            </Link>
          </div>
        </motion.div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Buzz Youtube",
              text: "Détection automatique des tendances.",
              icon: Flame,
              color: "bg-red-50 text-red-600",
            },
            {
              title: "Croissance",
              text: "Chaînes qui montent rapidement.",
              icon: TrendingUp,
              color: "bg-green-50 text-green-700",
            },
            {
              title: "Lives",
              text: "Lives explosifs en temps réel.",
              icon: Radio,
              color: "bg-yellow-50 text-yellow-700",
            },
            {
              title: "Temps réel",
              text: "Monitoring continu des médias.",
              icon: Zap,
              color: "bg-neutral-100 text-neutral-950",
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-xl shadow-black/5"
            >
              <div
                className={`inline-flex rounded-2xl p-4 ${item.color}`}
              >
                <item.icon size={28} />
              </div>

              <h3 className="mt-5 text-2xl font-black text-neutral-950">
                {item.title}
              </h3>

              <p className="mt-3 leading-7 text-neutral-600">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}