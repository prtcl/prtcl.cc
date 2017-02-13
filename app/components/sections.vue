<template>
<div class="sections">
  <section
    v-for="section in sections"
    track-by="$index"
    id="{{ section.id }}"
    >
    <h2
      @click="expandSection(section.id)"
      >
      {{ section.title }}
      <i
        v-if="!section.isExpanded"
        class="fa fa-plus-square-o"
        >
      </i>
      <i
        v-if="section.isExpanded"
        class="fa fa-minus-square-o"
        >
      </i>
    </h2>
    <div
      v-if="section.isExpanded"
      class="content"
      >
      <div
        v-for="item in section.items"
        class="item"
        >
        <h3
          v-if="item.title"
          >
          {{ item.title }}
        </h3>
        <div
          v-if="item.embedCode"
          class="embed {{ item.embedType }}"
          >
          {{{ item.embedCode }}}
        </div>
        <p>
          <span
            v-if="item.description"
            class="description"
            >
            {{ item.description }}
          </span>
          <span
            v-if="item.link"
            class="link"
            >
            <a href="{{ item.link }}" target="_blank">{{ item.link }}</a>
          </span>
        </p>
      </div>
    </div>
  </section>
</div>
</template>

<script>

const store = require('app/store');

module.exports = {
  data () {
    return {};
  },
  computed: {
    sections () {
      return store.state.sections;
    }
  },
  methods: {
    expandSection (id) {
      store.expandSection(id);
    }
  }
};

</script>
