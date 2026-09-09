import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Thoughts on technology, design, and the products we love.',
};

const POSTS = [
  {
    slug: 'why-noise-cancellation-matters',
    category: 'Audio',
    title: 'Why noise cancellation changed how I work',
    excerpt:
      'A deep dive into the technology behind active noise cancellation, and why the Sony WH-1000XM5 remains the benchmark.',
    date: 'Jun 10, 2026',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    readTime: '5 min read',
  },
  {
    slug: 'apple-silicon-two-years-later',
    category: 'Laptops',
    title: 'Apple Silicon, two years later',
    excerpt:
    "We revisited the M2 MacBook Air after two years of daily use. The verdict? It still beats almost everything.",
    date: 'May 22, 2026',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
    readTime: '7 min read',
  },
  {
    slug: 'the-case-for-mirrorless',
    category: 'Cameras',
    title: 'The case for going mirrorless in 2026',
    excerpt:
      "DSLR shooters are quietly switching. Here's why the Sony A7 IV convinced even the most stubborn hold-outs.",
    date: 'Apr 14, 2026',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
    readTime: '6 min read',
  },
  {
    slug: 'smartwatch-buying-guide',
    category: 'Wearables',
    title: 'The honest smartwatch buying guide',
    excerpt:
      'Not every wrist needs an Apple Watch Ultra. We break down exactly who should buy what.',
    date: 'Mar 30, 2026',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80',
    readTime: '8 min read',
  },
];

export default function JournalPage() {
  return (
    <>
      <div className="pt-28 pb-0 min-h-screen bg-[#F7F6F1]">
        {/* Header */}
        <div className="max-w-4xl mx-auto px-6 pt-12 pb-16 border-b border-[#E5E3DC]">
          <p className="text-xs tracking-widest text-[#315C45] uppercase mb-4">Journal</p>
          <h1
            className="font-serif text-5xl md:text-6xl text-[#171717] leading-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Thoughts on
            <br />
            technology &amp; design.
          </h1>
        </div>

        {/* Posts */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="flex flex-col divide-y divide-[#E5E3DC]">
            {POSTS.map((post) => (
              <article key={post.slug} className="py-10 group">
                <Link href={`/journal/${post.slug}`} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                  {/* Image */}
                  <div className="md:col-span-1 aspect-[3/2] overflow-hidden bg-[#E5E3DC]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="md:col-span-2 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] tracking-widest text-[#315C45] uppercase">
                        {post.category}
                      </span>
                      <span className="text-[#E5E3DC]">·</span>
                      <span className="text-xs text-[#6F6F68]">{post.date}</span>
                      <span className="text-[#E5E3DC]">·</span>
                      <span className="text-xs text-[#6F6F68]">{post.readTime}</span>
                    </div>
                    <h2
                      className="font-serif text-2xl text-[#171717] group-hover:text-[#315C45] transition-colors leading-snug"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {post.title}
                    </h2>
                    <p className="text-sm text-[#6F6F68] leading-relaxed">{post.excerpt}</p>
                    <span className="text-sm text-[#171717] border-b border-[#171717] pb-0.5 w-fit group-hover:text-[#315C45] group-hover:border-[#315C45] transition-colors">
                      Read more
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
