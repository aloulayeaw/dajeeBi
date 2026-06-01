"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  // Facebook,
  ArrowUpRight,
  Trophy,
  Heart,
  MessageCircle,
 // Share2,
  Users,
} from "lucide-react";

type FacebookLeader = {
  leader_name: string;
  page_name: string;
  page_url: string;
  profile_picture: string;
  followers_count: number;
  likes_count: number;
  influence_score: number;
  updated_at: string;
};

function formatNumber(value: number) {
  const num = Number(value || 0);

  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;

  return new Intl.NumberFormat("fr-FR").format(num);
}

export default function FacebookInfluenceSection({
  leaders = [],
}: {
  leaders?: FacebookLeader[];
}) {
  const topLeader = leaders[0];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.25em] text-blue-700">
             
              Influence Facebook
            </p>

            <h2 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-neutral-950 md:text-5xl">
              Les leaders politiques qui dominent Facebook.
            </h2>

            <p className="mt-4 max-w-2xl text-neutral-600">
              Classement basé sur les pages publiques, les abonnés et
              l’engagement des derniers contenus récupérés par dajee-bi.
            </p>
          </div>

          <button className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
            Voir tout le classement
            <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 to-blue-950 p-7 text-white shadow-2xl shadow-blue-900/20"
          >
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-black">
                <Trophy size={16} />
                Leader Facebook #1
              </div>

              <div className="flex items-center gap-5">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white/30 bg-white/10">
                  {topLeader?.profile_picture ? (
                    <Image
                      src={topLeader.profile_picture}
                      alt={topLeader.leader_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl font-black">
                      {topLeader?.leader_name?.charAt(0) || "?"}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-3xl font-black">
                    {topLeader?.leader_name || "Aucune donnée"}
                  </h3>

                  <p className="mt-1 text-white/70">
                    {topLeader?.page_name || "Données Facebook en attente"}
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/10 p-5">
                  <Users className="mb-3 text-blue-200" />
                  <p className="text-sm text-white/60">Followers</p>
                  <p className="text-3xl font-black">
                    {formatNumber(topLeader?.followers_count || 0)}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-5">
                  <Users className="mb-3 text-blue-200" />
                  <p className="text-sm text-white/60">Likes page</p>
                  <p className="text-3xl font-black">
                    {formatNumber(topLeader?.likes_count || 0)}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-white p-5 text-neutral-950">
                <div className="flex items-center justify-between">
                  <p className="font-black">Score influence Facebook</p>

                  <p className="text-4xl font-black text-blue-700">
                    {Math.round(topLeader?.influence_score || 0)}
                  </p>
                </div>

                <div className="mt-4 h-4 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{
                      width: `${Math.min(
                        topLeader?.influence_score || 0,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-2xl shadow-black/5"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-black text-neutral-950">
                Classement Facebook politique
              </h3>

              <p className="text-sm font-bold text-neutral-500">
                Top {leaders.length}
              </p>
            </div>

            <div className="space-y-4">
              {leaders.slice(0, 6).map((leader, index) => (
                <a
                  key={`${leader.leader_name}-${index}`}
                  href={leader.page_url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-black/5 p-4 transition hover:-translate-y-1 hover:bg-blue-50"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-black text-white ${
                      index === 0
                        ? "bg-yellow-500"
                        : index === 1
                        ? "bg-neutral-400"
                        : index === 2
                        ? "bg-orange-500"
                        : "bg-blue-600"
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div className="relative h-12 w-12 overflow-hidden rounded-full bg-blue-100">
                    {leader.profile_picture ? (
                      <Image
                        src={leader.profile_picture}
                        alt={leader.leader_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-black text-blue-700">
                        {leader.leader_name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black text-neutral-950">
                      {leader.leader_name}
                    </p>

                    <p className="text-sm text-neutral-500">
                      {formatNumber(leader.followers_count)} followers
                    </p>
                  </div>

                  <div className="hidden items-center gap-4 md:flex">
                    <div className="text-center">
                      <Heart size={16} className="mx-auto text-red-500" />
                      <p className="mt-1 text-xs font-bold text-neutral-500">
                        Likes
                      </p>
                      <p className="font-black">
                        {formatNumber(leader.likes_count)}
                      </p>
                    </div>

                    <div className="text-center">
                      <MessageCircle
                        size={16}
                        className="mx-auto text-blue-500"
                      />
                      <p className="mt-1 text-xs font-bold text-neutral-500">
                        Score
                      </p>
                      <p className="font-black">
                        {Math.round(leader.influence_score)}
                      </p>
                    </div>
                  </div>

                  <ArrowUpRight
                    size={18}
                    className="text-neutral-400 transition group-hover:text-blue-700"
                  />
                </a>
              ))}

              {leaders.length === 0 && (
                <div className="rounded-2xl bg-neutral-50 p-6 text-center text-neutral-500">
                  Aucune donnée Facebook disponible pour le moment.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}