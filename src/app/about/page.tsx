import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "About — The Story Behind Red Flag AI Pro",
  description: "Red Flag AI Pro was built by James Stokes — a founder who went from prison, homelessness and a terminal diagnosis to building the world's only 5-jurisdiction marketing compliance scanner.",
  alternates: { canonical: "https://www.redflagaipro.com/about" },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div className="bg-gray-950 py-20 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-red-400 text-sm font-semibold uppercase tracking-wider mb-4">The story behind the tool</p>
          <h1 className="text-4xl font-extrabold text-white leading-tight">
            This wasn't built in a boardroom.<br />It was built from the bottom.
          </h1>
          <p className="mt-6 text-xl text-red-400 italic font-medium">
            "Within adversity hides unstoppable strength"
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-16">

        <div className="space-y-6 text-gray-700 leading-relaxed text-lg">

          <p>
            For 33 years I was a flat out alcoholic and drug user. I bloated to 24 stone and could barely leave my flat. I had isolated myself completely from the world, from my family, from everything.
          </p>

          <p>
            Before that I had spent 5 years in prison. I had been homeless on and off for a sustained period, doing anything just to survive. That was my life for a long time. Not planning, not building, not dreaming — just surviving. Day to day. Whatever it took.
          </p>

          <p>
            And then I lost my daughter to cancer when she was just 9 years old.
          </p>

          <p>
            That broke something in me that I couldn't put back together. I used more. I drank more. I barely ate. I drank through the night and through the day with no water. I tried rehabs, detoxes, understood all the principles, but I couldn't implement them. And yet somewhere underneath all of it, I always knew there was something bigger. A calling. Something I was meant to do. I just couldn't get there.
          </p>

          <div className="border-l-4 border-red-500 pl-6 py-2 my-8">
            <p className="text-gray-900 font-semibold text-xl italic">
              Then I was diagnosed with two years to live.
            </p>
          </div>

          <p>
            I was numb at first. It didn't sink in. And then I thought, at least I'll be with my daughter soon.
          </p>

          <p>
            But something shifted. I'd always loved Eastern mysticism, Buddhism, Stoicism. I'd studied it for years without being able to live it. I found a place in Indonesia, military grade, no hot water, three cold baths a day, clothes folded in a specific way that most Westerners wouldn't understand. A call to prayer five times a day, including 4am. A language barrier. A jail attached to the building.
          </p>

          <p>
            It was the hardest thing I've ever done. And it saved my life.
          </p>

          <p>
            Something happened in Indonesia that I still can't fully explain. Too many coincidences to call coincidences. Energies I'd never felt before. A spiritual awakening that felt completely natural, as if I was being guided toward something. For the first time in my life, I felt it.
          </p>

          <p>
            I came back to the UK and stayed on my mum's sofa. Disconnected from the world. Quietly going to groups each week. Zoom calls with Indonesia twice a week. Trying to figure out who I was now and whether I'd changed enough to stay alive.
          </p>

          <p>
            Then I got a new computer.
          </p>

          <p>
            I'd had an idea in Indonesia, something around affiliate marketing and men's supplements. But I quickly realised the brand wasn't the product. The brand was me. My story. That project still exists, quietly building, part of a bigger ecosystem I'm creating around giving back to broken, addicted, homeless and struggling men.
          </p>

          <p>
            But first, this.
          </p>

          <p>
            I fell in love with AI. Started learning agentics, doing courses, building things off the top of my head. And then I went to buy one last course — and got burned. The terms and conditions I had to sign bore no resemblance to what the advert or the VSL had promised. I'd been ripped off again. At a time when I couldn't afford it.
          </p>

          <p>
            I was furious. I started talking to AI about it. And Red Flag AI Pro was born.
          </p>

          <div className="bg-red-50 border border-red-100 rounded-2xl p-8 my-10">
            <p className="text-gray-900 font-semibold text-lg mb-3">What I built</p>
            <p className="text-gray-700">
              A scanner that checks marketing copy against real advertising law: FTC, GDPR, ASA, ACCC, CASL and EU AI Act, in 60 seconds, in plain English, with exact rewrite suggestions. No lawyers. No jargon. Just clarity.
            </p>
            <p className="mt-4 text-gray-700">
              16 risk categories and growing. Earnings claims, fake scarcity, countdown timers, health claims, GDPR consent violations, AI content disclosure, FTC endorsement rules, greenwashing, financial promotions and more. Five jurisdictions simultaneously. No other tool on the planet does this.
            </p>
            <p className="mt-4 text-gray-700">
              And this is just the start. Sentinel is coming in Q3 2026, compliance infrastructure built for legal teams, financial services firms and regulated businesses. Human review logs with legal timestamps. Signed compliance certificates. The audit trail your PI insurer needs. The documentation your regulator expects.
            </p>
            <p className="mt-4 text-gray-700">
              There are more tools coming. More categories. More jurisdictions. A whole ecosystem built around one idea: making the internet a safer place to buy and sell.
            </p>
            <p className="mt-4 text-gray-700 font-medium">
              I built it alone. With help from Claude. From a laptop. After being given a death sentence.
            </p>
          </div>

          <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">What I want for you</h2>

          <p>
            When you use Red Flag AI Pro, I want you to feel something most people never feel when they're buying or selling online: genuine freedom and safety. The confidence that what you're putting out into the world is clean, honest and legal. The confidence that what you're buying is what it says it is.
          </p>

          <p>
            I want to empower people. Buyers and sellers alike.
          </p>

          <p>
            This is the beginning. There is so much more to come, tools, platforms, and projects all built around one simple idea: using AI for good.
          </p>

          {/* Signature */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-900 font-bold text-lg">James Stokes</p>
            <p className="text-gray-500 text-sm">Founder, Red Flag AI Pro</p>
            <p className="text-gray-500 text-sm">Bristol, UK</p>
          </div>

        </div>

        {/* Quote */}
        <div className="mt-12 text-center">
          <p className="text-red-600 text-xl font-semibold italic">
            "What's normal for the spider is chaos for the fly."
          </p>
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl bg-gray-950 p-8 text-center">
          <p className="text-white font-bold text-xl mb-2">Try Red Flag AI Pro free</p>
          <p className="text-gray-400 text-sm mb-6">16 risk categories. 5 jurisdictions. 60 seconds. No credit card.</p>
          <Link
            href="/signup"
            className="inline-block rounded-xl bg-red-600 px-8 py-3 text-sm font-bold text-white hover:bg-red-500 transition-colors"
          >
            Start your free scan →
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">← Back to Red Flag AI Pro</Link>
        </div>

      </div>
    </div>
  );
}
