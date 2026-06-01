"use client";

import Link from "next/link";
import { Search, Bell, Menu } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";
import { brand } from "@/config/brand";

export default function Header() {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          {brand.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-neutral-800 transition hover:text-green-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button className="rounded-full border border-black/10 p-3 transition hover:bg-neutral-100">
            <Search size={18} />
          </button>

          <button className="relative rounded-full border border-black/10 p-3 transition hover:bg-neutral-100">
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <button className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold">
            Se connecter
          </button>

          <button className="rounded-full bg-green-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-700/20 transition hover:bg-green-800">
            Créer un compte
          </button>
        </div>

        <button className="rounded-full border border-black/10 p-3 lg:hidden">
          <Menu size={20} />
        </button>
      </div>
    </motion.header>
  );
}