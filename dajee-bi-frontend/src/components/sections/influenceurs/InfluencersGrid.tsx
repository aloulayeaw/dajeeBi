"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  // FaXTwitter,
} from "react-icons/fa6";
import { fetchInfluencers } from "@/lib/api";

type Influencer = {
  id: string;
  full_name: string;
  slug: string;
  category: string;
  role: string;
  political_party: string;
  country: string;
  photo_url: string;

  facebook_url: string;
  instagram_url: string;
  x_url: string;
  youtube_url: string;

  facebook_followers: number;
  instagram_followers: number;
  x_followers: number;
  youtube_subscribers: number;

  facebook_score: number;
  instagram_score: number;
  x_score: number;
  youtube_score: number;

  influence_score: number;
  buzz_score: number;
  engagement_score: number;
  live_score: number;
  global_score: number;
};

export default function InfluencersGrid() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadInfluencers() {
      const data = await fetchInfluencers();
      setInfluencers(data);
    }

    loadInfluencers();
  }, []);

  const filtered = useMemo(() => {
    return influencers.filter((item) =>
      item.full_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [influencers, search]);

  function formatNumber(value: number) {
    const num = Number(value || 0);

    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;

    return new Intl.NumberFormat("fr-FR").format(num);
    }

  return (
    <section className="relative overflow-hidden bg-[#f8fafc] py-24">
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-green-400/20 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-red-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-green-700">
              Influenceurs
            </p>

            <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight text-neutral-950 md:text-7xl">
              Classement des personnalités suivies par dajee-bi.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
              Suivi des personnalités politiques, médias, sportives et
              publiques sur plusieurs plateformes sociales.
            </p>
          </div>

          <div className="rounded-[2rem] border border-black/5 bg-white p-5 shadow-xl shadow-black/5">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-neutral-500">Influenceurs</p>
                <p className="text-2xl font-black">{influencers.length}</p>
              </div>

              <div>
                <p className="text-xs text-neutral-500">Catégories</p>
                <p className="text-2xl font-black text-green-700">Multi</p>
              </div>

              <div>
                <p className="text-xs text-neutral-500">Pays</p>
                <p className="text-2xl font-black text-red-600">SN</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10 flex flex-col gap-4 rounded-[2rem] border border-black/5 bg-white p-4 shadow-xl shadow-black/5 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              size={18}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un influenceur..."
              className="w-full rounded-full border border-black/10 bg-neutral-50 py-4 pl-12 pr-5 text-sm font-bold outline-none transition focus:border-green-600"
            />
          </div>

          <div className="rounded-full bg-green-700 px-6 py-4 text-sm font-black text-white">
            Données multi-plateformes
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ y: -10 }}
              className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-2xl shadow-black/10"
            >
              <div className="relative bg-neutral-950 p-6 text-white">
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-green-500/20 blur-3xl" />

                <div className="relative z-10 flex items-center gap-4">
                  <div className="h-20 w-20 overflow-hidden rounded-full bg-white">
                    {item.photo_url ? (
                      <img
                        src={item.photo_url}
                        alt={item.full_name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-green-100 text-2xl font-black text-green-700">
                        {item.full_name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl font-black">{item.full_name}</h3>
                    <p className="mt-1 text-sm text-white/60">{item.role}</p>
                  </div>
                </div>

                <div className="relative z-10 mt-5 flex flex-wrap gap-2">
                  {item.category && (
                    <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-black">
                      {item.category}
                    </span>
                  )}

                  {item.political_party && (
                    <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-black">
                      {item.political_party}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-blue-50 p-4">
                    <p className="text-xs text-neutral-500">Facebook</p>
                    <p className="text-2xl font-black text-blue-700">
                    {formatNumber(item.facebook_followers)}
                    </p>
                </div>

                <div className="rounded-2xl bg-pink-50 p-4">
                    <p className="text-xs text-neutral-500">Instagram</p>
                    <p className="text-2xl font-black text-pink-600">
                    {formatNumber(item.instagram_followers)}
                    </p>
                </div>

                <div className="rounded-2xl bg-neutral-100 p-4">
                    <p className="text-xs text-neutral-500">X / Twitter</p>
                    <p className="text-2xl font-black text-neutral-950">
                    {formatNumber(item.x_followers)}
                    </p>
                </div>

                <div className="rounded-2xl bg-red-50 p-4">
                    <p className="text-xs text-neutral-500">YouTube</p>
                    <p className="text-2xl font-black text-red-600">
                    {formatNumber(item.youtube_subscribers)}
                    </p>
                </div>
                </div>

                <div className="mt-5 rounded-2xl bg-neutral-950 p-5 text-white">
                <p className="text-xs text-white/50">Score global social</p>
                <p className="mt-2 text-4xl font-black text-green-400">
                    {Math.round(item.global_score)}/100
                </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {item.facebook_url && (
                    <a
                      href={item.facebook_url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-blue-50 p-3 text-blue-600"
                    >
                      <FaFacebookF size={18} />
                    </a>
                  )}

                  {item.instagram_url && (
                    <a
                      href={item.instagram_url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-pink-50 p-3 text-pink-600"
                    >
                      <FaInstagram size={18} />
                    </a>
                  )}

                  {item.youtube_url && (
                    <a
                      href={item.youtube_url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-red-50 p-3 text-red-600"
                    >
                      <FaYoutube size={18} />
                    </a>
                  )}

                  {item.x_url && (
                    <a
                      href={item.x_url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-neutral-100 px-4 py-3 text-sm font-black text-neutral-950"
                    >
                      X
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}