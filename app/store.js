
const sections = require('app/data/sections');

for (var i = sections.length - 1; i >= 0; i--) {
  sections[i].isExpanded = false;
}

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
};
