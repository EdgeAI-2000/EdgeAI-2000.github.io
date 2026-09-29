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
