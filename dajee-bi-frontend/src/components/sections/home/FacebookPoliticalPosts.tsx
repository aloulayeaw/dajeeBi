"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Heart,
  MessageCircle,
  Share2,
  Flame,
  ArrowUpRight,
  Trophy,
} from "lucide-react";

type FacebookPost = {
  leader_name: string;
  post_text: string;
  post_url: string;
  thumbnail_url: string;
  reactions_count: number;
  comments_count: number;
  shares_count: number;
  viral_score: number;
  published_at: string;
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

export default function FacebookPoliticalPosts({
  posts = [],
}: {
  posts?: FacebookPost[];
}) {
    const leaders = useMemo(() => {
    type LeaderStats = {
        leader_name: string;
        reactions: number;
        comments: number;
        shares: number;
        score: number;
        posts: FacebookPost[];
    };

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

        const item = map.get(post.leader_name)!;

        item.reactions += post.reactions_count || 0;
        item.comments += post.comments_count || 0;
        item.shares += post.shares_count || 0;
        item.score += post.viral_score || 0;
        item.posts.push(post);
    });

    return Array.from(map.values()).sort(
        (a, b) => b.score - a.score
    );
    }, [posts]);

  const [selected, setSelected] = useState(leaders[0]?.leader_name || "");

  const activeLeader =
    leaders.find((leader) => leader.leader_name === selected) || leaders[0];

  if (!leaders.length) {
    return (
      <section className="bg-[#f8fafc] py-20">
        <div className="mx-auto max-w-7xl px-5 text-center text-neutral-500">
          Aucune donnée Facebook disponible.
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[#f8fafc] py-24">
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-green-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.25em] text-blue-700">
              <Flame size={18} />
              Influence Facebook
            </p>

            <h2 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-neutral-950 md:text-6xl">
              Le classement des leaders politiques les plus impactants.
            </h2>

            <p className="mt-4 max-w-2xl text-neutral-600">
              Classement basé sur les réactions, commentaires et partages des
              derniers posts Facebook collectés par dajee-bi.
            </p>
          </div>

          <button className="rounded-full bg-black px-6 py-4 text-sm font-black text-white shadow-xl transition hover:bg-blue-700">
            Voir tout le classement
          </button>
        </div>

        <div className="grid gap-7 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-700 via-blue-900 to-black p-7 text-white shadow-2xl shadow-blue-900/30"
          >
            <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-green-400/20 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-3 text-sm font-black text-black">
                <Trophy size={18} />
                Leader le plus impactant
              </div>

              <h3 className="text-4xl font-black">
                {leaders[0].leader_name}
              </h3>

              <p className="mt-2 text-white/70">
                Domine actuellement l’engagement Facebook politique.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="rounded-3xl bg-white/10 p-5">
                  <Heart className="mb-3 text-red-300" />
                  <p className="text-sm text-white/60">Réactions</p>
                  <p className="text-3xl font-black">
                    {formatNumber(leaders[0].reactions)}
                  </p>
                </div>

                <div className="rounded-3xl bg-white/10 p-5">
                  <MessageCircle className="mb-3 text-blue-300" />
                  <p className="text-sm text-white/60">Commentaires</p>
                  <p className="text-3xl font-black">
                    {formatNumber(leaders[0].comments)}
                  </p>
                </div>

                <div className="rounded-3xl bg-white/10 p-5">
                  <Share2 className="mb-3 text-green-300" />
                  <p className="text-sm text-white/60">Partages</p>
                  <p className="text-3xl font-black">
                    {formatNumber(leaders[0].shares)}
                  </p>
                </div>
              </div>

              <div className="mt-7 rounded-3xl bg-white p-6 text-black">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-black">Score d’impact global</p>
                  <p className="text-5xl font-black text-blue-700">
                    {Math.round(leaders[0].score)}
                  </p>
                </div>

                <div className="mt-5 h-4 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-green-500"
                    style={{
                      width: `${Math.min(leaders[0].score / 800, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <div className="rounded-[2.5rem] border border-black/5 bg-white p-6 shadow-2xl shadow-black/5">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-2xl font-black text-neutral-950">
                Classement général
              </h3>

              <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-700">
                Top {leaders.length}
              </span>
            </div>

            <div className="space-y-3">
              {leaders.map((leader, index) => (
                <button
                  key={leader.leader_name}
                  onClick={() => setSelected(leader.leader_name)}
                  className={`w-full rounded-3xl border p-4 text-left transition ${
                    activeLeader?.leader_name === leader.leader_name
                      ? "border-blue-600 bg-blue-50"
                      : "border-black/5 bg-white hover:-translate-y-1 hover:bg-neutral-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full font-black text-white ${
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

                    <div className="flex-1">
                      <p className="font-black text-neutral-950">
                        {leader.leader_name}
                      </p>

                      <p className="text-sm text-neutral-500">
                        {formatNumber(leader.reactions)} réactions •{" "}
                        {formatNumber(leader.comments)} commentaires •{" "}
                        {formatNumber(leader.shares)} partages
                      </p>
                    </div>

                    <div className="rounded-2xl bg-black px-4 py-2 text-lg font-black text-white">
                      {Math.round(leader.score)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {activeLeader && (
          <div className="mt-10 rounded-[2.5rem] border border-black/5 bg-white p-6 shadow-2xl shadow-black/5">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-700">
                  Derniers contenus
                </p>

                <h3 className="mt-2 text-3xl font-black text-neutral-950">
                  {activeLeader.leader_name}
                </h3>
              </div>

              <span className="rounded-full bg-neutral-950 px-5 py-3 text-sm font-black text-white">
                3 derniers posts
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {activeLeader.posts.slice(0, 3).map((post: FacebookPost, i: number) => (
                <motion.a
                  key={`${post.post_url}-${i}`}
                  href={post.post_url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="group overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-xl shadow-black/5 transition hover:-translate-y-2"
                >
                  <div className="relative h-48 bg-gradient-to-br from-blue-50 to-green-50">
                    {isValidImageUrl(post.thumbnail_url) ? (
                      <Image
                        src={post.thumbnail_url}
                        alt={post.leader_name}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <BadgeCheck size={56} className="text-blue-600" />
                      </div>
                    )}

                    <div className="absolute left-4 top-4 rounded-full bg-blue-600 px-4 py-2 text-xs font-black text-white">
                      Facebook
                    </div>

                    <div className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-black text-red-600 shadow-lg">
                      Score {Math.round(post.viral_score)}
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="line-clamp-4 min-h-[96px] text-sm leading-6 text-neutral-600">
                      {post.post_text || "Post Facebook récupéré par dajee-bi."}
                    </p>

                    <div className="mt-5 grid grid-cols-3 gap-3">
                      <div className="rounded-2xl bg-red-50 p-3 text-center">
                        <Heart className="mx-auto text-red-500" size={18} />
                        <p className="mt-1 text-xs text-neutral-500">
                          Réactions
                        </p>
                        <p className="font-black">
                          {formatNumber(post.reactions_count)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-blue-50 p-3 text-center">
                        <MessageCircle
                          className="mx-auto text-blue-600"
                          size={18}
                        />
                        <p className="mt-1 text-xs text-neutral-500">
                          Commentaires
                        </p>
                        <p className="font-black">
                          {formatNumber(post.comments_count)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-green-50 p-3 text-center">
                        <Share2 className="mx-auto text-green-700" size={18} />
                        <p className="mt-1 text-xs text-neutral-500">
                          Partages
                        </p>
                        <p className="font-black">
                          {formatNumber(post.shares_count)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between rounded-2xl bg-black px-4 py-3 text-white">
                      <span className="text-sm font-bold">
                        Voir sur Facebook
                      </span>
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}