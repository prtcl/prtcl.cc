import { h, text } from 'hyperapp';

const link = props =>
  h('a', { href: props.url, target: '_blank' }, text(props.title));

const list = props =>
  h('ul', {}, props.items.map(item =>
    h('li', {}, link(item))
  ));

export default list;
