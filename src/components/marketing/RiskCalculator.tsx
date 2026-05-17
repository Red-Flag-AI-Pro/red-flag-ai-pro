"use client";

import { useState } from "react";
import Link from "next/link";

export function RiskCalculator() {
  const [adSpend, setAdSpend] = useState(2000);

  const ftcFine = 50000;
  const probability = 0.15; // 15% of campaigns have a compliance issue
  const atRisk = Math.round(adSpend * 12 * probability);
  const fineRisk = ftcFine;
  const totalRisk = atRisk + fineRisk;

  const format = (n: number) =>
    n >= 1000 ? `£${(n / 1000).toFixed(0)}k` : `£${n}`;

  return (
    <div className="rounded-2xl border-2 border-red-500/30 bg-gray-950 p-8">
      <h3 className="text-center text-2xl font-extrabold text-white">
        What&apos;s Your Compliance Risk Worth?
      </h3>
      <p className="mt-2 text-center text-sm text-gray-400">
        Move the slider to see your personal exposure
      </p>

      {/* Slider */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-300">
            Monthly ad spend
          </label>
          <span className="text-lg font-extrabold text-red-400">
            £{adSpend.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min={500}
          max={50000}
          step={500}
          value={adSpend}
          onChange={(e) => setAdSpend(Number(e.target.value))}
          className="w-full accent-red-600 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>£500</span>
          <span>£50,000</span>
        </div>
      </div>

      {/* Results */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-gray-900 border border-gray-800 p-4 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Annual spend at risk</p>
          <p className="mt-2 text-2xl font-extrabold text-amber-400">{format(atRisk)}</p>
          <p className="mt-1 text-xs text-gray-500">if 15% of campaigns flag</p>
        </div>
        <div className="rounded-xl bg-gray-900 border border-gray-800 p-4 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Potential FTC fine</p>
          <p className="mt-2 text-2xl font-extrabold text-red-400">£50k+</p>
          <p className="mt-1 text-xs text-gray-500">per violation, per day</p>
        </div>
        <div className="rounded-xl bg-red-900/30 border border-red-500/40 p-4 text-center">
          <p className="text-xs text-red-300 uppercase tracking-wider">Total exposure</p>
          <p className="mt-2 text-2xl font-extrabold text-white">{format(totalRisk)}+</p>
          <p className="mt-1 text-xs text-red-300">if left unchecked</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-green-900/20 border border-green-500/30 p-4 text-center">
        <p className="text-sm text-green-300">
          Red Flag AI Pro costs <strong className="text-white">£0 for your first scan</strong> and{" "}
          <strong className="text-white">£49/month</strong> for unlimited protection.
        </p>
        <p className="mt-1 text-xs text-green-400 font-bold">
          That&apos;s {format(Math.round(totalRisk / 49))}x cheaper than your risk exposure.
        </p>
      </div>

      <Link
        href="/signup"
        className="mt-6 block w-full rounded-xl bg-red-600 py-3.5 text-center text-base font-bold text-white hover:bg-red-500 transition-colors"
      >
        Scan my copy free — protect {format(totalRisk)} →
      </Link>
    </div>
  );
}
