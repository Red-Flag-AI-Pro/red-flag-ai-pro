import path from "path";
import {
  addBundleToSandbox,
  createSandbox,
  renderMediaOnVercel,
  getRenderProgress,
} from "@remotion/vercel";
import { Sandbox } from "@vercel/sandbox";
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

const BUNDLE_DIR = path.join(process.cwd(), "remotion");

/**
 * Kicks off a video render on a fresh Vercel Sandbox. Returns identifiers
 * that can be used to poll progress later — the render itself happens in
 * the background ("detached") since it can take longer than a serverless
 * function is allowed to run.
 */
export async function startScanVideoRender(
  props: ScanVideoProps
): Promise<{ sandboxId: string; cmdId: string }> {
  const inputProps = props as unknown as Record<string, unknown>;

  const sandbox = await createSandbox();

  await addBundleToSandbox({
    sandbox,
    bundleDir: BUNDLE_DIR,
  });

  const { sandboxId, cmdId } = await renderMediaOnVercel({
    sandbox,
    compositionId: "ScanResults",
    inputProps,
    detached: true,
    vercelBlob: {
      blobToken: process.env.BLOB_READ_WRITE_TOKEN!,
      access: "public",
    },
  });

  return { sandboxId, cmdId };
}

export type ScanVideoRenderProgress = Awaited<ReturnType<typeof getRenderProgress>>;

/**
 * Polls a previously-started render. When it finishes (successfully or with
 * an error), the underlying sandbox is stopped to avoid wasting compute.
 */
export async function checkScanVideoRender(
  sandboxId: string,
  cmdId: string
): Promise<ScanVideoRenderProgress> {
  const progress = await getRenderProgress({ sandboxId, cmdId });

  if (progress.stage === "done" || progress.stage === "error") {
    await Sandbox.get({ name: sandboxId })
      .then((s) => s.stop())
      .catch(() => {});
  }

  return progress;
}
