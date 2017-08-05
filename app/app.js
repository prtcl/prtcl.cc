
import store from './store';
import visualization from './visualization';

const app = {
  store,
  visualization,
  run () {
    store.run();

    visualization
      .attach(document.body.querySelector('canvas'))
      .run();

    return this;
  }
};

export default app;

window.addEventListener('load', () => {
  app.run();
});
