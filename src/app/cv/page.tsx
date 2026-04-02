export default function CVPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-8 overflow-hidden rounded-3xl border border-slate-200/70 bg-white/85 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="relative px-6 py-8 sm:px-8 sm:py-10">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-200/30 blur-2xl" />
            <div className="absolute -bottom-12 -left-10 h-36 w-36 rounded-full bg-slate-200/40 blur-2xl" />

              <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="md:max-w-[36%] lg:max-w-[34%]">
                  <h1 className="mt-1 text-[22px] font-semibold tracking-tight text-slate-900 sm:text-[26px] lg:text-[32px]">
                    Curriculum Vitae
                  </h1>

                  <p className="mt-2 text-[12px] leading-5 text-slate-600 sm:text-[13px]">
                    A complete record of education, research, publications, honors,
                    teaching, and professional service.
                  </p>
                </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="/cv.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Open PDF
                </a>

                <a
                  href="/cv.pdf"
                  download
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Download CV
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200/70 bg-white p-3 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-5">
            <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.10)]">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">CV Preview</p>
                  <p className="text-xs text-slate-500">
                    Embedded PDF viewer
                  </p>
                </div>
                <a
                  href="/cv.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
                >
                  Open in new tab
                </a>
              </div>

              <iframe
                src="/cv.pdf"
                title="CV PDF"
                className="block h-[78vh] w-full min-h-[900px] bg-white"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}