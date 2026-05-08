import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Lanjut Tools",
  description: "Learn more about Lanjut Tools and our mission to provide simple, fast, and reliable digital utilities.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
