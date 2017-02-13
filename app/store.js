
const sections = require('app/data/sections');

const state = {
  sections
};

module.exports = {
  state,
  expandSection
};

function expandSection (id) {
  if (!id) return;
  sections.forEach((s) => {
    s.isExpanded = (s.id === id);
  });
}
