import { h, text, app } from 'hyperapp';
import './app.less';
import { embeds, links, projects } from './data';
import main from './components/main';
import section from './components/section';

const embed = (props) =>
  h('div', { class: 'embed' }, [
    h('iframe', embeds[props.type]),
  ]);

const content = (props, children) =>
  h('div', { class: props.class ? `content ${props.class}` : 'content' }, children);

const spacer = () => h('div', { style: { height: '1em' } }, []);

const stripes = (props) =>
  h('div', { class: props.class ? `stripes ${props.class}` : 'content' }, []);

const App = ({ projects, links }) =>
  main({}, [
    section({}, [
      content({ class: 'inverse' }, [
        h('p', {}, text('Cory O\'Brien is a software engineer and sound artist who lives in NYC')),
        h('ul', {}, links.map(link => h('li', {}, h('a', { href: link.url }, text(link.title))))),
      ]),
      stripes({ class: 'desktop' }),
    ]),
    section({}, [
      embed({ type: 'asliomar' }),
      content({}, [
        h('h2', {}, text('Projects')),
        h('ul', {}, projects.map(link => h('li', {}, h('a', { href: link.url, target: '_blank' }, text(link.title))))),
      ]),
      spacer(),
      embed({ type: 'twoBoats' }),
    ]),
    section({}, [
      h('img', { src: '/assets/tree-compressed.jpg' })
    ]),
  ]);

app({
  init: { links, projects },
  node: document.getElementById('app'),
  view: App,
});
