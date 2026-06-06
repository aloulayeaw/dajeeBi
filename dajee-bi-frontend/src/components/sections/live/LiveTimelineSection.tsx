"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Bell,
  Flame,
  Radio,
  TrendingUp,
  AlertTriangle,
  Loader2,
  Eye,
  Clock,
  Signal,
  Medal,
  Sparkles,
} from "lucide-react";

import { fetchLiveReportDashboard } from "@/lib/liveApi";

type LiveEvent = {
  live_id: string;
  channel_name: string;
  event_type: string;
  event_title: string;
  event_description: string;
  value: number;
  previous_value: number;
  growth_percent: number;
  detected_at: string;
};

type ActiveLive = {
  live_id: string;
  channel_name: string;
  title: string;
  current_viewers: number;
  peak_viewers: number;
  likes: number;
  comments: number;
  live_url: string;
};

type LiveReport = {
  live_id: string;
  channel_name: string;
  title: string;
  peak_viewers: number;
  avg_viewers: number;
  total_comments: number;
  total_likes: number;
  ended_at?: string | null;
  last_seen_at?: string | null;
};

type LiveDashboard = {
  active_lives: ActiveLive[];
  ended_reports: LiveReport[];
  events: LiveEvent[];
};

type TimelineItem = {
  id: string;
  time: string;
  title: string;
  text: string;
  channel: string;
  value: number;
  growth: number;
  icon: React.ElementType;
  color: string;
  badge: string;
  date: string;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    notation: Number(value || 0) >= 10000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(Number(value || 0));
}

function formatTime(value?: string | null) {
  if (!value) return "--:--";

  try {
    return new Date(value).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "--:--";
  }
}

function getIcon(eventType?: string) {
  const type = eventType?.toLowerCase() || "";

  if (type.includes("peak") || type.includes("pic")) return TrendingUp;
  if (type.includes("comment")) return Activity;
  if (type.includes("trend") || type.includes("hot")) return Flame;
  if (type.includes("live")) return Radio;

  return AlertTriangle;
}

function getIconColor(eventType?: string) {
  const type = eventType?.toLowerCase() || "";

  if (type.includes("peak") || type.includes("pic")) return "text-emerald-600";
  if (type.includes("comment")) return "text-yellow-600";
  if (type.includes("trend") || type.includes("hot")) return "text-orange-600";
  if (type.includes("live")) return "text-red-600";

  return "text-cyan-600";
}

