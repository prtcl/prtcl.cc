import { h } from 'hyperapp';
import './stripes.less';

const stripes = (props) =>
  h('div', { class: props.class ? `stripes ${props.class}` : 'content' }, []);

export default stripes;
