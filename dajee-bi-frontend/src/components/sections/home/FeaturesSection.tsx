"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Bell,
  BrainCircuit,
  Radio,
  TrendingUp,
  Users,
} from "lucide-react";

const features = [
  {
    title: "Tendances & Buzz",
    description:
      "Détection intelligente des sujets qui explosent au Sénégal.",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-700",
  },
  {
    title: "Live Monitoring",
    description:
      "Suivi des Web TV, radios et lives en temps réel.",
    icon: Radio,
    color: "from-red-500 to-orange-500",
  },
  {
    title: "Influence Tracking",
    description:
      "Analyse des influenceurs et personnalités publiques.",
    icon: Users,
    color: "from-yellow-400 to-orange-500",
  },
  {
    title: "Alertes",
    description:
      "Recevez des alertes dès qu’un buzz démarre.",
    icon: Bell,
    color: "from-purple-500 to-fuchsia-600",
  },
  {
    title: "Analyse intelligente",
    description:
      "IA africaine entraînée sur les médias locaux.",
    icon: BrainCircuit,
    color: "from-cyan-500 to-blue-600",
  },
  {
    title: "Monitoring global",
    description:
      "Vision complète des données médias du pays.",
    icon: Activity,
    color: "from-lime-400 to-green-700",
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-[#030712] py-24">
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-green-500/20 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-yellow-500/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-black uppercase tracking-[0.3em] text-green-400">
            Intelligence média africaine
          </p>

          <h2 className="mt-5 text-4xl font-black leading-tight text-white md:text-6xl">
            Tout ce qu’il faut pour surveiller les médias sénégalais.
          </h2>

          <p className="mt-6 text-lg leading-8 text-neutral-400">
            dajee-bi centralise les lives, tendances, influenceurs,
            audiences et analyses dans une seule plateforme moderne.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-7 backdrop-blur-xl"
            >
              <div
                className={`mb-6 inline-flex rounded-2xl bg-gradient-to-r ${feature.color} p-4 shadow-xl`}
              >
                <feature.icon className="text-white" size={28} />
              </div>

              <h3 className="text-2xl font-black text-white">
                {feature.title}
              </h3>

              <p className="mt-4 leading-7 text-neutral-400">
                {feature.description}
              </p>

              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-green-500/10 blur-3xl transition-all duration-500 group-hover:scale-150" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}



// "use client";

// import { motion } from "framer-motion";
// import {
//   TrendingUp,
//   Radio,
//   Users,
//   BarChart3,
//   Bell,
//   Brain,
//   ArrowRight,
// } from "lucide-react";

// const features = [
//   {
//     title: "Tendances & mots-clés",
//     text: "Suivez les sujets qui font parler le Sénégal en temps réel.",
//     icon: TrendingUp,
//     color: "bg-green-600",
//   },
//   {
//     title: "Live Monitoring",
//     text: "Analysez les lives, viewers, pics d’audience et engagements.",
//     icon: Radio,
//     color: "bg-red-600",
//   },
//   {
//     title: "Influence Tracking",
//     text: "Identifiez les personnalités qui montent et leur impact digital.",
//     icon: Users,
//     color: "bg-yellow-500",
//   },
//   {
//     title: "Médias en haut",
//     text: "Classement des Web TV, chaînes et médias les plus performants.",
//     icon: BarChart3,
//     color: "bg-green-700",
//   },
//   {
//     title: "Alertes intelligentes",
//     text: "Recevez les signaux importants dès qu’un sujet explose.",
//     icon: Bell,
//     color: "bg-purple-600",
//   },
//   {
//     title: "Détection",
//     text: "Détectez les anomalies, buzz soudains et comportements suspects.",
//     icon: Brain,
//     color: "bg-blue-600",
//   },
// ];

// export default function FeaturesSection() {
//   return (
//     <section className="relative bg-neutral-950 py-20 text-white">
//       <div className="mx-auto max-w-7xl px-5 md:px-8">
//         <div className="mb-12 text-center">
//           <p className="text-sm font-bold uppercase tracking-[0.3em] text-yellow-400">
//             Tout ce qu’il faut pour garder une longueur d’avance
//           </p>

//           <h2 className="mt-4 text-4xl font-black md:text-5xl">
//             Une plateforme pensée pour les médias,
//             <span className="text-green-400"> les datas </span>
//             et l’influence.
//           </h2>
//         </div>

//         <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
//           {features.map((item, index) => (
//             <motion.div
//               key={item.title}
//               initial={{ opacity: 0, y: 35 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.45, delay: index * 0.08 }}
//               viewport={{ once: true }}
//               whileHover={{ y: -8, scale: 1.02 }}
//               className="group rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl transition hover:bg-white/10"
//             >
//               <div
//                 className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${item.color} shadow-lg`}
//               >
//                 <item.icon size={26} />
//               </div>

//               <h3 className="text-xl font-black">{item.title}</h3>

//               <p className="mt-3 leading-7 text-white/60">{item.text}</p>

//               <div className="mt-6 flex items-center gap-2 text-sm font-bold text-green-400 opacity-0 transition group-hover:opacity-100">
//                 Explorer <ArrowRight size={16} />
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }