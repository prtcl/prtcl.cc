import { h } from 'hyperapp';
import './image.less';

const IMAGES = new Map([
  ['trees', { src: '/assets/tree-compressed.jpg' }]
]);

const image = (props) =>
  h('div', { class: 'image' }, [
    h('img', IMAGES.get(props.type)),
  ]);

export default image;
