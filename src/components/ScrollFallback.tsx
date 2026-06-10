"use client";

export function ScrollFallback() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
(function() {
  if (CSS && CSS.supports && CSS.supports('animation-timeline', 'view()')) return;

  var reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .clip-reveal');
  if (!reveals.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        entry.target.style.clipPath = 'none';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(function(el) {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
})();
`,
      }}
    />
  );
}
