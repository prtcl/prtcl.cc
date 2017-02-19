
import store from './store';
import Visualization from './ui/visualization';

const app = {
  store,
  run () {
    this.visualization = new Visualization({
      el: document.body.querySelector('#visualization')
    });

    this.visualization.run();
    return this;
  }
};

export default app;

window.addEventListener('load', () => {
  window.app = app.run();
});
