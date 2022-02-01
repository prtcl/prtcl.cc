import { h, text, app } from 'hyperapp';
import './app.less';

const App = () =>
  h('main', { class: 'main' }, [
    h('p', {}, text('Cory O\'Brien is a ')),
    h('p', {}, h('a', { href: 'https://github.com/prtcl' }, text('software engineer'))),
    h('p', {}, text(' and ')),
    h('p', {}, h('a', { href: 'https://coryobrien.bandcamp.com' }, text('sound artist'))),
    h('p', {}, text(' who lives in NYC')),
  ]);

app({
  node: document.getElementById('app'),
  view: App,
});
