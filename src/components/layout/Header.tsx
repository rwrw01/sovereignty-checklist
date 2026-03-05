import Link from "next/link";

export function Header() {
  return (
    <header className="bg-mxi-dark text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-mxi-purple rounded-lg flex items-center justify-center font-bold text-lg">
            MXI
          </div>
          <span className="text-lg font-semibold hidden sm:inline">
            Soevereiniteits Checklist
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/"
            className="hover:text-mxi-blue transition-colors"
          >
            Home
          </Link>
          <Link
            href="/assessment/new"
            className="bg-mxi-purple hover:bg-mxi-purple/80 px-4 py-2 rounded-lg transition-colors"
          >
            Start Assessment
          </Link>
        </nav>
      </div>
    </header>
  );
}
