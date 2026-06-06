"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  PlayCircle,
  Radio,
  TrendingUp,
  Users,
  ShieldCheck,
  Newspaper,
  Video,
  Mic,
  Globe2,
  Wifi,
} from "lucide-react";

type HeroStats = {
  views: number;
  videos: number;
  channels: number;
  influencers: number;
};

function formatNumber(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

export default function HeroSection({ stats }: { stats?: HeroStats }) {
  const safeStats = [
    {
      label: "Vues analysées",
      value: formatNumber(stats?.views || 0),
      icon: TrendingUp,
    },
    {
      label: "Vidéos détectées",
      value: formatNumber(stats?.videos || 0),
      icon: Radio,
    },
    {
      label: "Médias suivis",
      value: formatNumber(stats?.channels || 0),
      icon: Users,
    },
    {
      label: "Influenceurs",
      value: formatNumber(stats?.influencers || 0),
      icon: ShieldCheck,
    },
  ];

  const mediaNodes = [
    {
      icon: Video,
      className: "left-[5%] top-[30%]",
      delay: 0,
    },
    {
      icon: Newspaper,
      className: "left-[18%] bottom-[18%]",
      delay: 0.4,
    },
    {
      icon: Mic,
      className: "right-[14%] top-[20%]",
      delay: 0.8,
    },
    {
      icon: Globe2,
      className: "right-[7%] bottom-[28%]",
      delay: 1.2,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute left-0 top-24 h-72 w-72 rounded-full bg-green-400/15 blur-3xl" />
      <div className="absolute right-0 top-16 h-80 w-80 rounded-full bg-yellow-400/20 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 md:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="relative z-10"
        >
          <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-extrabold text-green-700 shadow-sm">
            🇸🇳 Plateforme média & analytics du Sénégal
          </span>

          <h1 className="mt-8 max-w-3xl font-heading text-[34px] font-black leading-[1.05] tracking-[-0.04em] text-neutral-950 sm:text-[56px] lg:text-[64px] xl:text-[72px]">
            Le Sénégal en{" "}
            <span className="text-green-700">temps réel</span>, connecté aux
            médias et aux tendances.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-neutral-600 md:text-lg">
            dajee-bi surveille les Web TV, les lives, les tendances et
            l’influence digitale pour comprendre ce qui fait bouger le Sénégal
            et l’Afrique de l’Ouest.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="inline-flex items-center gap-2 rounded-full bg-green-700 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-green-700/20 transition hover:-translate-y-1 hover:bg-green-800">
              Explorer la plateforme <ArrowRight size={18} />
            </button>

            <button className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-4 text-sm font-bold shadow-md shadow-black/5 transition hover:-translate-y-1 hover:bg-neutral-50">
              Voir la démo{" "}
              <PlayCircle size={18} className="text-red-500" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, x: 25 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative z-10"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              relative mx-auto
              min-h-[340px]
              w-full
              sm:min-h-[420px]
              md:min-h-[520px]
              lg:min-h-[650px]
              "
          >
            <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-r from-green-400/20 via-yellow-300/20 to-red-400/10 blur-3xl" />

            <motion.div
              animate={{
                scale: [1, 1.03, 1],
                opacity: [0.45, 0.75, 0.45],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-[16%] top-[34%] h-52 w-52 rounded-full border border-green-400/30"
            />

            <motion.div
              animate={{
                scale: [1, 1.16, 1],
                opacity: [0.25, 0.55, 0.25],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-[12%] top-[28%] h-72 w-72 rounded-full border border-green-400/20"
            />

            <Image
              src="/images/backgrounds/slideHome001.png"
              alt="Carte Afrique connectée aux médias"
              width={1400}
              height={1100}
              priority
              className="relative z-10 h-[5 20px] w-full scale-110 object-contain object-center drop-shadow-2xl sm:h-[600px] lg:h-[680px]"
            />

            <svg
              className="pointer-events-none absolute inset-0 z-20 h-full w-full"
              viewBox="0 0 900 650"
              fill="none"
            >
              <motion.path
                d="M250 330 C 330 260, 450 285, 555 250"
                stroke="#16a34a"
                strokeWidth="2"
                strokeDasharray="8 8"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.9 }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />

              <motion.path
                d="M245 335 C 360 430, 515 410, 700 455"
                stroke="#22c55e"
                strokeWidth="2"
                strokeDasharray="8 8"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.75 }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: 0.4,
                }}
              />

              <motion.path
                d="M245 335 C 170 260, 130 220, 95 190"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="8 8"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.8 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: 0.8,
                }}
              />
            </svg>

            {mediaNodes.map((node, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  y: [0, -12, 0],
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  opacity: {
                    duration: 0.6,
                    delay: node.delay,
                  },
                  y: {
                    duration: 4 + index,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  scale: {
                    duration: 4 + index,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className={`absolute z-30 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-green-700 shadow-2xl shadow-green-900/10 ${node.className}`}
              >
                <node.icon size={30} />
              </motion.div>
            ))}

            <motion.div
              animate={{
                opacity: [0.7, 1, 0.7],
                scale: [1, 1.08, 1],
              }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-[34%] top-[47%] z-30 flex items-center gap-2 rounded-full bg-green-700 px-5 py-3 text-sm font-black text-white shadow-2xl shadow-green-700/30"
            >
              <Wifi size={16} />
              Connexion médias
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative z-20 mx-auto grid max-w-7xl gap-4 px-5 pb-10 md:grid-cols-4 md:px-8">
        {safeStats.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: index * 0.08,
            }}
            whileHover={{ y: -6 }}
            className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl shadow-black/5"
          >
            <item.icon className="mb-3 text-green-700" size={24} />

            <h3 className="text-3xl font-black">{item.value}</h3>

            <p className="text-sm text-neutral-500">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}