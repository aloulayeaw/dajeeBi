"use client";

import { motion } from "framer-motion";
import { Activity, Bell, Flame, Radio, TrendingUp } from "lucide-react";

const events = [
  {
    time: "19:00",
    title: "Pic viewers détecté",
    text: "TFM Live atteint 31.8K viewers simultanés.",
    icon: TrendingUp,
    color: "text-green-400",
  },
  {
    time: "19:08",
    title: "Seneweb TV monte fortement",
    text: "La chaîne dépasse 18K viewers avec une croissance de +22%.",
    icon: Radio,
    color: "text-red-400",
  },
  {
    time: "19:15",
    title: "Commentaires en hausse",
    text: "Forte activité dans le chat live : +2.7K commentaires.",
    icon: Activity,
    color: "text-yellow-400",
  },
  {
    time: "19:22",
    title: "Sujet tendance",
    text: "#DebatPolitique devient un sujet chaud au Sénégal.",
    icon: Flame,
    color: "text-orange-400",
  },
];

export default function LiveTimelineSection() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-14">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-green-700">
            Timeline live
          </p>

          <h2 className="mt-4 font-heading text-4xl font-black text-neutral-950 md:text-6xl">
            Ce qui se passe en direct.
          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-600">
            Suivez les événements importants détectés automatiquement pendant les
            lives YouTube des médias sénégalais.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-[2.5rem] bg-neutral-950 p-8 text-white shadow-2xl shadow-black/20"
          >
            <Bell className="mb-5 text-green-400" size={42} />

            <h3 className="text-3xl font-black">
              Alertes intelligentes live
            </h3>

            <p className="mt-5 leading-8 text-white/60">
              dajee-bi met en avant les pics d’audience, les tendances fortes,
              les hausses de commentaires et les signaux importants.
            </p>

            <div className="mt-8 rounded-3xl border border-green-500/20 bg-green-500/10 p-5">
              <p className="text-sm font-bold text-green-400">
                Mise à jour automatique
              </p>
              <p className="mt-2 text-sm text-white/60">
                Les événements seront alimentés par YouTube API
              </p>
            </div>
          </motion.div>

          <div className="relative rounded-[2.5rem] border border-black/5 bg-neutral-50 p-6 shadow-xl shadow-black/5">
            <div className="absolute left-10 top-10 h-[calc(100%-80px)] w-1 rounded-full bg-gradient-to-b from-green-600 via-yellow-400 to-red-500" />

            <div className="space-y-6">
              {events.map((event, index) => (
                <motion.div
                  key={event.time}
                  initial={{ opacity: 0, x: 35 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 8 }}
                  className="relative ml-12 rounded-3xl bg-white p-6 shadow-lg shadow-black/5"
                >
                  <div className="absolute -left-[54px] top-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-lg">
                    <event.icon className={event.color} />
                  </div>

                  <div className="mb-2 flex items-center justify-between gap-4">
                    <h3 className="text-xl font-black text-neutral-950">
                      {event.title}
                    </h3>

                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-black text-neutral-600">
                      {event.time}
                    </span>
                  </div>

                  <p className="leading-7 text-neutral-600">{event.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}