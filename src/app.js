import './app.less';

const resize = () => {
  const height = `${window.innerHeight}px`;

  document.body.height = document.body.style.height = height;
};

const run = () => {
  const video = document.querySelector('.rain');

  video.playbackRate = 0.8;

  document.addEventListener('touchend', () => {
    video.play();
  });

  resize();
};

window.addEventListener('resize', resize);
window.addEventListener('load', run);
