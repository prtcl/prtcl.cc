import './app.less';

const run = () => {
  const video = document.querySelector('.rain');

  video.play();
  video.playbackRate = 0.9;
};

window.addEventListener('load', run);
