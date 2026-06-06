"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Radio,
  TrendingUp,
  ShieldCheck,
  Globe2,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0 },
};

export default function Footer() {
  const features = [
    { label: "Données locales", icon: Globe2 },
    { label: "Temps réel", icon: Radio },
    { label: "Tendances", icon: TrendingUp },
    { label: "Fiable & sécurisé", icon: ShieldCheck },
  ];

  const navigation = [
    { label: "Accueil", href: "/" },
    { label: "Tendances", href: "/tendances" },
    { label: "Live", href: "/live" },
    { label: "Médias", href: "/medias" },
    { label: "Analyses", href: "/analyses" },
  ];

  const platform = [
    "Web TV Monitoring",
    "Influence Tracking",
    "Alertes intelligentes",
    "Rapports",
    "API Data",
  ];

  return (
    <footer className="relative overflow-hidden bg-[#020617] text-white">
      <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-green-500/20 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-yellow-500/10 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-16 md:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-12 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-green-950/20 backdrop-blur-xl md:rounded-[2.5rem] md:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-sm font-black uppercase tracking-[0.3em] text-green-400"
              >
                Plateforme média & analytics
              </motion.p>

              <h2 className="mt-4 max-w-3xl font-heading text-3xl font-black leading-tight md:text-5xl">
                L’intelligence média au service du Sénégal et de l’Afrique.
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-8 text-white/60 md:text-lg">
                dajee-bi rassemble les Web TV, les tendances, les lives, les
                personnalités publiques et les données sociales dans une seule
                plateforme claire, locale et intelligente.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group rounded-3xl border border-white/10 bg-black/30 p-5 transition-all duration-300 hover:border-green-400/40 hover:bg-green-500/10"
                >
                  <item.icon className="mb-3 text-green-400 transition group-hover:scale-110" />
                  <p className="font-bold">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid gap-10 border-b border-white/10 pb-10 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Image
              src="/logo.png"
              alt="dajee-bi"
              width={150}
              height={80}
              className="h-auto w-[150px]"
            />

            <p className="mt-5 text-sm leading-7 text-white/60">
              La plateforme qui connecte les médias, les tendances et
              l’influence digitale africaine.
            </p>

            <div className="mt-6 flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm font-bold text-green-400">
              <MapPin size={17} />
              Sénégal / Afrique de l’Ouest
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="font-black text-white">Navigation</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/60">
              {navigation.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 transition hover:text-green-400"
                  >
                    {item.label}
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="font-black text-white">Plateforme</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/60">
              {platform.map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="group inline-flex items-center gap-2 transition hover:text-green-400"
                  >
                    {item}
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="font-black text-white">Contact</h3>

            <div className="mt-5 space-y-3">
              <Link
                href="mailto:mamerane1003@gmail.com"
                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 transition hover:border-green-400/40 hover:bg-green-500/10 hover:text-green-400"
              >
                <Mail size={18} />
                <span className="break-all">mamerane1003@gmail.com</span>
              </Link>

              <Link
                href="tel:0767166903"
                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 transition hover:border-green-400/40 hover:bg-green-500/10 hover:text-green-400"
              >
                <Phone size={18} />
                <span>0767166903</span>
              </Link>
            </div>

            <h3 className="mt-7 font-black text-white">Suivez dajee-bi</h3>

            <div className="mt-4 flex flex-wrap gap-3">
              {["FB", "IG", "YT", "IN"].map((item) => (
                <motion.button
                  key={item}
                  whileHover={{ y: -5, scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-black text-white transition hover:bg-green-600"
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mt-8 rounded-3xl border border-green-500/20 bg-green-500/10 p-5"
        >
          <p className="text-sm font-bold text-green-400">
            🇸🇳 Pensé au Sénégal
          </p>
          <p className="mt-2 text-sm leading-7 text-white/60">
            Conçu pour comprendre les médias, les lives, les tendances et
            l’influence digitale d’Afrique de l’Ouest.
          </p>
        </motion.div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-center text-sm text-white/50 md:flex-row md:text-left">
          <p>© 2026 dajee-bi. Tous droits réservés.</p>

          <div className="flex flex-wrap justify-center gap-5">
            <Link href="#" className="transition hover:text-green-400">
              Mentions légales
            </Link>
            <Link href="#" className="transition hover:text-green-400">
              Confidentialité
            </Link>
            <Link href="mailto:mamerane1003@gmail.com" className="transition hover:text-green-400">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}