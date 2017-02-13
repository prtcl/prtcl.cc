
const Vue = require('vue');

const store = require('app/store'),
      sections = require('app/components/sections.vue');

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

module.exports = app;

window.addEventListener('load', function () {
  app && app.run();
});
