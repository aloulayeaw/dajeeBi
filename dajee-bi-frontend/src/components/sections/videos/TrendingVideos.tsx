"use client";

import { useEffect, useMemo, useState } from "react";
import KeywordComparisonChart from "@/components/charts/KeywordComparisonChart";
import { motion } from "framer-motion";
import {
  Eye,
  Heart,
  MessageCircle,
  PlayCircle,
  Search,
  TrendingUp,
  Users,
  BarChart3,
  Flame,
} from "lucide-react";
import { fetchYoutubeVideos } from "@/lib/api";

type YoutubeVideo = {
  id: string;
  channel_id: string | null;
  channel_name: string;
  youtube_video_id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
  published_at: string;
  views: number;
  likes: number;
  comments: number;
  keyword: string;
};

const quickKeywords = [
  "Ousmane Sonko",
  "Bassirou Diomaye Faye",
  "El Malick Ndiaye",
  "nouveau gouvernement du senegal",
  "Al Amine lo",
];

function formatNumber(value: number) {
  const num = Number(value || 0);

  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;

  return new Intl.NumberFormat("fr-FR").format(num);
}

function getDominantChannel(videos: YoutubeVideo[]) {
  const map = new Map<string, { views: number; count: number }>();

  videos.forEach((video) => {
    const current = map.get(video.channel_name) || { views: 0, count: 0 };

    map.set(video.channel_name, {
      views: current.views + Number(video.views || 0),
      count: current.count + 1,
    });
  });

  return [...map.entries()]
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.views - a.views)[0];
}

