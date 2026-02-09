import './homepage.css';

// ─── Nav scroll effect ───
function initNavScroll(): void {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const handleScroll = (): void => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// ─── Scroll reveal ───
function initScrollReveal(): void {
  const reveals = document.querySelectorAll<HTMLElement>('.reveal');
  if (reveals.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  reveals.forEach((el) => observer.observe(el));
}

// ─── Smooth scroll for anchor links ───
function initSmoothScroll(): void {
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');

    if (!anchor) return;

    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const targetElement = document.querySelector<HTMLElement>(targetId);
    if (!targetElement) return;

    e.preventDefault();

    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  });
}

// ─── Initialize ───
function init(): void {
  initNavScroll();
  initScrollReveal();
  initSmoothScroll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
