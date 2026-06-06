"use client";

import { useEffect, useState } from "react";
import { ChevronUp, MessageCircle } from "lucide-react";

export default function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* ========================= */}
      {/* WhatsApp Floating Button */}
      {/* ========================= */}

      <a
        href="https://wa.me/33767166903?text=Bonjour%20je%20vous%20contacte%20depuis%20dajee-bi"
        target="_blank"
        rel="noopener noreferrer"
        className="group fixed bottom-6 left-6 z-[99999]"
        aria-label="Contacter sur WhatsApp"
      >
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_35px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-110 hover:shadow-[0_15px_45px_rgba(37,211,102,0.6)]">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/30" />

          <MessageCircle
            size={30}
            className="relative z-10"
          />
        </div>

        <div className="pointer-events-none absolute left-20 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl border border-white/10 bg-[#020617]/95 px-4 py-2 text-sm font-semibold text-white opacity-0 shadow-xl backdrop-blur-xl transition-all duration-300 group-hover:opacity-100">
          💬 Contactez-nous
        </div>
      </a>

      {/* ========================= */}
      {/* Scroll To Top */}
      {/* ========================= */}

      <button
        onClick={scrollToTop}
        aria-label="Retour en haut"
        className={`fixed bottom-6 right-6 z-[99999] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-700 via-cyan-600 to-green-600 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-cyan-500/30 ${
          showScrollTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-10 opacity-0"
        }`}
      >
        <ChevronUp size={26} />
      </button>
    </>
  );
}