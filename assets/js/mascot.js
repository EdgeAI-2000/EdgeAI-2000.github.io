// Pick one friendly footer pose on entry; leave it still while reading.
document.querySelectorAll('[data-mascot-random]').forEach((mascot) => {
  const poses = JSON.parse(mascot.dataset.poses);
  const choices = ['coffee', 'peeking', 'waving'];
  const selected = choices[Math.floor(Math.random() * choices.length)];
  mascot.setAttribute('viewBox', poses[selected].viewBox);
  const bounds = poses[selected].viewBox.split(' ');
  ['x', 'y', 'width', 'height'].forEach((attribute, index) => {
    mascot.querySelector('rect').setAttribute(attribute, bounds[index]);
  });
  mascot.dataset.pose = selected;
});

// The expression sheet is one full-size CDN image. SVG <image> does not
// honor loading="lazy", so the below-fold footer copy waits until it is near
// the viewport. Heading mascots stay immediate.
function revealDeferredMascot(mascot) {
  const image = mascot.querySelector('image[data-src]');
  if (!image) return;
  image.setAttribute('href', image.getAttribute('data-src'));
  image.removeAttribute('data-src');
}

const deferredMascots = document.querySelectorAll('[data-mascot-defer]');
if (deferredMascots.length) {
  if (typeof IntersectionObserver !== 'function') {
    deferredMascots.forEach(revealDeferredMascot);
  } else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealDeferredMascot(entry.target);
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '240px 0px' });
    deferredMascots.forEach((mascot) => observer.observe(mascot));
  }
}
