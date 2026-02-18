const footerLinks = [
  { label: "Email", url: "mailto:your@email.com" },
  { label: "GitHub", url: "https://github.com" },
  { label: "Google Scholar", url: "https://scholar.google.com" },
];

export default function Footer() {
  return (
    <footer className="border-t border-neutral-100">
      <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[10px] text-neutral-300 tracking-wider uppercase">
          &copy; 2025 Taeheon Lim
        </p>
        <div className="flex items-center gap-6">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-neutral-400 hover:text-black transition-colors duration-200 tracking-wider uppercase"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
