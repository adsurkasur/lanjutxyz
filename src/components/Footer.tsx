export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
      Arina Hub © {year}
    </footer>
  );
}
