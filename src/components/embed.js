import { h } from 'hyperapp';
import './embed.less';

const embed = (props) =>
  h('div', { class: 'embed' }, [
    h('iframe', props),
  ]);

export default embed;
