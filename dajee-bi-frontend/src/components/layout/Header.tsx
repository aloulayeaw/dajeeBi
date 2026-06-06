"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Bell, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/Logo";
import { brand } from "@/config/brand";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed left-0 right-0 top-0 z-[99999] border-b border-black/5 bg-white/95 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

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

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="relative z-[100000] rounded-full border border-black/10 bg-white p-3 lg:hidden"
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="fixed left-0 right-0 top-20 z-[99998] bg-white px-5 pb-6 pt-4 shadow-2xl lg:hidden"
          >
            <nav className="flex flex-col gap-2">
              {brand.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-5 py-4 text-lg font-black text-neutral-950 hover:bg-green-50 hover:text-green-700"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-5 grid gap-3">
              <button className="rounded-full border border-black/10 px-5 py-4 text-sm font-bold">
                Se connecter
              </button>

              <button className="rounded-full bg-green-700 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-green-700/20">
                Créer un compte
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}