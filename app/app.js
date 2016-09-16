
const Vue = require('vue');

const store = require('app/store');

const app = {};

app.run = function () {
  this.vm = new Vue({
    el: "#app-container",
    data: store.state,
    components: {
      sections: require('app/components/sections.vue')
    }
  });
  return this;
};

module.exports = app;
