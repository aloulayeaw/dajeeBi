"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Quote,
  Eye,
  ArrowUpRight,
  Trophy,
  BadgeCheck,
  User,
  Bird,
} from "lucide-react";

type XLeader = {
  leader_name: string;
  username: string;
  profile_url: string;
  profile_picture?: string;
  followers_count: number;
  verified: boolean;
  bio?: string;
  x_score: number;
};

type XPost = {
  leader_name: string;
  username: string;
  tweet_url: string;
  tweet_text: string;
  thumbnail_url?: string;
  likes_count: number;
  replies_count: number;
  retweets_count: number;
  quotes_count: number;
  views_count: number;
  x_impact_score: number;
};

const DEFAULT_TWEET_IMAGE =
  "https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=1200&auto=format&fit=crop";

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

export default function XPoliticalImpactSection({
  ranking = [],
  posts = [],
}: {
  ranking?: XLeader[];
  posts?: XPost[];
}) {
  const sortedRanking = useMemo(() => {
    return [...ranking].sort(
      (a, b) => Number(b.x_score || 0) - Number(a.x_score || 0)
    );
  }, [ranking]);

  const [selectedUsername, setSelectedUsername] = useState(
    sortedRanking[0]?.username || ""
  );

  const topLeader = sortedRanking[0];

  const activeLeader =
    sortedRanking.find((leader) => leader.username === selectedUsername) ||
    sortedRanking[0];

  const activePosts = useMemo(() => {
    if (!activeLeader) return [];

    return posts
      .filter(
        (post) =>
          post.username === activeLeader.username ||
          post.leader_name === activeLeader.leader_name
      )
      .slice(0, 2);
  }, [posts, activeLeader]);

  if (!sortedRanking.length || !topLeader || !activeLeader) return null;

  return (
    <section className="relative overflow-hidden bg-white py-14 md:py-24">
      <div className="pointer-events-none absolute -left-28 top-0 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-black/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 130, damping: 18 }}
          className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end"
        >
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-white">
              <Bird size={17} />
              X / Twitter Impact
            </p>

            <h2 className="mt-5 max-w-4xl text-3xl font-black leading-tight text-neutral-950 sm:text-5xl md:text-6xl">
              L’influence politique en temps réel.
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600 md:text-lg">
              Sélectionnez un leader et visualisez ses derniers tweets avec les
              réactions, commentaires, retweets et vues.
            </p>
          </div>

          <a
            href="/influenceurs"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 py-4 text-sm font-black text-white transition duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl"
          >
            Analyse complète
            <ArrowUpRight size={17} />
          </a>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
          <motion.div
            initial={{ opacity: 0, x: -40, rotate: -1 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 150, damping: 17 }}
            className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-neutral-950 via-neutral-900 to-blue-950 p-5 text-white shadow-2xl shadow-black/20 sm:p-7 md:rounded-[2.6rem]"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl"
            />

            <div className="relative z-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black text-black sm:px-5 sm:py-3">
                <Trophy size={18} />
                Leader #1
              </div>

              <div className="flex min-w-0 items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-white/20 bg-white/10 sm:h-24 sm:w-24">
                  {isValidImageUrl(topLeader.profile_picture) ? (
                    <Image
                      src={topLeader.profile_picture!}
                      alt={topLeader.leader_name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl font-black">
                      {topLeader.leader_name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-2xl font-black sm:text-4xl">
                      {topLeader.leader_name}
                    </h3>

                    {topLeader.verified && (
                      <BadgeCheck className="shrink-0 text-blue-400" />
                    )}
                  </div>

                  <p className="mt-2 truncate text-sm text-white/60">
                    @{topLeader.username}
                  </p>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <motion.div
                  whileHover={{ y: -6, scale: 1.03 }}
                  className="rounded-3xl bg-white/10 p-5"
                >
                  <p className="text-sm text-white/60">Followers</p>
                  <p className="mt-2 text-4xl font-black">
                    {formatNumber(topLeader.followers_count)}
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -6, scale: 1.03 }}
                  className="rounded-3xl bg-white p-5 text-black"
                >
                  <p className="text-sm text-neutral-500">Score X</p>
                  <p className="mt-2 text-5xl font-black text-blue-700">
                    {Math.round(topLeader.x_score)}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, rotate: 1 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 150, damping: 17 }}
            className="rounded-[2rem] border border-black/5 bg-white p-4 shadow-2xl shadow-black/5 sm:p-6 md:rounded-[2.6rem]"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 className="text-xl font-black text-neutral-950 sm:text-2xl">
                Classement X politique
              </h3>

              <span className="rounded-full bg-neutral-100 px-4 py-2 text-xs font-black">
                Top {sortedRanking.length}
              </span>
            </div>

            <div className="space-y-3">
              {sortedRanking.slice(0, 8).map((leader, index) => (
                <motion.button
                  key={leader.username}
                  onClick={() => setSelectedUsername(leader.username)}
                  whileHover={{ x: 8, scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex w-full min-w-0 items-center gap-3 rounded-3xl border p-3 text-left transition ${
                    activeLeader.username === leader.username
                      ? "border-blue-600 bg-blue-50 shadow-lg shadow-blue-100"
                      : "border-black/5 bg-white hover:bg-neutral-50"
                  }`}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black font-black text-white">
                    {index + 1}
                  </div>

                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-neutral-100">
                    {isValidImageUrl(leader.profile_picture) ? (
                      <Image
                        src={leader.profile_picture!}
                        alt={leader.leader_name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-black">
                        {leader.leader_name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-neutral-950 sm:text-base">
                      {leader.leader_name}
                    </p>
                    <p className="truncate text-xs text-neutral-500 sm:text-sm">
                      @{leader.username} •{" "}
                      {formatNumber(leader.followers_count)} followers
                    </p>
                  </div>

                  <div className="hidden shrink-0 rounded-2xl bg-black px-4 py-2 text-sm font-black text-white sm:block">
                    {Math.round(leader.x_score)}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeLeader.username}
            initial={{ opacity: 0, y: 45, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 170, damping: 18 }}
            className="mt-8 rounded-[2rem] border border-black/5 bg-[#f8fafc] p-4 shadow-xl shadow-black/5 sm:p-6 md:rounded-[2.6rem]"
          >
            <div className="mb-8 grid gap-6 lg:grid-cols-[0.35fr_0.65fr]">
              <motion.div
                whileHover={{ y: -6 }}
                className="rounded-[2rem] bg-white p-5 shadow-lg shadow-black/5 sm:p-6"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-neutral-100 sm:h-20 sm:w-20">
                    {isValidImageUrl(activeLeader.profile_picture) ? (
                      <Image
                        src={activeLeader.profile_picture!}
                        alt={activeLeader.leader_name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User size={30} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-xl font-black sm:text-2xl">
                        {activeLeader.leader_name}
                      </h3>
                      {activeLeader.verified && (
                        <BadgeCheck className="shrink-0 text-blue-600" />
                      )}
                    </div>
                    <p className="truncate text-sm font-bold text-neutral-500">
                      @{activeLeader.username}
                    </p>
                  </div>
                </div>

                <p className="mt-5 line-clamp-4 text-sm leading-7 text-neutral-600">
                  {activeLeader.bio || "Profil politique suivi par dajee-bi."}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-neutral-50 p-4">
                    <p className="text-xs text-neutral-500">Followers</p>
                    <p className="text-2xl font-black">
                      {formatNumber(activeLeader.followers_count)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-black p-4 text-white">
                    <p className="text-xs text-white/60">Score X</p>
                    <p className="text-2xl font-black">
                      {Math.round(activeLeader.x_score)}
                    </p>
                  </div>
                </div>

                <a
                  href={activeLeader.profile_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-blue-700 px-5 py-4 text-sm font-black text-white transition hover:bg-black"
                >
                  Voir le profil X
                  <ArrowUpRight size={16} />
                </a>
              </motion.div>

              <div className="flex flex-col justify-center">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-700">
                  2 derniers tweets
                </p>

                <h3 className="mt-2 break-words text-3xl font-black text-neutral-950 sm:text-5xl">
                  {activeLeader.leader_name}
                </h3>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
                  Les deux derniers tweets collectés avec des métriques bien
                  visibles pour analyser l’engagement.
                </p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {activePosts.map((post, index) => {
                const imageSrc = isValidImageUrl(post.thumbnail_url)
                  ? post.thumbnail_url!
                  : DEFAULT_TWEET_IMAGE;

                return (
                  <motion.a
                    key={`${post.tweet_url}-${index}`}
                    href={post.tweet_url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    initial={{ opacity: 0, y: 35, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 180,
                      damping: 17,
                      delay: index * 0.08,
                    }}
                    whileHover={{ y: -10, scale: 1.015 }}
                    className="group min-w-0 overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-2xl shadow-black/10"
                  >
                    <div className="relative h-56 overflow-hidden bg-neutral-100 sm:h-64">
                      <Image
                        src={imageSrc}
                        alt={post.leader_name}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-110"
                        unoptimized
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                      <div className="absolute left-4 top-4 rounded-full bg-black px-4 py-2 text-xs font-black text-white">
                        X
                      </div>

                      <div className="absolute right-4 top-4 rounded-full bg-white px-5 py-2 text-sm font-black text-blue-700 shadow-lg">
                        Score {Math.round(post.x_impact_score)}
                      </div>
                    </div>

                    <div className="p-5 sm:p-6">
                      <p className="line-clamp-4 min-h-[112px] break-words text-base leading-8 text-neutral-800">
                        {post.tweet_text || "Tweet récupéré par dajee-bi."}
                      </p>

                      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
                        <Metric label="Likes" icon={Heart} value={post.likes_count} />
                        <Metric
                          label="Commentaires"
                          icon={MessageCircle}
                          value={post.replies_count}
                        />
                        <Metric
                          label="Retweets"
                          icon={Repeat2}
                          value={post.retweets_count}
                        />
                        <Metric label="Citations" icon={Quote} value={post.quotes_count} />
                        {/* <Metric label="Vues" icon={Eye} value={post.views_count} /> */}
                      </div>

                      <div className="mt-6 flex items-center justify-between rounded-2xl bg-black px-5 py-4 text-white transition group-hover:bg-blue-700">
                        <span className="text-sm font-black">Voir sur X</span>
                        <ArrowUpRight size={18} />
                      </div>
                    </div>
                  </motion.a>
                );
              })}

              {activePosts.length === 0 && (
                <div className="rounded-[2rem] bg-white p-8 text-center text-neutral-500 lg:col-span-2">
                  Aucun tweet disponible pour ce leader.
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.04 }}
      className="rounded-2xl bg-neutral-50 p-3 text-center shadow-sm"
    >
      <Icon className="mx-auto text-neutral-700" size={18} />

      <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-neutral-400">
        {label}
      </p>

      <p className="mt-1 text-base font-black text-neutral-950">
        {formatNumber(value)}
      </p>
    </motion.div>
  );
}