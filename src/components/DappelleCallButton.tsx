"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

const phoneNumber = "+2250710701212" as const;
const formattedPhoneNumber = "+225 07 10 70 12 12" as const;

export function DappelleCallButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const showNumber = isHovered || isFocused;

  const telHref = useMemo(() => `tel:${phoneNumber}`, []);

  const handleClick = () => {
    if (typeof window !== "undefined") {
      window.location.href = telHref;
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 p-2 text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:border-white/40 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 md:h-12 md:w-12"
        aria-label={`Appeler Pro Alarme via Dappelle au ${formattedPhoneNumber}`}
      >
        <Image
          src="/images/logo_dappelle.svg"
          alt="Logo Dappelle"
          width={28}
          height={28}
          className="h-6 w-6 md:h-7 md:w-7"
        />
      </button>
      <div
        role="status"
        aria-hidden={!showNumber}
        className={`pointer-events-none absolute right-full top-1/2 mr-3 w-max -translate-y-1/2 rounded-full bg-black/90 px-3 py-1 text-sm font-semibold tracking-wide text-white shadow-lg transition-opacity duration-200 ${
          showNumber ? "opacity-100" : "opacity-0"
        }`}
      >
        {formattedPhoneNumber}
      </div>
    </div>
  );
}
