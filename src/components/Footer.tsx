export default function Footer() {
  return (
    <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
      <a
        href="https://github.com/adsurkasur"
        target="_blank"
        rel="noopener noreferrer"
        className="transition-colors hover:text-foreground"
      >
        adsurkasur © {new Date().getFullYear()}
      </a>
    </footer>
  );
}
