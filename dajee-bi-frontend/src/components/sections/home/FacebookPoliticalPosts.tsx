"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  BadgeCheck,
  Heart,
  MessageCircle,
  Share2,
  Flame,
  ArrowUpRight,
  Trophy,
  TrendingUp,
  Globe,
} from "lucide-react";

type FacebookPost = {
  leader_name: string;
  post_text: string;
  post_url: string;
  thumbnail_url?: string;
  reactions_count: number;
  comments_count: number;
  shares_count: number;
  viral_score: number;
  published_at?: string;
};

type LeaderStats = {
  leader_name: string;
  reactions: number;
  comments: number;
  shares: number;
  score: number;
  posts: FacebookPost[];
};

const DEFAULT_POST_IMAGE =
  "https://images.unsplash.com/p";

const rankColors = [
  "from-yellow-400 to-orange-500",
  "from-neutral-300 to-neutral-500",
  "from-orange-400 to-red-500",
];

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

export default function FacebookPoliticalPosts({
  posts = [],
}: {
  posts?: FacebookPost[];
}) {
  const leaders = useMemo(() => {
    const map = new Map<string, LeaderStats>();

    posts.forEach((post) => {
      if (!map.has(post.leader_name)) {
        map.set(post.leader_name, {
          leader_name: post.leader_name,
          reactions: 0,
          comments: 0,
          shares: 0,
          score: 0,
          posts: [],
        });
      }

      const leader = map.get(post.leader_name)!;

      leader.reactions += Number(post.reactions_count || 0);
      leader.comments += Number(post.comments_count || 0);
      leader.shares += Number(post.shares_count || 0);
      leader.score += Number(post.viral_score || 0);
      leader.posts.push(post);
    });

    return Array.from(map.values()).sort((a, b) => b.score - a.score);
  }, [posts]);

  const [selectedLeader, setSelectedLeader] = useState(
    leaders[0]?.leader_name || ""
  );

  const activeLeader =
    leaders.find((leader) => leader.leader_name === selectedLeader) ||
    leaders[0];

  const topLeader = leaders[0];

  if (!leaders.length || !topLeader || !activeLeader) return null;

  const activePosts = activeLeader.posts.slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-[#f8fafc] py-14 md:py-24">
      <div className="pointer-events-none absolute -left-28 top-10 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-10 h-80 w-80 rounded-full bg-green-300/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
          className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end"
        >
          <div className="min-w-0">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700 sm:px-5 sm:py-3">
              <Flame size={16} />
              Influence Facebook
            </div>

            <h2 className="max-w-5xl text-3xl font-black leading-tight text-neutral-950 sm:text-5xl md:text-6xl">
              Le classement des leaders politiques{" "}
              <span className="bg-gradient-to-r from-blue-700 to-green-600 bg-clip-text text-transparent">
                les plus impactants.
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600 md:text-lg">
              Suivez les leaders qui génèrent le plus d’engagement sur Facebook
              à travers les réactions, commentaires et partages.
            </p>
          </div>

          <a
            href="/influenceurs"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-700 px-6 py-4 text-sm font-black text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-black sm:w-fit"
          >
            Voir tout le classement
            <ArrowUpRight size={17} />
          </a>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, x: -40, rotate: -1 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 150, damping: 18 }}
            className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 via-blue-950 to-black p-5 text-white shadow-2xl shadow-black/20 sm:p-7 md:rounded-[2.8rem]"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.55, 0.25] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-green-400/20 blur-3xl"
            />

            <div className="relative z-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-2 text-xs font-black text-black sm:px-5 sm:py-3">
                <Trophy size={18} />
                Leader #1 Facebook
              </div>

              <div className="flex min-w-0 items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-white/20 bg-white/10 sm:h-24 sm:w-24">
                  <Image
                    src={
                      isValidImageUrl(topLeader.posts[0]?.thumbnail_url)
                        ? topLeader.posts[0].thumbnail_url!
                        : DEFAULT_POST_IMAGE
                    }
                    alt={topLeader.leader_name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-2xl font-black sm:text-4xl">
                      {topLeader.leader_name}
                    </h3>
                    <BadgeCheck className="shrink-0 text-blue-300" size={22} />
                  </div>

                  <p className="mt-2 text-sm text-white/70">
                    Leader actuellement dominant sur Facebook.
                  </p>

                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-2 text-xs font-bold text-green-300">
                    <TrendingUp size={15} />
                    En tête du classement
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <HeroMetric
                  icon={Heart}
                  label="Réactions"
                  value={topLeader.reactions}
                />
                <HeroMetric
                  icon={MessageCircle}
                  label="Commentaires"
                  value={topLeader.comments}
                />
                <HeroMetric
                  icon={Share2}
                  label="Partages"
                  value={topLeader.shares}
                />
              </div>

              <div className="mt-6 rounded-[2rem] bg-white p-5 text-black sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-base font-black sm:text-lg">
                      Score d’impact Facebook
                    </p>
                    <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
                      Influence numérique globale
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-4xl font-black text-blue-700 sm:text-5xl">
                      {Math.round(topLeader.score)}
                    </p>
                    <p className="text-xs font-bold text-green-600 sm:text-sm">
                      Très fort 🚀
                    </p>
                  </div>
                </div>

                <div className="mt-5 h-4 overflow-hidden rounded-full bg-neutral-100">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{
                      width: `${Math.min(topLeader.score / 1000, 100)}%`,
                    }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1 }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-green-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, rotate: 1 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 150, damping: 18 }}
            className="rounded-[2rem] border border-black/5 bg-white p-4 shadow-2xl shadow-black/5 sm:p-6 md:rounded-[2.8rem]"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 className="text-xl font-black text-neutral-950 sm:text-2xl">
                Classement général
              </h3>

              <span className="rounded-full bg-green-100 px-4 py-2 text-xs font-black text-green-700">
                Top {leaders.length}
              </span>
            </div>

            <div className="space-y-3">
              {leaders.map((leader, index) => (
                <motion.button
                  key={leader.leader_name}
                  whileHover={{ x: 8, scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedLeader(leader.leader_name)}
                  className={`w-full min-w-0 rounded-3xl border p-3 text-left transition sm:p-4 ${
                    activeLeader.leader_name === leader.leader_name
                      ? "border-blue-600 bg-blue-50 shadow-lg shadow-blue-100"
                      : "border-black/5 bg-white hover:bg-neutral-50"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-r text-sm font-black text-white sm:h-12 sm:w-12 ${
                        rankColors[index] || "from-blue-600 to-blue-700"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center gap-2">
                        <p className="truncate text-sm font-black text-neutral-950 sm:text-base">
                          {leader.leader_name}
                        </p>

                        {index === 0 && (
                          <BadgeCheck
                            size={18}
                            className="shrink-0 text-blue-600"
                          />
                        )}
                      </div>

                      <p className="truncate text-xs text-neutral-500 sm:text-sm">
                        {formatNumber(leader.reactions)} réactions •{" "}
                        {formatNumber(leader.comments)} commentaires •{" "}
                        {formatNumber(leader.shares)} partages
                      </p>
                    </div>

                    <div className="hidden shrink-0 rounded-2xl bg-black px-4 py-2 text-sm font-black text-white sm:block">
                      {Math.round(leader.score)}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeLeader.leader_name}
            initial={{ opacity: 0, y: 45, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 170, damping: 18 }}
            className="mt-8 rounded-[2rem] border border-black/5 bg-white p-4 shadow-2xl shadow-black/5 sm:p-6 md:rounded-[2.8rem]"
          >
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-700">
                  Derniers contenus
                </p>

                <h3 className="mt-2 text-3xl font-black text-neutral-950 sm:text-5xl">
                  {activeLeader.leader_name}
                </h3>
              </div>

              <span className="w-fit rounded-full bg-black px-5 py-3 text-xs font-black text-white sm:text-sm">
                3 derniers posts
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {activePosts.map((post, index) => {
                const imageSrc = isValidImageUrl(post.thumbnail_url)
                  ? post.thumbnail_url!
                  : DEFAULT_POST_IMAGE;

                return (
                  <motion.a
                    key={`${post.post_url}-${index}`}
                    href={post.post_url || "#"}
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
                    className="group min-w-0 overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-xl shadow-black/10"
                  >
                    <div className="relative h-56 overflow-hidden bg-neutral-100 sm:h-64">
                      {isValidImageUrl(post.thumbnail_url) ? (
                        <Image
                          src={post.thumbnail_url!}
                          alt={post.leader_name}
                          fill
                          className="object-cover transition duration-700 group-hover:scale-110"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-950 via-black to-blue-700">
                          <div className="text-center text-white">
                            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-4xl font-black backdrop-blur-xl">
                              {post.leader_name.charAt(0)}
                            </div>

                            <p className="text-lg font-black">
                              {post.leader_name}
                            </p>

                            <p className="mt-2 text-sm text-white/60">
                              Facebook Post
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                      <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-blue-700 px-4 py-2 text-xs font-black text-white shadow-lg">
                        <div className="text-white font-black text-sm">f</div>
                        Facebook
                      </div>

                      <div className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-black text-blue-700 shadow-lg">
                        Score {Math.round(post.viral_score)}
                      </div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="line-clamp-2 text-lg font-black text-white">
                          {post.leader_name}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6">
                      <p className="line-clamp-4 min-h-[112px] break-words text-base leading-8 text-neutral-800">
                        {post.post_text || "Post Facebook récupéré par dajee-bi."}
                      </p>

                      <div className="mt-6 grid grid-cols-3 gap-3">
                        <PostMetric
                          icon={Heart}
                          label="Réactions"
                          value={post.reactions_count}
                        />
                        <PostMetric
                          icon={MessageCircle}
                          label="Commentaires"
                          value={post.comments_count}
                        />
                        <PostMetric
                          icon={Share2}
                          label="Partages"
                          value={post.shares_count}
                        />
                      </div>

                      <div className="mt-6 flex items-center justify-between rounded-2xl bg-black px-5 py-4 text-white transition group-hover:bg-blue-700">
                        <span className="text-sm font-black">
                          Voir sur Facebook
                        </span>
                        <ArrowUpRight size={18} />
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function HeroMetric({
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
      whileHover={{ y: -6, scale: 1.03 }}
      className="rounded-3xl bg-white/10 p-4 backdrop-blur-xl sm:p-5"
    >
      <Icon className="mb-3 text-white" size={22} />
      <p className="text-xs text-white/60">{label}</p>
      <p className="mt-2 text-2xl font-black sm:text-3xl">
        {formatNumber(value)}
      </p>
    </motion.div>
  );
}

function PostMetric({
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