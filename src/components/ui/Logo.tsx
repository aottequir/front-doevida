
"use client";

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  href?: string;
}

export default function Logo({
  size = "md",
  className = "",
  href = "/",
}: LogoProps) {
  const sizes = {
    sm: 60,
    md: 90,
    lg: 140,
    xl: 200,
  };

  const logo = (
    <Image
      src="/logo-vida.png"
      alt="DOE + VIDA"
      width={1128}
      height={1128}
      priority
      draggable={false}
      className={`h-auto max-w-full object-contain ${className}`}
      style={{ width: `${sizes[size]}px` }}
    />
  );

  if (!href) {
    return logo;
  }

  return (
    <Link
      href={href}
      aria-label="Página inicial DOE + VIDA"
      className="inline-flex items-center justify-center"
    >
      {logo}
    </Link>
  );
}
