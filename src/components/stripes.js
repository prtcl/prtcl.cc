import { h } from 'hyperapp';
import './stripes.less';

const stripes = (props) =>
  h('div', { class: ['stripes', props.class || ''] }, []);

export default stripes;
