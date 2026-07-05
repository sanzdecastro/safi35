gsap.registerPlugin(ScrollTrigger);

const sections = gsap.utils.toArray('.section');

/* ---------------------------------------------------
   1) Fondo animado: la capa #bg-color-layer cambia de
      color acorde a la sección visible (pink -> black -> cyan)
--------------------------------------------------- */
sections.forEach((section) => {
  const color = section.dataset.bg;
  ScrollTrigger.create({
    trigger: section,
    start: 'top center',
    end: 'bottom center',
    onEnter: () => gsap.to('#bg-color-layer', { backgroundColor: color, duration: 0.6, ease: 'power2.out' }),
    onEnterBack: () => gsap.to('#bg-color-layer', { backgroundColor: color, duration: 0.6, ease: 'power2.out' }),
  });
});

/* ---------------------------------------------------
   2) Parallax scroll: cada capa se mueve a distinta
      velocidad según data-speed (bg más lento que
      el contenido, para dar profundidad)
--------------------------------------------------- */
sections.forEach((section) => {
  const bgLayer = section.querySelector('.bg-layer');
  if (bgLayer) {
    gsap.to(bgLayer, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  section.querySelectorAll('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.speed) || 0.5;
    gsap.to(el, {
      yPercent: (1 - speed) * -40,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
});

/* ---------------------------------------------------
   3) Flip 3D de la foto de portada, ligado al scroll
--------------------------------------------------- */
gsap.to('.hero-photo img', {
  rotateY: 360,
  ease: 'none',
  scrollTrigger: {
    trigger: '#section-hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  },
});

/* ---------------------------------------------------
   4) Entrada de contenido: fade + subida al entrar
--------------------------------------------------- */
gsap.from('.hero-photo', {
  opacity: 0,
  y: 30,
  duration: 1,
  ease: 'power3.out',
});

gsap.from('.hero-logo', {
  opacity: 0,
  y: 40,
  duration: 1,
  ease: 'power3.out',
  delay: 0.2,
});

gsap.from('.badge', {
  opacity: 0,
  y: 30,
  scale: 0.9,
  duration: 0.8,
  ease: 'back.out(1.6)',
  delay: 0.6,
});

gsap.utils.toArray('.content-block').forEach((block) => {
  gsap.from(block.children, {
    opacity: 0,
    y: 50,
    stagger: 0.15,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: block,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  });
});
