(function () {
  function initCarousel(root) {
    if (!root || root.dataset.yynCarouselReady === '1') return;
    root.dataset.yynCarouselReady = '1';

    const slides = Array.from(root.querySelectorAll('.yyn-carousel-slide'));
    const prev = root.querySelector('.yyn-carousel-prev');
    const next = root.querySelector('.yyn-carousel-next');
    const counter = root.querySelector('.yyn-carousel-counter');
    const caption = root.querySelector('.yyn-carousel-caption');
    let index = 0;

    function show(i) {
      if (!slides.length) return;
      index = (i + slides.length) % slides.length;
      slides.forEach((slide, idx) => {
        const active = idx === index;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
      if (counter) counter.textContent = `${index + 1} / ${slides.length}`;
      if (caption) {
        const current = slides[index];
        caption.textContent = current.dataset.caption || current.querySelector('img')?.alt || '';
      }
    }

    if (prev) prev.addEventListener('click', () => show(index - 1));
    if (next) next.addEventListener('click', () => show(index + 1));

    root.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') show(index - 1);
      if (event.key === 'ArrowRight') show(index + 1);
    });

    show(0);
  }

  function initAllCarousels() {
    document.querySelectorAll('.yyn-carousel').forEach(initCarousel);
  }

  if (typeof document$ !== 'undefined') {
    document$.subscribe(initAllCarousels);
  } else {
    document.addEventListener('DOMContentLoaded', initAllCarousels);
  }
})();
