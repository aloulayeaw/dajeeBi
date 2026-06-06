"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ElementType, ReactNode, CSSProperties } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Brain,
  Crown,
  Eye,
  Flame,
  LineChart,
  Lock,
  Megaphone,
  MessageCircle,
  PieChart,
  Radio,
  Sparkles,
  Trophy,
  TrendingUp,
  UsersRound,
  Bird,
  Zap,
} from "lucide-react";

type Leader = {
  leader_name: string;
  username: string;
  profile_picture: string;
  followers_count: number;
  facebook_score: number;
  x_score: number;
  youtube_score: number;
  global_score: number;
  facebook_reactions: number;
  facebook_comments: number;
  facebook_shares: number;
  youtube_views: number;
  youtube_videos: number;
};

type Media = {
  media_name: string;
  videos: number;
  views: number;
  likes: number;
  comments: number;
};

type Topic = {
  keyword: string;
  videos: number;
  views: number;
  engagement: number;
};

type Prediction = {
  title: string;
  text: string;
  probability: number;
  estimated_impact: number;
};

type Alert = {
  type: string;
  message: string;
  value: number;
};

type AnalysisData = {
  kpis: {
    global_score: number;
    facebook_total: number;
    x_total: number;
    youtube_total: number;
    leaders_count: number;
  };
  top_leader: Leader | null;
  leaders: Leader[];
  platform_distribution: {
    platform: string;
    value: number;
  }[];
  media_ranking: Media[];
  trending_topics: Topic[];
  predictions: Prediction[];
  alerts: Alert[];
  ai_summary: string;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function formatNumber(value: number) {
  const num = Number(value || 0);

  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;

  return new Intl.NumberFormat("fr-FR").format(num);
}

function isValidImageUrl(url?: string) {
  if (!url) return false;

  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function safePercent(value: number, max: number, min = 4) {
  if (!max) return min;
  return Math.min(100, Math.max(min, (value / max) * 100));
}

export default function AnalysisPageContent({ data }: { data: AnalysisData }) {
  const leaders = data.leaders || [];
  const medias = data.media_ranking || [];
  const topics = data.trending_topics || [];
  const predictions = data.predictions || [];
  const alerts = data.alerts || [];
  const platforms = data.platform_distribution || [];
  const topLeader = data.top_leader;

  const maxLeaderScore = Math.max(
    ...leaders.map((leader) => leader.global_score || 0),
    1
  );

  const maxMediaViews = Math.max(
    ...medias.map((media) => media.views || 0),
    1
  );

  const maxTopicViews = Math.max(
    ...topics.map((topic) => topic.views || 0),
    1
  );

  const totalPlatform = platforms.reduce(
    (sum, current) => sum + Number(current.value || 0),
    0
  );

  const conicStyle: CSSProperties = {
    background:
      totalPlatform > 0
        ? `conic-gradient(
            #16a34a 0deg 130deg,
            #2563eb 130deg 250deg,
            #f59e0b 250deg 315deg,
            #111827 315deg 360deg
          )`
        : "#e5e7eb",
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f6f8fb] text-neutral-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-[520px] w-[520px] rounded-full bg-emerald-300/30 blur-[100px]" />
        <div className="absolute right-[-180px] top-24 h-[560px] w-[560px] rounded-full bg-blue-400/25 blur-[110px]" />
        <div className="absolute bottom-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-yellow-300/20 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a0a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a0a_1px,transparent_1px)] bg-[size:42px_42px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/75 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl md:p-9 lg:p-11"
        >
          <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <motion.div initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50 px-5 py-3 text-xs font-black uppercase tracking-[0.25em] text-emerald-700 shadow-sm">
                <Brain size={17} />
                Analyse
              </div>

              <h1 className="mt-6 max-w-5xl text-4xl font-black leading-[1.02] tracking-[-0.06em] text-slate-950 md:text-6xl lg:text-7xl">
                Le tableau de bord de{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-blue-700 to-slate-950 bg-clip-text text-transparent">
                  l’influence publique
                </span>{" "}
                au Sénégal.
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 md:text-xl">
                Une lecture claire, moderne et stratégique des performances
                Facebook, X/Twitter et YouTube pour comprendre qui capte
                réellement l’attention.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button className="group inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-4 text-sm font-black text-white shadow-xl shadow-slate-900/20 transition duration-300 hover:-translate-y-1 hover:bg-emerald-700">
                  <Lock size={17} />
                  Débloquer l’analyse avancée
                  <Sparkles
                    size={17}
                    className="transition group-hover:rotate-12"
                  />
                </button>

                <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-4 text-sm font-black text-slate-900 shadow-lg shadow-slate-900/5 transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:text-emerald-700">
                  <Eye size={17} />
                  Voir les tendances
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 25 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.6, ease: "easeOut" }} className="relative">
              <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/20 via-blue-500/10 to-yellow-400/20 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/30">
                <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-emerald-400/20 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-blue-500/20 blur-3xl" />

                <div className="relative z-10">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white/50">
                        Score global
                      </p>
                      <p className="mt-2 text-6xl font-black tracking-[-0.06em]">
                        {formatNumber(data.kpis.global_score)}
                      </p>
                    </div>

                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-xl">
                      <BarChart3 size={30} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <HeroMiniStat
                      icon={Megaphone}
                      label="Facebook"
                      value={data.kpis.facebook_total}
                    />
                    <HeroMiniStat
                      icon={MessageCircle}
                      label="X"
                      value={data.kpis.x_total}
                    />
                    <HeroMiniStat
                      icon={Bird}
                      label="YouTube"
                      value={data.kpis.youtube_total}
                    />
                  </div>

                  <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="font-bold text-white/60">
                        Leaders suivis
                      </span>
                      <span className="font-black">
                        {formatNumber(data.kpis.leaders_count)}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "78%" }}
                        transition={{ duration: 1.2, delay: 0.3 }}
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-blue-400 to-yellow-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5"
        >
          <KpiCard
            title="Score global"
            value={data.kpis.global_score}
            icon={Activity}
            tone="emerald"
            subtitle="Influence cumulée"
          />

          <KpiCard
            title="Facebook"
            value={data.kpis.facebook_total}
            icon={Megaphone}
            tone="blue"
            subtitle="Réactions, commentaires, partages"
          />

          <KpiCard
            title="X / Twitter"
            value={data.kpis.x_total}
            icon={MessageCircle}
            tone="slate"
            subtitle="Signal conversationnel"
          />

          <KpiCard
            title="YouTube"
            value={data.kpis.youtube_total}
            icon={Bird}
            tone="red"
            subtitle="Vues et vidéos"
          />

          <KpiCard
            title="Leaders suivis"
            value={data.kpis.leaders_count}
            icon={UsersRound}
            tone="amber"
            subtitle="Profils analysés"
          />
        </motion.div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            >
            <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl transition duration-700 group-hover:scale-125" />
            <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-yellow-300 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-yellow-400/20">
                <Crown size={18} />
                Leader dominant toutes plateformes
              </div>

              {topLeader ? (
                <>
                  <div className="flex items-center gap-5">
                    <div className="relative h-24 w-24 overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 shadow-2xl">
                      {isValidImageUrl(topLeader.profile_picture) ? (
                        <Image
                          src={topLeader.profile_picture}
                          alt={topLeader.leader_name}
                          fill
                          className="object-cover transition duration-700 group-hover:scale-110"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-4xl font-black">
                          {topLeader.leader_name.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div>
                      <h2 className="text-3xl font-black tracking-[-0.04em] md:text-4xl">
                        {topLeader.leader_name}
                      </h2>

                      <p className="mt-2 text-sm font-semibold text-white/55">
                        Facebook + X/Twitter + YouTube
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-3 gap-4">
                    <MiniStat label="Facebook" value={topLeader.facebook_score} />
                    <MiniStat label="X" value={topLeader.x_score} />
                    <MiniStat label="YouTube" value={topLeader.youtube_score} />
                  </div>

                  <div className="mt-8 rounded-[2rem] border border-white/10 bg-white p-6 text-slate-950 shadow-2xl shadow-black/20">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-slate-500">
                          Score global d’influence
                        </p>
                        <p className="mt-1 text-lg font-black">
                          Performance dominante
                        </p>
                      </div>

                      <p className="text-5xl font-black tracking-[-0.06em] text-emerald-700">
                        {Math.round(topLeader.global_score)}
                      </p>
                    </div>

                    <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{
                          width: `${safePercent(
                            topLeader.global_score,
                            maxLeaderScore
                          )}%`,
                        }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-blue-600 to-slate-950"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <EmptyState text="Aucune donnée leader disponible." />
              )}
            </div>
          </motion.div>

          <Card
            title="Évolution de l’influence par plateforme"
            icon={LineChart}
            action="Analyse"
          >
            <div className="space-y-5">
              {platforms.length ? (
                platforms.map((platform, index) => {
                  const percent = totalPlatform
                    ? Math.round((platform.value / totalPlatform) * 100)
                    : 0;

                  return (
                    <div
                      key={`${platform.platform}-${index}`}
                      className="rounded-[1.5rem] border border-slate-100 bg-slate-50/80 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm">
                            <Radio size={18} className="text-emerald-700" />
                          </div>

                          <span className="font-black text-slate-950">
                            {platform.platform}
                          </span>
                        </div>

                        <span className="font-black text-emerald-700">
                          {formatNumber(platform.value)} — {percent}%
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-white">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${percent}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: index * 0.08 }}
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-600"
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <EmptyState text="Aucune répartition disponible." />
              )}
            </div>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card title="Classement des leaders" icon={Trophy} action="Top">
            <div className="space-y-3">
              {leaders.length ? (
                leaders.map((leader, index) => (
                  <LeaderRow
                    key={`${leader.leader_name}-${index}`}
                    leader={leader}
                    index={index}
                    maxLeaderScore={maxLeaderScore}
                  />
                ))
              ) : (
                <EmptyState text="Aucun leader à afficher." />
              )}
            </div>
          </Card>

          <Card title="Médias les plus influents" icon={Flame} action="Voir">
            <div className="space-y-5">
              {medias.length ? (
                medias.slice(0, 8).map((media, index) => (
                  <ProgressRow
                    key={`${media.media_name}-${index}`}
                    rank={index + 1}
                    label={media.media_name}
                    value={media.views}
                    max={maxMediaViews}
                    caption={`${formatNumber(media.videos)} vidéos • ${formatNumber(
                      media.likes
                    )} likes`}
                    color="blue"
                  />
                ))
              ) : (
                <EmptyState text="Aucun média disponible." />
              )}
            </div>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <Card title="Prédictions prochaines" icon={Zap} action="IA">
            <div className="space-y-4">
              {predictions.length ? (
                predictions.map((prediction, index) => (
                  <motion.div
                    key={`${prediction.title}-${index}`}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="relative overflow-hidden rounded-[1.7rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5"
                  >
                    <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-emerald-300/20 blur-2xl" />

                    <div className="relative z-10">
                      <div className="mb-3 flex items-center justify-between gap-4">
                        <p className="font-black text-slate-950">
                          {prediction.title}
                        </p>

                        <p className="text-3xl font-black tracking-[-0.05em] text-emerald-700">
                          {prediction.probability}%
                        </p>
                      </div>

                      <p className="text-sm leading-6 text-slate-600">
                        {prediction.text}
                      </p>

                      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black text-slate-900 shadow-sm">
                        <TrendingUp size={15} className="text-emerald-700" />
                        Impact estimé : +
                        {formatNumber(prediction.estimated_impact)}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <EmptyState text="Aucune prédiction disponible." />
              )}
            </div>
          </Card>

          <Card title="Alertes stratégiques" icon={AlertTriangle} action="Live">
            <div className="space-y-4">
              {alerts.length ? (
                alerts.map((alert, index) => (
                  <motion.div
                    key={`${alert.message}-${index}`}
                    whileHover={{ x: 4 }}
                    className="flex gap-4 rounded-[1.5rem] border border-red-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                      <AlertTriangle size={21} />
                    </div>

                    <div className="flex-1">
                      <p className="font-bold leading-6 text-slate-900">
                        {alert.message}
                      </p>

                      <p className="mt-2 text-sm font-black text-emerald-700">
                        {alert.type} • {formatNumber(alert.value)}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <EmptyState text="Aucune alerte détectée." />
              )}
            </div>
          </Card>

          <Card title="Sujets qui montent" icon={TrendingUp} action="Trend">
            <div className="space-y-5">
              {topics.length ? (
                topics.slice(0, 8).map((topic, index) => (
                  <ProgressRow
                    key={`${topic.keyword}-${index}`}
                    rank={index + 1}
                    label={topic.keyword}
                    value={topic.views}
                    max={maxTopicViews}
                    caption={`${formatNumber(
                      topic.videos
                    )} vidéos • engagement ${formatNumber(topic.engagement)}`}
                    color="emerald"
                  />
                ))
              ) : (
                <EmptyState text="Aucun sujet tendance disponible." />
              )}
            </div>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Card title="Répartition par plateforme" icon={PieChart} action="Data">
            <div className="flex flex-col items-center justify-center py-6">
              <motion.div
                initial={{ rotate: -120, opacity: 0 }}
                whileInView={{ rotate: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                className="relative h-64 w-64 rounded-full p-5 shadow-2xl shadow-slate-900/10"
                style={conicStyle}
              >
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white text-center shadow-inner">
                  <p className="text-sm font-bold text-slate-500">Total</p>
                  <p className="mt-1 text-4xl font-black tracking-[-0.06em]">
                    {formatNumber(data.kpis.global_score)}
                  </p>
                  <p className="mt-1 text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
                    influence
                  </p>
                </div>
              </motion.div>

              <div className="mt-6 grid w-full gap-3">
                {platforms.slice(0, 4).map((platform, index) => (
                  <div
                    key={`${platform.platform}-legend-${index}`}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                  >
                    <span className="font-bold text-slate-700">
                      {platform.platform}
                    </span>
                    <span className="font-black text-slate-950">
                      {formatNumber(platform.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card title="Résumé des derniers jours" icon={Brain} action="Résumé IA">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-emerald-950 p-7 text-white">
              <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

              <div className="relative z-10">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-xl">
                    <Brain size={30} />
                  </div>

                  <div>
                    <p className="text-2xl font-black tracking-[-0.04em]">
                      Analyse Dajee BI
                    </p>
                    <p className="mt-1 text-sm text-white/50">
                      Synthèse générée à partir des données collectées.
                    </p>
                  </div>
                </div>

                <p className="text-lg leading-9 text-white/80">
                  {data.ai_summary || "Aucune synthèse disponible pour le moment."}
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950">
                    <TrendingUp size={18} />
                    Tendance générale : haussière
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur-xl">
                    <Sparkles size={18} />
                    Données multi-plateformes
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

function KpiCard({
  title,
  value,
  icon: Icon,
  subtitle,
  tone,
}: {
  title: string;
  value: number;
  icon: ElementType;
  subtitle: string;
  tone: "emerald" | "blue" | "slate" | "red" | "amber";
}) {
  const toneClasses = {
    emerald: "from-emerald-500 to-emerald-700 text-emerald-700 bg-emerald-50",
    blue: "from-blue-500 to-blue-700 text-blue-700 bg-blue-50",
    slate: "from-slate-700 to-slate-950 text-slate-700 bg-slate-100",
    red: "from-red-500 to-red-700 text-red-700 bg-red-50",
    amber: "from-amber-400 to-yellow-600 text-amber-700 bg-amber-50",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -8, scale: 1.015 }}
      className="group relative overflow-hidden rounded-[2rem] border border-white bg-white p-6 shadow-xl shadow-slate-900/5 transition duration-300"
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${
          toneClasses[tone].split(" text-")[0]
        }`}
      />

      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-slate-900/5 blur-2xl transition duration-500 group-hover:scale-150" />

      <div
        className={`mb-5 flex h-13 w-13 items-center justify-center rounded-2xl ${
          toneClasses[tone].split(" ").slice(-1)[0]
        }`}
      >
        <Icon
          size={23}
          className={toneClasses[tone].includes("text-emerald")
            ? "text-emerald-700"
            : toneClasses[tone].includes("text-blue")
              ? "text-blue-700"
              : toneClasses[tone].includes("text-red")
                ? "text-red-700"
                : toneClasses[tone].includes("text-amber")
                  ? "text-amber-700"
                  : "text-slate-700"}
        />
      </div>

      <p className="text-sm font-bold text-slate-500">{title}</p>

      <p className="mt-2 text-4xl font-black tracking-[-0.06em] text-slate-950">
        {formatNumber(value)}
      </p>

      <p className="mt-3 text-sm font-semibold leading-5 text-slate-500">
        {subtitle}
      </p>
    </motion.div>
  );
}

function HeroMiniStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: ElementType;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
      <Icon size={20} className="mb-3 text-emerald-300" />
      <p className="text-xs font-bold text-white/45">{label}</p>
      <p className="mt-1 text-2xl font-black tracking-[-0.04em]">
        {formatNumber(value)}
      </p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur-xl"
    >
      <p className="text-sm font-semibold text-white/55">{label}</p>

      <p className="mt-2 text-3xl font-black tracking-[-0.05em]">
        {formatNumber(value)}
      </p>
    </motion.div>
  );
}

function Card({
  title,
  children,
  icon: Icon,
  action,
}: {
  title: string;
  children: ReactNode;
  icon: ElementType;
  action: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      className="rounded-[2.2rem] border border-white bg-white/90 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/20">
            <Icon size={22} />
          </div>

          <h2 className="text-xl font-black tracking-[-0.03em] text-slate-950">
            {title}
          </h2>
        </div>

        <button className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-700 transition hover:bg-emerald-100 hover:text-emerald-700">
          {action}
        </button>
      </div>

      {children}
    </motion.div>
  );
}

function LeaderRow({
  leader,
  index,
  maxLeaderScore,
}: {
  leader: Leader;
  index: number;
  maxLeaderScore: number;
}) {
  const rankClass =
    index === 0
      ? "bg-yellow-400 text-slate-950"
      : index === 1
        ? "bg-slate-300 text-slate-950"
        : index === 2
          ? "bg-orange-500 text-white"
          : "bg-slate-950 text-white";

  return (
    <motion.div
      whileHover={{ x: 5, scale: 1.005 }}
      className="grid grid-cols-[44px_1fr_auto] items-center gap-4 rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-sm transition"
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-black ${rankClass}`}
      >
        {index + 1}
      </div>

      <div className="min-w-0">
        <p className="truncate font-black text-slate-950">
          {leader.leader_name}
        </p>

        <p className="mt-1 truncate text-sm text-slate-500">
          FB {formatNumber(leader.facebook_score)} • X{" "}
          {formatNumber(leader.x_score)} • YT{" "}
          {formatNumber(leader.youtube_score)}
        </p>

        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{
              width: `${safePercent(leader.global_score, maxLeaderScore, 5)}%`,
            }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: index * 0.05 }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-600"
          />
        </div>
      </div>

      <div className="rounded-2xl bg-slate-950 px-4 py-3 text-center font-black text-white shadow-lg shadow-slate-900/10">
        {Math.round(leader.global_score)}
      </div>
    </motion.div>
  );
}

function ProgressRow({
  rank,
  label,
  value,
  max,
  caption,
  color,
}: {
  rank: number;
  label: string;
  value: number;
  max: number;
  caption: string;
  color: "blue" | "emerald";
}) {
  return (
    <div>
      <div className="mb-2 flex items-start justify-between gap-4">
        <div>
          <p className="font-black text-slate-950">
            {rank}. {label}
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            {caption}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-sm font-black ${
            color === "blue"
              ? "bg-blue-50 text-blue-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {formatNumber(value)}
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${safePercent(value, max, 8)}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: rank * 0.04 }}
          className={`h-full rounded-full ${
            color === "blue"
              ? "bg-gradient-to-r from-blue-500 to-slate-950"
              : "bg-gradient-to-r from-emerald-500 to-blue-600"
          }`}
        />
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm font-bold text-slate-500">
      {text}
    </div>
  );
}