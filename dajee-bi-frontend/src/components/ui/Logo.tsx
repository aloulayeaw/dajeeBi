import Image from "next/image";
import { brand } from "@/config/brand";

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/logo.png"
        alt="dajee-bi logo"
        width={70}
        height={70}
        priority
        className="h-auto w-auto object-contain"
      />

      {/* <div>
        <h1 className="text-2xl font-black tracking-tight text-black">
          dajee-<span className="text-green-600">bi</span>
        </h1>

        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-black">
          {brand.slogan}
        </p>
      </div> */}
    </div>
  );
}