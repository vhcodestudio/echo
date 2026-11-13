import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "echo — áudio vira conteúdo",
    short_name: "echo",
    start_url: "/",
    display: "standalone",
    background_color: "#f3eee4",
    theme_color: "#f3eee4",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
