import type { MetadataRoute } from "next";
import { api } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const STATIC_ROUTES = [
  "",
  "/students",
  "/colleges",
  "/corporates",
  "/hiring-partners",
  "/placement-partners",
  "/trainers",
  "/programs",
  "/workshops",
  "/freelance-projects",
  "/internships",
  "/jobs",
  "/talks",
  "/sponsors",
  "/seek-sponsorship",
  "/marathon",
  "/campus-ambassador",
  "/success-stories",
  "/about",
  "/contact",
  "/login",
  "/register",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const [programs, talks] = await Promise.all([
    api.get<{ slug: string }[]>("/programs").catch(() => []),
    api.get<{ slug: string }[]>("/talks").catch(() => []),
  ]);

  const programEntries: MetadataRoute.Sitemap = programs.map((p) => ({
    url: `${SITE_URL}/programs/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const talkEntries: MetadataRoute.Sitemap = talks.map((t) => ({
    url: `${SITE_URL}/talks/${t.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...programEntries, ...talkEntries];
}
