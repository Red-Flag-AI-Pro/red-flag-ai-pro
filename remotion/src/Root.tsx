import { Composition } from "remotion";
import { ScanResults, scanResultsSchema } from "./compositions/ScanResults";
import { AdTeaser, adTeaserSchema } from "./compositions/AdTeaser";
import { AdTeaserDynamic, adTeaserDynamicSchema } from "./compositions/AdTeaserDynamic";

const adTeaserDynamicDefaultProps = {
  flags: [
    { title: "Health claim flagged" },
    { title: "Influencer disclosure missing" },
    { title: "Misleading pricing language" },
  ],
  stat: "73%",
  statSubtext: "of social ads carry at least one compliance risk",
  cta: "Try the free demo",
  url: "redflagaipro.com",
};

const adTeaserDefaultProps = {
  hook: "Would YOUR ad pass a compliance check?",
  flags: [
    { title: "Health claim flagged" },
    { title: "Influencer disclosure missing" },
    { title: "Misleading pricing language" },
  ],
  stat: "73%",
  statSubtext: "of social ads carry at least one compliance risk",
  cta: "Try the free demo",
  url: "redflagaipro.com",
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ScanResults"
        component={ScanResults}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        schema={scanResultsSchema}
        defaultProps={{
          companyName: "Acme Corp",
          documentName: "Vendor Services Agreement",
          redFlags: [
            { title: "Unlimited liability clause", severity: "high" },
            { title: "Auto-renewal without notice", severity: "medium" },
            { title: "Vague termination terms", severity: "medium" },
            { title: "Missing data protection clause", severity: "high" },
          ],
        }}
      />

      {/* Vertical ad teaser — TikTok / Reels / Shorts / Stories (1080x1920, 15s) */}
      <Composition
        id="AdTeaser-Vertical"
        component={AdTeaser}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        schema={adTeaserSchema}
        defaultProps={adTeaserDefaultProps}
      />

      {/* Dynamic / flashy version — glitch, glow, split-screen dual audience (1080x1920, 17.5s) */}
      <Composition
        id="AdTeaserDynamic-Vertical"
        component={AdTeaserDynamic}
        durationInFrames={525}
        fps={30}
        width={1080}
        height={1920}
        schema={adTeaserDynamicSchema}
        defaultProps={adTeaserDynamicDefaultProps}
      />

      {/* Square ad teaser — Instagram / Facebook feed (1080x1080, 15s) */}
      <Composition
        id="AdTeaser-Square"
        component={AdTeaser}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1080}
        schema={adTeaserSchema}
        defaultProps={adTeaserDefaultProps}
      />

      {/* Horizontal ad teaser — YouTube / LinkedIn / X (1920x1080, 15s) */}
      <Composition
        id="AdTeaser-Horizontal"
        component={AdTeaser}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
        schema={adTeaserSchema}
        defaultProps={adTeaserDefaultProps}
      />
    </>
  );
};
