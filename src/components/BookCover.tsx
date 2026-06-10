import Image from "next/image";

export function BookCover() {
  return (
    <section className="sala flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      {/* Hero poster background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/assets/hero-poster.png"
          alt=""
          fill
          className="object-cover opacity-20"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-parchment)]/60 via-transparent to-[var(--color-parchment)]" />
      </div>

      {/* Pattern overlay */}
      <div
        className="absolute inset-0 -z-5 opacity-10"
        style={{
          backgroundImage: "url(/assets/pattern-tile.png)",
          backgroundRepeat: "repeat",
          backgroundSize: "120px 120px",
        }}
      />

      {/* Book scene */}
      <div className="book-scene mb-12">
        <div className="book book-open-scroll">
          {/* Back cover */}
          <div className="book-back" />

          {/* Pages */}
          <div className="book-pages">
            <div className="book-page" />
            <div className="book-page" />
            <div className="book-page" />
          </div>

          {/* Spine */}
          <div className="book-spine" />

          {/* Front cover */}
          <div className="book-cover-front">
            <div className="relative z-10">
              <div className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">
                Artesanías colimenses
              </div>
              <h1
                className="font-[var(--font-serif)] text-4xl font-bold leading-tight text-[var(--color-parchment)]"
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
              >
                Tlalchichi777
              </h1>
              <div className="mt-3 text-sm italic text-[var(--color-gold)]">
                Artesanías colimenses auténticas
              </div>
              <div className="mt-6 flex justify-center">
                <div className="wax-seal">T</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Title below book */}
      <div className="reveal text-center">
        <h2 className="font-[var(--font-serif)] text-2xl font-bold text-[var(--color-ink)] sm:text-3xl">
          Un recorrido por las tradiciones de México
        </h2>
        <p className="mt-4 max-w-md text-[var(--color-ink-light)] opacity-80">
          Desplaza para abrir el libro y descubrir la historia detrás de cada
          pieza.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--color-gold)]" />
          <span className="font-[var(--font-serif)] text-sm italic text-[var(--color-gold-dark)]">
            Desplaza hacia abajo
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--color-gold)]" />
        </div>
      </div>
    </section>
  );
}
