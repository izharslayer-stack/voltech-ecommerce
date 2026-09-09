import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F6F1] flex flex-col items-center justify-center text-center px-6">
      <p className="text-xs tracking-widest text-[#315C45] uppercase mb-4">404</p>
      <h1
        className="font-serif text-5xl text-[#171717] mb-4"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        Looks like this page
        <br />
        wandered away.
      </h1>
      <p className="text-sm text-[#6F6F68] mb-8 max-w-sm">
        It may have been moved, deleted, or perhaps it never existed. Let&apos;s
        get you back on track.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          href="/"
          className="bg-[#171717] text-white text-sm px-7 py-3.5 hover:bg-[#315C45] transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/shop"
          className="border border-[#171717] text-[#171717] text-sm px-7 py-3.5 hover:bg-[#171717] hover:text-white transition-colors"
        >
          Browse Shop
        </Link>
      </div>
    </div>
  );
}
