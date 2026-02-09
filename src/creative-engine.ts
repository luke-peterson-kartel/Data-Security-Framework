import './creative-engine.css';

// ─── Navigation scroll behavior ───
function initNavScroll(): void {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const handleScroll = (): void => {
    if (window.scrollY > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// ─── Active nav link highlight on scroll ───
function initActiveNavTracking(): void {
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-link[data-section]');
  const sections = document.querySelectorAll<HTMLElement>('.section');

  if (navLinks.length === 0 || sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.dataset.section === sectionId);
          });
        }
      });
    },
    {
      rootMargin: '-20% 0px -75% 0px',
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

// ─── Scroll-triggered animations ───
function initScrollAnimations(): void {
  const animatedElements = document.querySelectorAll<HTMLElement>('[data-animate]');

  if (animatedElements.length === 0) return;

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
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1,
    }
  );

  animatedElements.forEach((el) => observer.observe(el));
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
  initActiveNavTracking();
  initScrollAnimations();
  initSmoothScroll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
