"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export function ConsentScripts() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const check = () => setConsented(localStorage.getItem("cookie-consent") === "accepted");
    check();
    window.addEventListener("cookie-consent-changed", check);
    return () => window.removeEventListener("cookie-consent-changed", check);
  }, []);

  if (!consented) return null;

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-18172154544"
        strategy="afterInteractive"
      />
      <Script
        id="gtag-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18172154544');
            gtag('config', 'AW-18172153815');
          `,
        }}
      />
      <Script
        src="https://files.tlt-cdn.com/tlt.js"
        data-tolt="pk_uHSrWu9BsJAGNpueQV69rTrd"
        strategy="lazyOnload"
      />
    </>
  );
}
