import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/pricing", "/signup", "/login"],
        disallow: ["/dashboard", "/scans", "/history", "/billing", "/admin", "/api"],
      },
    ],
    sitemap: "https://www.redflagaipro.com/sitemap.xml",
  };
}
