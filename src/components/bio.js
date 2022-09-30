import { h, text } from 'hyperapp';
import content from './content';
import list from './list';

const bio = props =>
  content({ inverse: true }, [
    h('p', {}, text('Cory O\'Brien is a software engineer and sound artist who lives in NYC')),
    list({ items: props.links }),
  ]);

export default bio;
