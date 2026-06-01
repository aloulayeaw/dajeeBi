"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Radio,
  TrendingUp,
  ShieldCheck,
  Globe2,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#020617] text-white">
      <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-green-500/20 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-yellow-500/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-12 rounded-[2.5rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-green-400">
                Plateforme média & analytics
              </p>

              <h2 className="mt-4 max-w-3xl font-heading text-4xl font-black leading-tight md:text-5xl">
                L’intelligence média au service du Sénégal et de l’Afrique.
              </h2>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/60">
                dajee-bi rassemble les Web TV, les tendances, les lives, les
                personnalités publiques et les données sociales dans une seule
                plateforme claire, locale et intelligente.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Données locales", icon: Globe2 },
                { label: "Temps réel", icon: Radio },
                { label: "Tendances", icon: TrendingUp },
                { label: "Fiable & sécurisé", icon: ShieldCheck },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-white/10 bg-black/30 p-5"
                >
                  <item.icon className="mb-3 text-green-400" />
                  <p className="font-bold">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-4">
          <div className="md:col-span-1">
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
          </div>

          <div>
            <h3 className="font-black text-white">Navigation</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/60">
              {["Accueil", "Tendances", "Live", "Médias", "Analyses"].map(
                (item) => (
                  <li key={item}>
                    <Link href="#" className="transition hover:text-green-400">
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-black text-white">Plateforme</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/60">
              {[
                "Web TV Monitoring",
                "Influence Tracking",
                "Alertes intelligentes",
                "Rapports",
                "API Data",
              ].map((item) => (
                <li key={item}>
                  <Link href="#" className="transition hover:text-green-400">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-black text-white">Suivez dajee-bi</h3>

            <div className="mt-5 flex gap-3">
              {["FB", "IG", "YT", "IN"].map((item, index) => (
                <button
                    key={index}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-green-600"
                    >
                    {item}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-green-500/20 bg-green-500/10 p-5">
              <p className="text-sm font-bold text-green-400">
                🇸🇳 Pensé au Sénégal
              </p>
              <p className="mt-2 text-sm text-white/60">
                Conçu pour comprendre les médias et tendances d’Afrique de
                l’Ouest.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-sm text-white/50 md:flex-row">
          <p>© 2026 dajee-bi. Tous droits réservés.</p>

          <div className="flex gap-6">
            <Link href="#" className="hover:text-green-400">
              Mentions légales
            </Link>
            <Link href="#" className="hover:text-green-400">
              Confidentialité
            </Link>
            <Link href="#" className="hover:text-green-400">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}