import Link from "next/link";

const footerSections = [
  {
    title: "Platform",
    links: [
      { label: "About", href: "#" },
      { label: "How It Works", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    title: "Data Sources",
    links: [
      { label: "Kaggle Datasets", href: "#" },
      { label: "Government Portals", href: "#" },
      { label: "World Bank", href: "#" },
      { label: "Research Institutions", href: "#" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "API Documentation", href: "/api-docs" },
      { label: "Python SDK", href: "#" },
      { label: "R Package", href: "#" },
      { label: "GitHub", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                >
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M3 5V12C3 13.66 7.03 15 12 15C16.97 15 21 13.66 21 12V5" />
                  <path d="M3 12V19C3 20.66 7.03 22 12 22C16.97 22 21 20.66 21 19V12" />
                </svg>
              </div>
              <span className="text-lg font-bold gradient-text">DatasetVerse</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              The next-generation platform for discovering, exploring, and sharing research datasets.
            </p>
            <div className="flex gap-3">
              {["twitter", "github", "linkedin"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center text-gray-400 hover:text-neon-blue hover:bg-white/10 transition-all"
                >
                  <span className="text-xs font-bold uppercase">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Link sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-neon-blue transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; 2026 DatasetVerse. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Built with passion for open data and research.
          </p>
        </div>
      </div>
    </footer>
  );
}
