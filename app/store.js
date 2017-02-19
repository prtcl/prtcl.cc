
import sections from './data/sections';

const state = {
  sections
};

export default {
  state,
  expandSection
};

function expandSection (id) {
  if (!id) return;
  sections.forEach((s) => {
    s.isExpanded = (s.id === id);
  });
}
