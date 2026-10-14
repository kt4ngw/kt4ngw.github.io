interface FooterProps {
  lastUpdated: string;
  owner: string;
}

export default function Footer({ lastUpdated, owner }: FooterProps) {
  return (
    <footer className="border-t border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-neutral-500">
            Last updated: {lastUpdated}
          </p>
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} {owner}
          </p>
        </div>
      </div>
    </footer>
  );
}
