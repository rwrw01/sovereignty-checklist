export function Footer() {
  return (
    <footer className="bg-mxi-dark text-white/60 text-sm">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <p className="text-white font-semibold mb-1">MXI</p>
            <p>Digitale soevereiniteit, meetbaar gemaakt.</p>
          </div>
          <div className="text-right">
            <p>Gebaseerd op het EU SEAL Framework</p>
            <p className="mt-1">
              &copy; {new Date().getFullYear()} MXI.nl — Alle rechten voorbehouden
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
