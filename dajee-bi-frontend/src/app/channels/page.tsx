import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import YoutubeChannelsFromApi from "@/components/sections/live/YoutubeChannelsFromApi";
import { Radio, BarChart3, TrendingUp } from "lucide-react";

export default function ChannelsPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f8fafc]">
        <section className="relative overflow-hidden bg-white py-20">
          <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-green-400/20 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-yellow-300/20 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-green-700">
              Médias & chaînes
            </p>

            <h1 className="mt-5 max-w-4xl font-heading text-5xl font-black leading-tight text-neutral-950 md:text-7xl">
              Le classement digital des médias sénégalais.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
              Retrouvez les chaînes TV et Web TV suivies par dajee-bi, avec
              leurs abonnés, vues, vidéos et performances YouTube.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/live"
                className="rounded-full bg-green-700 px-6 py-4 text-sm font-black text-white transition hover:bg-green-800"
              >
                Voir les lives
              </Link>

              <Link
                href="/analyses"
                className="rounded-full border border-black/10 bg-white px-6 py-4 text-sm font-black text-neutral-950 transition hover:bg-neutral-100"
              >
                Voir les analyses
              </Link>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {[
                {
                  title: "Classement",
                  text: "Tri par abonnés, vues et vidéos.",
                  icon: BarChart3,
                },
                {
                  title: "Croissance",
                  text: "Suivi de l’évolution dans le temps.",
                  icon: TrendingUp,
                },
                {
                  title: "Live",
                  text: "Connexion avec les directs actifs.",
                  icon: Radio,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-xl shadow-black/5"
                >
                  <item.icon className="mb-4 text-green-700" />
                  <h3 className="text-2xl font-black">{item.title}</h3>
                  <p className="mt-2 text-neutral-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <YoutubeChannelsFromApi />
      </main>

      <Footer />
    </>
  );
}