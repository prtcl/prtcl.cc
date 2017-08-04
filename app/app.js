
import store from './store';
import visualization from './visualization';

const app = {
  store,
  visualization,
  run () {
    store.run();

    const canvas = document.body.querySelector('canvas');

    visualization
      .attach(canvas)
      .run();

    return this;
  }
};

export default app;

window.addEventListener('load', () => {
  app.run();
});