export default function TrendingVideos() {
  const [keyword, setKeyword] = useState("Ousmane Sonko");
  const [search, setSearch] = useState("Ousmane Sonko");
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVideos() {
      try {
        setLoading(true);
        const data = await fetchYoutubeVideos(keyword);
        setVideos(data);
      } catch (error) {
        console.error("Erreur vidéos:", error);
      } finally {
        setLoading(false);
      }
    }

    loadVideos();
  }, [keyword]);

  const totalViews = useMemo(
    () => videos.reduce((acc, item) => acc + Number(item.views || 0), 0),
    [videos]
  );

  const totalLikes = useMemo(
    () => videos.reduce((acc, item) => acc + Number(item.likes || 0), 0),
    [videos]
  );

  const totalComments = useMemo(
    () => videos.reduce((acc, item) => acc + Number(item.comments || 0), 0),
    [videos]
  );

  const dominantChannel = useMemo(() => getDominantChannel(videos), [videos]);

  const engagementRate = useMemo(() => {
    if (!totalViews) return 0;
    return (((totalLikes + totalComments) / totalViews) * 100).toFixed(2);
  }, [totalLikes, totalComments, totalViews]);

  const topVideo = videos[0];

  return (
    <section className="relative overflow-hidden bg-[#f8fafc] py-24">
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-green-400/20 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-red-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-red-600">
              Vidéos tendances
            </p>

            <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight text-neutral-950 md:text-7xl">
              Analyse YouTube autour de{" "}
              <span className="text-green-700">{keyword}</span>.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
              Classement des vidéos publiées par les chaînes suivies par
              dajee-bi sur les 7 derniers jours, triées par nombre de vues.
            </p>
          </div>

          <div className="rounded-[2rem] border border-black/5 bg-white p-5 shadow-xl shadow-black/5">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-neutral-500">Vidéos</p>
                <p className="text-2xl font-black">{videos.length}</p>
              </div>

              <div>
                <p className="text-xs text-neutral-500">Vues</p>
                <p className="text-2xl font-black text-green-700">
                  {formatNumber(totalViews)}
                </p>
              </div>

              <div>
                <p className="text-xs text-neutral-500">Likes</p>
                <p className="text-2xl font-black text-red-600">
                  {formatNumber(totalLikes)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setKeyword(search);
          }}
          className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-black/5 bg-white p-4 shadow-xl shadow-black/5 md:flex-row"
        >
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              size={18}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un mot-clé : Ousmane Sonko, Pastef..."
              className="w-full rounded-full border border-black/10 bg-neutral-50 py-4 pl-12 pr-5 text-sm font-bold outline-none transition focus:border-green-600"
            />
          </div>

          <button
            type="submit"
            className="rounded-full bg-green-700 px-8 py-4 text-sm font-black text-white transition hover:bg-green-800"
          >
            Analyser
          </button>
        </form>

        <div className="mb-12 flex flex-wrap gap-3">
          {quickKeywords.map((item) => (
            <button
              key={item}
              onClick={() => {
                setKeyword(item);
                setSearch(item);
              }}
              className={`rounded-full px-5 py-3 text-sm font-black transition hover:-translate-y-1 ${
                keyword === item
                  ? "bg-neutral-950 text-white"
                  : "bg-white text-neutral-700 shadow-lg shadow-black/5 hover:bg-green-50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* ================= ANALYSE AUTOMATIQUE ================= */}

        <section className="mb-14">
          <div className="mb-8">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-green-700">
              Analyse automatique
            </p>

            <h2 className="mt-4 text-4xl font-black text-neutral-950 md:text-5xl">
              Ce que les données racontent.
            </h2>
          </div>

          {loading ? (
            <div className="grid gap-6 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-64 animate-pulse rounded-[2rem] bg-white"
                />
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-xl shadow-black/5">
              <p className="font-bold text-neutral-600">
                Aucune donnée disponible pour analyser ce mot-clé.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 xl:grid-cols-3">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="rounded-[2rem] border border-black/5 bg-white p-7 shadow-2xl shadow-black/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-green-100 p-4 text-green-700">
                      <BarChart3 size={28} />
                    </div>

                    <div>
                      <p className="text-sm font-black uppercase text-green-700">
                        Média dominant
                      </p>

                      <h3 className="text-2xl font-black text-neutral-950">
                        {dominantChannel?.name || "Non détecté"}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-6 leading-8 text-neutral-600">
                    Ce média concentre le plus grand volume de vues sur le
                    mot-clé analysé durant la période observée.
                  </p>

                  <div className="mt-6 rounded-2xl bg-green-50 p-5">
                    <p className="text-xs text-neutral-500">Vues générées</p>

                    <p className="text-3xl font-black text-green-700">
                      {formatNumber(dominantChannel?.views || 0)}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-[2rem] border border-black/5 bg-white p-7 shadow-2xl shadow-black/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-red-100 p-4 text-red-600">
                      <Flame size={28} />
                    </div>

                    <div>
                      <p className="text-sm font-black uppercase text-red-600">
                        Vidéo dominante
                      </p>

                      <h3 className="text-2xl font-black text-neutral-950">
                        {formatNumber(topVideo?.views || 0)} vues
                      </h3>
                    </div>
                  </div>

                  <p className="mt-6 line-clamp-4 leading-8 text-neutral-600">
                    {topVideo?.title}
                  </p>

                  <div className="mt-6 rounded-2xl bg-red-50 p-5">
                    <p className="text-xs text-neutral-500">Chaîne</p>

                    <p className="text-xl font-black text-red-600">
                      {topVideo?.channel_name}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-[2rem] border border-black/5 bg-white p-7 shadow-2xl shadow-black/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-yellow-100 p-4 text-yellow-700">
                      <Users size={28} />
                    </div>

                    <div>
                      <p className="text-sm font-black uppercase text-yellow-700">
                        Engagement
                      </p>

                      <h3 className="text-2xl font-black text-neutral-950">
                        {engagementRate}%
                      </h3>
                    </div>
                  </div>

                  <p className="mt-6 leading-8 text-neutral-600">
                    Ce taux est calculé à partir des likes et commentaires
                    rapportés au volume total de vues.
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-yellow-50 p-5">
                      <p className="text-xs text-neutral-500">Likes</p>

                      <p className="text-2xl font-black text-yellow-700">
                        {formatNumber(totalLikes)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-neutral-100 p-5">
                      <p className="text-xs text-neutral-500">Commentaires</p>

                      <p className="text-2xl font-black text-neutral-950">
                        {formatNumber(totalComments)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-8 rounded-[2.5rem] bg-neutral-950 p-8 text-white shadow-2xl shadow-black/20"
              >
                <p className="text-sm font-black uppercase tracking-[0.3em] text-green-400">
                  Conclusion dajee-bi
                </p>

                <p className="mt-5 text-lg leading-9 text-white/70">
                  Sur les 7 derniers jours, les vidéos liées à{" "}
                  <span className="font-black text-white">{keyword}</span>{" "}
                  totalisent{" "}
                  <span className="font-black text-green-400">
                    {formatNumber(totalViews)}
                  </span>{" "}
                  vues sur les chaînes suivies par dajee-bi. Le média dominant
                  est{" "}
                  <span className="font-black text-white">
                    {dominantChannel?.name || "non détecté"}
                  </span>
                  , tandis que la vidéo la plus visible atteint{" "}
                  <span className="font-black text-red-400">
                    {formatNumber(topVideo?.views || 0)}
                  </span>{" "}
                  vues. Ces indicateurs reflètent uniquement l’activité publique
                  observée sur YouTube.
                </p>
              </motion.div>
            </>
          )}
        </section>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-[420px] animate-pulse rounded-[2rem] bg-white"
              />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="rounded-[2rem] border border-black/5 bg-white p-10 text-center shadow-xl shadow-black/5">
            <TrendingUp className="mx-auto mb-4 text-yellow-600" size={42} />

            <h3 className="text-2xl font-black">Aucune vidéo trouvée</h3>

            <p className="mt-3 text-neutral-600">
              Re-Lance la recherche.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {videos.map((video, index) => (
              <motion.a
                key={video.id}
                href={video.video_url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-2xl shadow-black/10"
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                  <div className="absolute left-4 top-4 rounded-full bg-red-600 px-4 py-2 text-sm font-black text-white">
                    #{index + 1}
                  </div>

                  <div className="absolute right-4 top-4 rounded-full bg-black/70 px-4 py-2 text-sm font-black text-white backdrop-blur-xl">
                    {formatNumber(video.views)} vues
                  </div>

                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-sm font-black text-green-400">
                      {video.channel_name}
                    </p>

                    <h3 className="mt-2 line-clamp-2 text-2xl font-black text-white">
                      {video.title}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 p-5">
                  <div className="rounded-2xl bg-green-50 p-4">
                    <Eye className="mb-2 text-green-700" size={18} />

                    <p className="text-xs text-neutral-500">Vues</p>

                    <p className="font-black text-green-700">
                      {formatNumber(video.views)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-red-50 p-4">
                    <Heart className="mb-2 text-red-600" size={18} />

                    <p className="text-xs text-neutral-500">Likes</p>

                    <p className="font-black text-red-600">
                      {formatNumber(video.likes)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-yellow-50 p-4">
                    <MessageCircle
                      className="mb-2 text-yellow-700"
                      size={18}
                    />

                    <p className="text-xs text-neutral-500">Comments</p>

                    <p className="font-black text-yellow-700">
                      {formatNumber(video.comments)}
                    </p>
                  </div>
                </div>

                <div className="mx-5 mb-5 flex items-center justify-between rounded-2xl bg-neutral-950 p-4 text-white transition group-hover:bg-red-600">
                  <div className="flex items-center gap-3">
                    <PlayCircle className="text-red-400 group-hover:text-white" />

                    <div>
                      <p className="text-xs text-white/50">Voir la vidéo</p>

                      <p className="font-black">YouTube</p>
                    </div>
                  </div>

                  <span className="text-sm font-black">
                    {new Date(video.published_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        )}

        <KeywordComparisonChart />
      </div>
    </section>
  );
}