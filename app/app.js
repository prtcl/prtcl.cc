
import store from './store';

const app = {
  store,
  run () {

    return this;
  }
};

export default app;

window.addEventListener('load', () => {
  window.app = app.run();
});
