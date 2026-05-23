"use client";

import { useState } from "react";
import Link from "next/link";

function SellerCalculator() {
  const [adSpend, setAdSpend] = useState(2000);

  const ftcFine = 50000;
  const probability = 0.15;
  const atRisk = Math.round(adSpend * 12 * probability);
  const totalRisk = atRisk + ftcFine;

  const format = (n: number) =>
    n >= 1000 ? `£${(n / 1000).toFixed(0)}k` : `£${n}`;

  return (
    <div className="rounded-2xl border-2 border-red-500/30 bg-gray-900 p-6 flex flex-col">
      <div className="mb-2 inline-flex items-center gap-2 self-start rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400 uppercase tracking-widest">
        For Sellers
      </div>
      <h3 className="mt-3 text-xl font-extrabold text-white">
        What&apos;s Your Compliance Risk Worth?
      </h3>
      <p className="mt-1 text-sm text-gray-400">
        Move the slider to see your exposure as a seller
      </p>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-300">Monthly ad spend</label>
          <span className="text-lg font-extrabold text-red-400">£{adSpend.toLocaleString()}</span>
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

      <div className="mt-6 space-y-3">
        <div className="rounded-xl bg-gray-800 border border-gray-700 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Annual spend at risk</p>
            <p className="text-xs text-gray-500 mt-0.5">if 15% of campaigns flag</p>
          </div>
          <p className="text-2xl font-extrabold text-amber-400 ml-4 shrink-0">{format(atRisk)}</p>
        </div>
        <div className="rounded-xl bg-gray-800 border border-gray-700 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Potential FTC fine</p>
            <p className="text-xs text-gray-500 mt-0.5">per violation, per day</p>
          </div>
          <p className="text-2xl font-extrabold text-red-400 ml-4 shrink-0">£50k+</p>
        </div>
        <div className="rounded-xl bg-red-900/30 border border-red-500/40 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-red-300 uppercase tracking-wider">Total exposure</p>
            <p className="text-xs text-red-300 mt-0.5">if left unchecked</p>
          </div>
          <p className="text-2xl font-extrabold text-white ml-4 shrink-0">{format(totalRisk)}+</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-green-900/20 border border-green-500/30 p-4 text-center">
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
        className="mt-4 block w-full rounded-xl bg-red-600 py-3.5 text-center text-base font-bold text-white hover:bg-red-500 transition-colors"
      >
        Scan my copy free — protect {format(totalRisk)} →
      </Link>
    </div>
  );
}

function BuyerCalculator() {
  const [purchaseAmount, setPurchaseAmount] = useState(500);
  const [purchasesPerYear, setPurchasesPerYear] = useState(5);

  const riskRate = 0.3; // 30% of online purchases involve misleading claims
  const atRisk = Math.round(purchaseAmount * purchasesPerYear * riskRate);
  const totalExposure = purchaseAmount * purchasesPerYear;

  const format = (n: number) =>
    n >= 1000 ? `£${(n / 1000).toFixed(1)}k` : `£${n}`;

  return (
    <div className="rounded-2xl border-2 border-red-500/30 bg-gray-900 p-6 flex flex-col">
      <div className="mb-2 inline-flex items-center gap-2 self-start rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400 uppercase tracking-widest">
        For Buyers
      </div>
      <h3 className="mt-3 text-xl font-extrabold text-white">
        How Much Are You Risking As A Buyer?
      </h3>
      <p className="mt-1 text-sm text-gray-400">
        Move the sliders to see your exposure as a buyer
      </p>

      <div className="mt-6 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">Average purchase amount</label>
            <span className="text-lg font-extrabold text-red-400">£{purchaseAmount.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={100}
            max={10000}
            step={100}
            value={purchaseAmount}
            onChange={(e) => setPurchaseAmount(Number(e.target.value))}
            className="w-full accent-red-600 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>£100</span>
            <span>£10,000</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">Online purchases per year</label>
            <span className="text-lg font-extrabold text-red-400">{purchasesPerYear}</span>
          </div>
          <input
            type="range"
            min={1}
            max={50}
            step={1}
            value={purchasesPerYear}
            onChange={(e) => setPurchasesPerYear(Number(e.target.value))}
            className="w-full accent-red-600 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>1</span>
            <span>50</span>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="rounded-xl bg-gray-800 border border-gray-700 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Annual spend online</p>
            <p className="text-xs text-gray-500 mt-0.5">total at stake per year</p>
          </div>
          <p className="text-2xl font-extrabold text-amber-400 ml-4 shrink-0">{format(totalExposure)}</p>
        </div>
        <div className="rounded-xl bg-gray-800 border border-gray-700 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Misleading ads rate</p>
            <p className="text-xs text-gray-500 mt-0.5">of online ads break the law</p>
          </div>
          <p className="text-2xl font-extrabold text-red-400 ml-4 shrink-0">30%</p>
        </div>
        <div className="rounded-xl bg-red-900/30 border border-red-500/40 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-red-300 uppercase tracking-wider">Your money at risk</p>
            <p className="text-xs text-red-300 mt-0.5">from misleading marketing</p>
          </div>
          <p className="text-2xl font-extrabold text-white ml-4 shrink-0">{format(atRisk)}+</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-green-900/20 border border-green-500/30 p-4 text-center">
        <p className="text-sm text-green-300">
          One free scan before you buy could save you <strong className="text-white">{format(purchaseAmount)}</strong> right now.
        </p>
        <p className="mt-1 text-xs text-green-400 font-bold">
          Free. No credit card. Takes 60 seconds.
        </p>
      </div>

      <Link
        href="/signup"
        className="mt-4 block w-full rounded-xl bg-red-600 py-3.5 text-center text-base font-bold text-white hover:bg-red-500 transition-colors"
      >
        Scan before you buy — protect {format(purchaseAmount)} →
      </Link>
    </div>
  );
}

export function RiskCalculator() {
  return (
    <div>
      <h3 className="text-center text-2xl font-extrabold text-white mb-2">
        What&apos;s Your Risk Worth?
      </h3>
      <p className="text-center text-sm text-gray-400 mb-8">
        Whether you are selling or buying — see your personal exposure
      </p>
      <div className="grid gap-6 lg:grid-cols-2">
        <SellerCalculator />
        <BuyerCalculator />
      </div>
    </div>
  );
}
