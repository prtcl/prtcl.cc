
import Vue from 'vue';

import store from './store';
import sections from './components/sections.vue';

const app = {
  run () {
    this.vm = new Vue({
      el: '#app-container',
      data: store.state,
      components: {
        sections
      }
    });
    return this;
  }
};

export default app;

window.addEventListener('load', () => {
  app && app.run();
});
