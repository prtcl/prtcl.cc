import { h } from 'hyperapp';
import './image.less';

const image = (props) =>
  h('div', { class: 'image' }, [
    h('img', props),
  ]);

export default image;
