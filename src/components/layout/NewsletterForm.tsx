'use client';

export default function NewsletterForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex gap-0 min-w-0 w-full md:w-auto"
    >
      <input
        type="email"
        placeholder="Your email"
        className="flex-1 md:w-64 bg-neutral-800 border border-neutral-700 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#315C45] transition-colors"
        aria-label="Email for newsletter"
      />
      <button
        type="submit"
        className="bg-[#315C45] text-white text-sm px-5 py-2.5 hover:bg-[#274d38] transition-colors whitespace-nowrap"
      >
        Subscribe
      </button>
    </form>
  );
}