export default function LiveTimelineSection() {
  const [dashboard, setDashboard] = useState<LiveDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTimeline() {
      try {
        const data = await fetchLiveReportDashboard();
        setDashboard(data);
      } catch (error) {
        console.error("Erreur timeline live:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTimeline();

    const interval = setInterval(loadTimeline, 60000);
    return () => clearInterval(interval);
  }, []);

  const activeLives = dashboard?.active_lives || [];
  const endedReports = dashboard?.ended_reports || [];
  const apiEvents = dashboard?.events || [];

  const realEvents = useMemo<TimelineItem[]>(() => {
    const detectedEvents = apiEvents.map((event) => {
      const Icon = getIcon(event.event_type);

      return {
        id: `${event.live_id}-${event.detected_at}`,
        time: formatTime(event.detected_at),
        title: event.event_title || "Événement détecté",
        text:
          event.event_description ||
          `${event.channel_name} a généré un signal important.`,
        channel: event.channel_name,
        value: Number(event.value || 0),
        growth: Number(event.growth_percent || 0),
        icon: Icon,
        color: getIconColor(event.event_type),
        badge: "Signal détecté",
        date: event.detected_at,
      };
    });

    const activePeakEvents = activeLives
      .filter((live) => Number(live.peak_viewers || 0) > 0)
      .map((live) => ({
        id: `active-${live.live_id}`,
        time: "Maintenant",
        title: "Pic viewers en cours",
        text: `${live.channel_name} atteint ${formatNumber(
          live.peak_viewers
        )} viewers au pic sur le live actuel.`,
        channel: live.channel_name,
        value: Number(live.peak_viewers || 0),
        growth: 0,
        icon: TrendingUp,
        color: "text-emerald-600",
        badge: "Live actif",
        date: new Date().toISOString(),
      }));

    const endedPeakEvents = endedReports
      .filter((report) => Number(report.peak_viewers || 0) > 0)
      .map((report) => ({
        id: `ended-${report.live_id}`,
        time: formatTime(report.ended_at || report.last_seen_at),
        title: "Bilan live terminé",
        text: `${report.channel_name} a terminé avec un pic de ${formatNumber(
          report.peak_viewers
        )} viewers.`,
        channel: report.channel_name,
        value: Number(report.peak_viewers || 0),
        growth: 0,
        icon: Radio,
        color: "text-red-600",
        badge: "Terminé 48h",
        date: report.ended_at || report.last_seen_at || "",
      }));

    return [...detectedEvents, ...activePeakEvents, ...endedPeakEvents].sort(
      (a, b) =>
        new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
    );
  }, [apiEvents, activeLives, endedReports]);

  const topEvent = realEvents[0];
  const secondEvent = realEvents[1];

  const rankedByViewers = useMemo(() => {
    return [...realEvents].sort((a, b) => b.value - a.value);
  }, [realEvents]);

  const secondViewerChannel = rankedByViewers[1];

  const totalViewers = activeLives.reduce(
    (sum, live) => sum + Number(live.current_viewers || 0),
    0
  );

  return (
    <section className="relative overflow-hidden bg-white py-24 text-neutral-950">
      <div className="pointer-events-none absolute left-0 top-0 h-[520px] w-[520px] rounded-full bg-emerald-300/30 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full bg-red-300/25 blur-[130px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-200/30 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-700">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-600" />
            Timeline live
          </div>

          <h2 className="mt-5 font-heading text-4xl font-black tracking-tight md:text-6xl">
            Ce qui se passe en direct.
          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-600">
            Suivez les alertes YouTube en temps réel avec une interface claire,
            fluide et scrollable même avec beaucoup de lives.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <motion.aside
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
            className="relative overflow-hidden rounded-[2.5rem] border border-neutral-200 bg-white/85 p-7 shadow-2xl shadow-black/10 backdrop-blur-xl lg:sticky lg:top-24 lg:self-start"
          >
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-emerald-300/30 blur-3xl" />

            <div className="relative">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl border border-emerald-200 bg-emerald-50"
              >
                <Bell className="text-emerald-700" size={34} />
              </motion.div>

              <h3 className="text-3xl font-black">
                Alertes intelligentes live
              </h3>

              <p className="mt-5 leading-8 text-neutral-600">
                dajee-bi repère les pics viewers, classe les chaînes et affiche
                les alertes importantes automatiquement.
              </p>

              <div className="mt-8 grid gap-4">
                <StatBox
                  icon={Signal}
                  label="Lives actifs"
                  value={loading ? "--" : String(activeLives.length)}
                  color="emerald"
                />

                <StatBox
                  icon={Eye}
                  label="Viewers actuels"
                  value={loading ? "--" : formatNumber(totalViewers)}
                  color="cyan"
                />

                <StatBox
                  icon={Medal}
                  label="2e chaîne viewers"
                  value={
                    loading
                      ? "--"
                      : secondViewerChannel
                      ? secondViewerChannel.channel
                      : "Non disponible"
                  }
                  subValue={
                    secondViewerChannel
                      ? `${formatNumber(secondViewerChannel.value)} viewers`
                      : undefined
                  }
                  color="yellow"
                />
              </div>

              <div className="mt-6 grid gap-4">
                <AlertPreview
                  title="Dernière alerte"
                  event={topEvent}
                  color="red"
                />

                <AlertPreview
                  title="2e alerte"
                  event={secondEvent}
                  color="emerald"
                />
              </div>
            </div>
          </motion.aside>

          <div className="relative overflow-hidden rounded-[2.5rem] border border-neutral-200 bg-white/90 p-5 shadow-2xl shadow-black/10 backdrop-blur-xl md:p-7">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="text-emerald-600" size={22} />
                  <h3 className="text-2xl font-black">Flux des alertes</h3>
                </div>

                <p className="mt-1 text-sm text-neutral-500">
                  {loading
                    ? "Chargement..."
                    : `${realEvents.length} alertes détectées`}
                </p>
              </div>

              <div className="rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-xs font-black text-neutral-500">
                Scroll interne
              </div>
            </div>

            <div className="absolute left-10 top-28 h-[calc(100%-150px)] w-[2px] rounded-full bg-gradient-to-b from-emerald-500 via-yellow-400 to-red-500 opacity-80" />

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[520px] items-center justify-center"
                >
                  <div className="flex items-center gap-3 rounded-3xl border border-neutral-200 bg-white px-6 py-4 font-black text-neutral-700 shadow-xl shadow-black/5">
                    <Loader2 className="animate-spin text-emerald-600" />
                    Chargement des signaux live...
                  </div>
                </motion.div>
              ) : realEvents.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="ml-12 flex min-h-[520px] items-center justify-center"
                >
                  <div className="max-w-md rounded-[2rem] border border-neutral-200 bg-white p-8 text-center shadow-xl shadow-black/5">
                    <Radio className="mx-auto mb-4 text-red-600" size={44} />
                    <h3 className="text-2xl font-black">
                      Aucun événement réel détecté
                    </h3>
                    <p className="mt-3 text-neutral-600">
                      Dès que ton backend détecte un pic ou un live actif, il
                      s’affichera automatiquement ici.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="events"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="custom-scrollbar max-h-[760px] space-y-5 overflow-y-auto overflow-x-hidden pr-2"
                >
                  {realEvents.map((event, index) => {
                    const Icon = event.icon;

                    return (
                      <motion.article
                        key={event.id}
                        initial={{ opacity: 0, x: 35 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: Math.min(index * 0.03, 0.4),
                          type: "spring",
                          stiffness: 85,
                        }}
                        whileHover={{ x: 8, scale: 1.01 }}
                        className="group relative ml-12 overflow-hidden rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-lg shadow-black/5 transition hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-900/10"
                      >
                        <div className="absolute -left-[55px] top-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-lg shadow-black/10">
                          <Icon className={event.color} size={22} />
                        </div>

                        <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-emerald-500 via-yellow-400 to-red-500 opacity-0 transition group-hover:opacity-100" />

                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                                {event.badge}
                              </span>

                              <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-black text-neutral-500">
                                <Clock size={13} />
                                {event.time}
                              </span>
                            </div>

                            <h3 className="mt-4 text-2xl font-black text-neutral-950">
                              {event.title}
                            </h3>

                            <p className="mt-1 text-sm font-black text-emerald-700">
                              {event.channel}
                            </p>

                            <p className="mt-3 max-w-2xl leading-7 text-neutral-600">
                              {event.text}
                            </p>
                          </div>

                          <div className="shrink-0 rounded-3xl border border-neutral-200 bg-neutral-50 px-5 py-4 text-left md:text-right">
                            <p className="text-xs font-bold text-neutral-400">
                              Viewers détectés
                            </p>

                            <p className="mt-1 text-3xl font-black text-neutral-950">
                              {formatNumber(event.value)}
                            </p>

                            {event.growth > 0 && (
                              <p className="mt-2 text-sm font-black text-red-600">
                                +{event.growth}% croissance
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 999px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #10b981, #facc15, #ef4444);
          border-radius: 999px;
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #10b981 #f1f5f9;
        }
      `}</style>
    </section>
  );
}

function StatBox({
  icon: Icon,
  label,
  value,
  subValue,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subValue?: string;
  color: "emerald" | "cyan" | "yellow";
}) {
  const colors = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    cyan: "border-cyan-200 bg-cyan-50 text-cyan-700",
    yellow: "border-yellow-200 bg-yellow-50 text-yellow-700",
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 180 }}
      className={`rounded-3xl border p-5 shadow-sm ${colors[color]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold opacity-80">{label}</p>
          <p className="mt-2 line-clamp-1 text-2xl font-black text-neutral-950">
            {value}
          </p>
          {subValue && (
            <p className="mt-1 text-sm font-black opacity-80">{subValue}</p>
          )}
        </div>

        <Icon size={28} className="shrink-0" />
      </div>
    </motion.div>
  );
}

function AlertPreview({
  title,
  event,
  color,
}: {
  title: string;
  event?: TimelineItem;
  color: "red" | "emerald";
}) {
  const colors = {
    red: "border-red-200 bg-red-50 text-red-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 180 }}
      className={`rounded-3xl border p-5 shadow-sm ${colors[color]}`}
    >
      <p className="text-sm font-black uppercase tracking-[0.18em]">{title}</p>

      <p className="mt-3 line-clamp-1 text-xl font-black text-neutral-950">
        {event ? event.channel : "Aucune alerte"}
      </p>

      <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">
        {event
          ? `${formatNumber(event.value)} viewers — ${event.title}`
          : "En attente de données réelles depuis la base."}
      </p>
    </motion.div>
  );
}