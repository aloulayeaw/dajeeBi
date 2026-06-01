"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DataPoint = {
  date: string;
  subscribers: number;
  views: number;
  videos: number;
};

export default function ChannelGrowthChart({ data }: { data: DataPoint[] }) {
  return (
    <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-xl shadow-black/5">
      <div className="mb-6">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-green-700">
          Évolution
        </p>
        <h3 className="text-2xl font-black text-neutral-950">
          Croissance abonnés & vues
        </h3>
      </div>

      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="subsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />

            <Area
              type="monotone"
              dataKey="subscribers"
              stroke="#16a34a"
              strokeWidth={4}
              fill="url(#subsGradient)"
            />

            <Area
              type="monotone"
              dataKey="views"
              stroke="#f59e0b"
              strokeWidth={3}
              fill="url(#viewsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}