import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border py-6 flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
      <div className="flex items-center gap-4">
        <Link href="/about" className="transition-colors hover:text-foreground">
          About
        </Link>
        <a
          href="https://github.com/adsurkasur"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-foreground"
        >
          adsurkasur © {new Date().getFullYear()}
        </a>
      </div>
    </footer>
  );
}
