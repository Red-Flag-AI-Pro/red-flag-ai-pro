import { Composition } from "remotion";
import { ScanResults, scanResultsSchema } from "./compositions/ScanResults";

export const RemotionRoot: React.FC = () => {
  return (
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
  );
};
