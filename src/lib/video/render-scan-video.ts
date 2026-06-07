import path from "path";
import os from "os";
import fs from "fs/promises";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import type { Severity } from "@/types";

export interface ScanVideoFlag {
  title: string;
  severity: Severity;
}

export interface ScanVideoProps {
  companyName: string;
  documentName: string;
  redFlags: ScanVideoFlag[];
}

const ENTRY_POINT = path.join(process.cwd(), "remotion", "src", "index.ts");

let bundleLocationPromise: Promise<string> | null = null;

function getBundleLocation() {
  if (!bundleLocationPromise) {
    bundleLocationPromise = bundle({ entryPoint: ENTRY_POINT });
  }
  return bundleLocationPromise;
}

export async function renderScanVideo(props: ScanVideoProps): Promise<Buffer> {
  const serveUrl = await getBundleLocation();
  const inputProps = props as unknown as Record<string, unknown>;

  const composition = await selectComposition({
    serveUrl,
    id: "ScanResults",
    inputProps,
  });

  const outputPath = path.join(
    os.tmpdir(),
    `scan-video-${Date.now()}-${Math.random().toString(36).slice(2)}.mp4`
  );

  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation: outputPath,
    inputProps,
  });

  const buffer = await fs.readFile(outputPath);
  await fs.unlink(outputPath).catch(() => {});

  return buffer;
}
