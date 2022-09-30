import { h, text } from 'hyperapp';
import content from './content';
import list from './list';

const projects = props =>
  content({}, [
    h('h2', {}, text('Projects')),
    list({ items: props.projects }),
  ]);

export default projects;
