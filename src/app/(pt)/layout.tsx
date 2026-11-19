import "../globals.css";
import type { Viewport } from "next";
import { Shell, metadataFor } from "@/components/shell";

export const metadata = metadataFor("pt");
export const viewport: Viewport = { themeColor: "#f3eee4" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Shell lang="pt">{children}</Shell>;
}
