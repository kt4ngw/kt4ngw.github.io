export default function CVPageContent() {
  return (
    <div className="fade-in-up mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 border-b border-neutral-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div className="md:max-w-[60%]">
          <h1 className="text-3xl font-semibold tracking-tight text-primary">
            Curriculum Vitae
          </h1>
          <p className="mt-2 text-base leading-7 text-neutral-600">
            A complete record of my education, research, publications, honors,
            and service.
          </p>
        </div>

        <div className="flex flex-wrap gap-5 text-sm font-medium">
          <a
            href="/cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline-offset-2 hover:underline"
          >
            Open PDF <span aria-hidden="true">↗</span>
          </a>
          <a
            href="/cv.pdf"
            download
            className="text-accent underline-offset-2 hover:underline"
          >
            Download PDF <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>

      {/* A one-page CV needs no thumbnail sidebar; the viewer toolbar stays for zooming and printing. */}
      <div className="overflow-hidden rounded-md border border-neutral-200">
        <iframe
          src="/cv.pdf#navpanes=0&view=FitH"
          title="CV PDF"
          className="block h-[78vh] min-h-[700px] w-full bg-neutral-50"
        />
      </div>
    </div>
  );
}
