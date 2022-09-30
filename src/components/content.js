import { h } from 'hyperapp';
import './content.less';

const content = (props, children) =>
  h('div', { class: ['content', props.inverse ? 'inverse' : ''] }, children);

export default content;
