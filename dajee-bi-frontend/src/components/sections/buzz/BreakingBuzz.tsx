"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Flame, Radio, TrendingUp, Zap } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

type BuzzAlert = {
  id: number;
  channel_id: string | null;
  channel_name: string;
  alert_type: string;
  title: string;
  message: string;
  severity: string;
  score: number;
  created_at: string;
};

function getIcon(type: string) {
  if (type === "viral_live") return Radio;
  if (type === "subscriber_growth") return TrendingUp;
  if (type === "views_growth") return Flame;
  if (type === "chat_explosion") return Zap;
  return AlertTriangle;
}

export default function BreakingBuzz() {
  const [alerts, setAlerts] = useState<BuzzAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/youtube/buzz-alerts/`);
        const data = await res.json();
        setAlerts(data);
      } catch (error) {
        console.error("Erreur buzz alerts:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAlerts();
  }, []);

  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-red-400/20 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-yellow-300/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-12">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-red-600">
            Breaking Buzz
          </p>

          <h2 className="mt-4 text-4xl font-black text-neutral-950 md:text-6xl">
            Alertes détectées.
          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-600">
            dajee-bi surveille les signaux forts : croissance anormale, live
            viral, vues explosives et activité chat intense.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-44 animate-pulse rounded-[2rem] bg-neutral-100"
              />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="rounded-[2rem] border border-black/5 bg-neutral-50 p-10 text-center">
            <AlertTriangle className="mx-auto mb-4 text-yellow-600" size={42} />
            <h3 className="text-2xl font-black">Aucune alerte buzz pour le moment</h3>
            <p className="mt-3 text-neutral-600">
              Lance la recherche après tes synchronisations.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {alerts.map((alert, index) => {
              const Icon = getIcon(alert.alert_type);

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-xl shadow-black/5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                        <Icon size={26} />
                      </div>

                      <div>
                        <p className="text-sm font-black uppercase tracking-[0.2em] text-red-600">
                          {alert.channel_name}
                        </p>

                        <h3 className="mt-2 text-2xl font-black text-neutral-950">
                          {alert.title}
                        </h3>

                        <p className="mt-3 leading-7 text-neutral-600">
                          {alert.message}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-black text-white">
                      {Math.round(alert.score)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}