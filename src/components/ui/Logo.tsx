import Image from "next/image";

export default function Logo({ className = "h-8" }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="Stratora"
      width={1400}
      height={500}
      priority
      className={`h-auto w-auto ${className}`}
    />
  );
}

export function LogoMark({ className = "h-8" }: { className?: string }) {
  return (
    <Image
      src="/logo2.png"
      alt=""
      width={32}
      height={32}
      className={`w-auto ${className}`}
    />
  );
}