import path from "path";
import { bundle } from "@remotion/bundler";
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

const ENTRY_POINT = path.join(process.cwd(), "remotion", "src", "index.ts");

let bundleLocationPromise: Promise<string> | null = null;

/**
 * Compiles the Remotion project into a static, servable bundle (HTML + JS +
 * assets — no source files, no node_modules). This is the format
 * `addBundleToSandbox` expects. The result is cached per server instance so
 * repeat renders don't re-bundle from scratch.
 */
function getBundleLocation() {
  if (!bundleLocationPromise) {
    bundleLocationPromise = bundle({ entryPoint: ENTRY_POINT });
  }
  return bundleLocationPromise;
}

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

  const [sandbox, bundleLocation] = await Promise.all([
    createSandbox(),
    getBundleLocation(),
  ]);

  await addBundleToSandbox({
    sandbox,
    bundleDir: bundleLocation,
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
