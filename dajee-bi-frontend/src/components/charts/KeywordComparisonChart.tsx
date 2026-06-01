"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { Eye, Heart, MessageCircle, Trophy, Video } from "lucide-react";
import { fetchKeywordsSummary } from "@/lib/api";

type KeywordSummary = {
  keyword: string;
  videos: number;
  views: number;
  likes: number;
  comments: number;
  engagement: number;
};

function formatNumber(value: number) {
  const num = Number(value || 0);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return new Intl.NumberFormat("fr-FR").format(num);
}

export default function KeywordComparisonChart() {
  const [data, setData] = useState<KeywordSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await fetchKeywordsSummary();
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const topData = useMemo(() => data.slice(0, 8), [data]);

  const totals = useMemo(() => {
    return {
      views: data.reduce((acc, item) => acc + item.views, 0),
      videos: data.reduce((acc, item) => acc + item.videos, 0),
      likes: data.reduce((acc, item) => acc + item.likes, 0),
      comments: data.reduce((acc, item) => acc + item.comments, 0),
    };
  }, [data]);

  const winner = topData[0];

  return (
    <section className="mt-16">
      <div className="mb-10">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-green-700">
          Comparaison globale
        </p>

        <h2 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-neutral-950 md:text-5xl">
          Qui domine les tendances sur les 7 derniers jours ?
        </h2>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-600">
          dajee-bi compare les personnalités et sujets suivis sur les chaînes
          médias, puis classe les résultats par volume de vues, engagement et
          nombre de vidéos.
        </p>
      </div>

      {loading ? (
        <div className="h-[520px] animate-pulse rounded-[2.5rem] bg-white shadow-xl shadow-black/5" />
      ) : (
        <>
          <div className="mb-8 grid gap-5 md:grid-cols-4">
            {[
              {
                label: "Vues totales",
                value: formatNumber(totals.views),
                icon: Eye,
                color: "bg-green-50 text-green-700",
              },
              {
                label: "Vidéos analysées",
                value: formatNumber(totals.videos),
                icon: Video,
                color: "bg-blue-50 text-blue-700",
              },
              {
                label: "Likes",
                value: formatNumber(totals.likes),
                icon: Heart,
                color: "bg-red-50 text-red-600",
              },
              {
                label: "Commentaires",
                value: formatNumber(totals.comments),
                icon: MessageCircle,
                color: "bg-yellow-50 text-yellow-700",
              },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-xl shadow-black/5"
              >
                <div className={`mb-4 inline-flex rounded-2xl p-3 ${item.color}`}>
                  <item.icon size={24} />
                </div>

                <p className="text-sm text-neutral-500">{item.label}</p>
                <p className="mt-2 text-3xl font-black text-neutral-950">
                  {item.value}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-[2.5rem] border border-black/5 bg-white p-8 shadow-2xl shadow-black/5"
            >
              <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h3 className="text-3xl font-black text-neutral-950">
                    Volume de vues par mot-clé
                  </h3>
                  <p className="mt-2 text-neutral-500">
                    Classement automatique des sujets les plus visibles.
                  </p>
                </div>

                <div className="rounded-full bg-green-100 px-5 py-3 text-sm font-black text-green-700">
                  7 derniers jours
                </div>
              </div>

              <div className="h-[520px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topData}
                    layout="vertical"
                    barCategoryGap={18}
                    margin={{ top: 10, right: 40, left: 30, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis
                      type="number"
                      tickFormatter={(value) => formatNumber(Number(value))}
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="keyword"
                      width={170}
                      tick={{ fontSize: 13, fontWeight: 700 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(22, 163, 74, 0.08)" }}
                      formatter={(value) => formatNumber(Number(value))}
                      contentStyle={{
                        borderRadius: "18px",
                        border: "1px solid rgba(0,0,0,0.08)",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                      }}
                    />
                    <Bar dataKey="views" radius={[0, 16, 16, 0]} barSize={26}>
                      {topData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={
                            index === 0
                              ? "#16a34a"
                              : index === 1
                              ? "#22c55e"
                              : index === 2
                              ? "#84cc16"
                              : "#0f172a"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <div className="space-y-5">
              {winner && (
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-[2.5rem] bg-neutral-950 p-7 text-white shadow-2xl shadow-black/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-green-500 p-4 text-white">
                      <Trophy size={26} />
                    </div>

                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.2em] text-green-400">
                        Sujet dominant
                      </p>
                      <h3 className="text-3xl font-black">{winner.keyword}</h3>
                    </div>
                  </div>

                  <p className="mt-6 leading-8 text-white/70">
                    {winner.keyword} domine actuellement la conversation avec{" "}
                    <span className="font-black text-green-400">
                      {formatNumber(winner.views)}
                    </span>{" "}
                    vues cumulées sur les vidéos détectées.
                  </p>
                </motion.div>
              )}

              {topData.slice(0, 5).map((item, index) => (
                <motion.div
                  key={item.keyword}
                  initial={{ opacity: 0, x: 25 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="rounded-[2rem] border border-black/5 bg-white p-5 shadow-xl shadow-black/5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase text-green-700">
                        #{index + 1}
                      </p>
                      <h4 className="mt-1 text-xl font-black text-neutral-950">
                        {item.keyword}
                      </h4>
                    </div>

                    <div className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-black text-white">
                      {formatNumber(item.views)}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-green-50 p-3">
                      <p className="text-[11px] text-neutral-500">Vidéos</p>
                      <p className="text-lg font-black text-green-700">
                        {item.videos}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-red-50 p-3">
                      <p className="text-[11px] text-neutral-500">Likes</p>
                      <p className="text-lg font-black text-red-600">
                        {formatNumber(item.likes)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-yellow-50 p-3">
                      <p className="text-[11px] text-neutral-500">Com.</p>
                      <p className="text-lg font-black text-yellow-700">
                        {formatNumber(item.comments)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}