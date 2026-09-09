import type { Metadata } from 'next';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About',
  description: 'Our story — why we built Voltech and what drives us.',
};

export default function AboutPage() {
  return (
    <>
      <div className="pt-28 pb-0 min-h-screen bg-[#F7F6F1]">
        {/* Hero */}
        <div className="max-w-4xl mx-auto px-6 pt-12 pb-24">
          <p className="text-xs tracking-widest text-[#315C45] uppercase mb-4">Our Story</p>
          <h1
            className="font-serif text-5xl md:text-7xl text-[#171717] leading-tight mb-10"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Technology that
            <br />
            <em className="not-italic text-[#315C45]">respects you.</em>
          </h1>
          <p className="text-lg text-[#6F6F68] leading-relaxed max-w-2xl">
            Voltech was founded with one conviction: the best technology should be
            invisible — it should simply work, beautifully and reliably, getting out
            of your way so you can focus on what matters.
          </p>
        </div>

        {/* Story section */}
        <div className="bg-white py-20">
          <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-3xl text-[#171717] mb-5">Why we exist</h2>
              <p className="text-[#6F6F68] leading-relaxed mb-4">
                We got tired of sifting through endless mediocre product listings to
                find one genuinely excellent device. So we built the store we wished
                existed.
              </p>
              <p className="text-[#6F6F68] leading-relaxed">
                Every product on Voltech is hand-tested and only listed if our team
                would actually recommend it to a friend. No affiliate padding, no low-quality
                filler — just a carefully curated selection of things we genuinely believe in.
              </p>
            </div>
            <div className="aspect-square overflow-hidden bg-[#F7F6F1]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80"
                alt="Electronics workspace"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="font-serif text-3xl text-[#171717] mb-12 text-center">
              What we stand for
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Quality First', body: 'We only carry products that have earned their place. If it is not excellent, it is not on the site.' },
                { label: 'Honest Curation', body: 'Our selection is driven by genuine testing and research, not by margins or sponsorships.' },
                { label: 'Human Service', body: 'Real people answer your questions. We measure success by whether you are actually satisfied.' },
              ].map(({ label, body }) => (
                <div key={label} className="flex flex-col gap-3">
                  <div className="h-px w-8 bg-[#315C45]" />
                  <h3 className="font-serif text-xl text-[#171717]">{label}</h3>
                  <p className="text-sm text-[#6F6F68] leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#171717] py-20">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="font-serif text-3xl text-white mb-4">
              Ready to find your next favourite device?
            </h2>
            <p className="text-neutral-400 text-sm mb-8">
              Browse our collection and discover technology worth owning.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-white text-[#171717] text-sm px-7 py-3.5 hover:bg-[#DCE7DD] transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
