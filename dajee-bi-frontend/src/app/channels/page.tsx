import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import YoutubeChannelsFromApi from "@/components/sections/live/YoutubeChannelsFromApi";
import ScrollToTop from "@/components/ui/ScrollToTop";
import WhatsAppMe from "@/components/ui/WhatsAppMe";

import {
  ArrowUpRight,
  BarChart3,
  Eye,
  Radio,
  Sparkles,
  TrendingUp,
  Bird,
} from "lucide-react";

export default function ChannelsPage() {
  const features = [
    {
      title: "Classement intelligent",
      text: "Compare les médias selon leurs abonnés, vues et vidéos.",
      icon: BarChart3,
    },
    {
      title: "Performance digitale",
      text: "Analyse la puissance numérique des chaînes sénégalaises.",
      icon: TrendingUp,
    },
    {
      title: "Lives en direct",
      text: "Repère rapidement les chaînes actuellement en live.",
      icon: Radio,
    },
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f8fafc]">
        <section className="relative overflow-hidden bg-white pt-28 pb-20">
          <div className="pointer-events-none absolute -left-32 top-0 h-[520px] w-[520px] rounded-full bg-emerald-300/30 blur-[120px]" />
          <div className="pointer-events-none absolute -right-32 bottom-0 h-[520px] w-[520px] rounded-full bg-yellow-200/50 blur-[120px]" />
          <div className="pointer-events-none absolute left-1/2 top-20 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-red-200/30 blur-[120px]" />

          <div className="relative z-10 mx-auto max-w-[1500px] px-5 md:px-8">
            <div className="grid items-center gap-12 xl:grid-cols-[1.1fr_0.9fr]">
              <div>
                <div className="inline-flex items-center gap-3 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-700">
                  <Sparkles size={15} />
                  Médias & chaînes
                </div>

                <h1 className="mt-6 max-w-5xl font-heading text-5xl font-black leading-tight text-slate-950 md:text-7xl">
                  Le classement digital des{" "}
                  <span className="bg-gradient-to-r from-emerald-700 via-yellow-500 to-red-600 bg-clip-text text-transparent">
                    médias sénégalais
                  </span>
                  .
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                  Retrouvez les chaînes TV et Web TV suivies par dajee-bi, avec
                  leurs abonnés, vues, vidéos et performances YouTube.
                </p>

                <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/live"
                    className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-emerald-700 px-7 py-5 text-sm font-black text-white shadow-xl shadow-emerald-200 transition hover:-translate-y-1 hover:bg-slate-950"
                  >
                    Voir les lives
                    <ArrowUpRight
                      size={18}
                      className="transition group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </Link>

                  <Link
                    href="/analyses"
                    className="inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-7 py-5 text-sm font-black text-slate-950 shadow-xl shadow-slate-200/70 transition hover:-translate-y-1 hover:bg-slate-950 hover:text-white"
                  >
                    Voir les analyses
                    <BarChart3 size={18} />
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-r from-emerald-200 via-yellow-100 to-red-100 blur-2xl" />

                <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/80">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black text-slate-950">
                        Vue globale
                      </p>
                      <p className="text-xs text-slate-500">
                        Monitoring YouTube des médias
                      </p>
                    </div>

                    <div className="rounded-full bg-red-600 px-4 py-2 text-xs font-black text-white">
                      DATA
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      {
                        label: "Chaînes suivies",
                        value: "Web TV",
                        icon: Bird,
                        bg: "bg-red-50",
                        color: "text-red-600",
                      },
                      {
                        label: "Performances",
                        value: "Live",
                        icon: TrendingUp,
                        bg: "bg-emerald-50",
                        color: "text-emerald-700",
                      },
                      {
                        label: "Audience",
                        value: "Temps réel",
                        icon: Eye,
                        bg: "bg-blue-50",
                        color: "text-blue-700",
                      },
                      {
                        label: "Directs",
                        value: "Actifs",
                        icon: Radio,
                        bg: "bg-yellow-50",
                        color: "text-yellow-700",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[2rem] border border-slate-100 bg-slate-50 p-5"
                      >
                        <div className={`mb-4 w-fit rounded-2xl ${item.bg} p-3`}>
                          <item.icon className={item.color} size={22} />
                        </div>

                        <p className="text-2xl font-black text-slate-950">
                          {item.value}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-[2rem] bg-slate-950 p-5 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/50">
                          Signal actuel
                        </p>
                        <p className="mt-1 text-2xl font-black">
                          Médias sénégalais
                        </p>
                      </div>

                      <div className="relative flex h-14 w-14 items-center justify-center">
                        <span className="absolute h-full w-full animate-ping rounded-full bg-red-500/30" />
                        <span className="relative h-4 w-4 rounded-full bg-red-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {features.map((item) => (
                <div
                  key={item.title}
                  className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 transition hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 transition group-hover:bg-emerald-700">
                    <item.icon className="text-emerald-700 transition group-hover:text-white" />
                  </div>

                  <h3 className="text-2xl font-black text-slate-950">
                    {item.title}
                  </h3>

                  <p className="mt-2 leading-7 text-slate-600">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <YoutubeChannelsFromApi />
      </main>

      <ScrollToTop />
      <WhatsAppMe />
      <Footer />
    </>
  );
}