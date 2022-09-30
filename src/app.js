import { h, text, app } from 'hyperapp';
import './app.less';
import bio from './components/bio';
import content from './components/content';
import embed from './components/embed';
import image from './components/image';
import main from './components/main';
import section from './components/section';
import stripes from './components/stripes';
import { LINKS, PROJECTS, IMAGES, EMBEDS } from './data';

const App = ({ projects, links, images, embeds }) =>
  main({}, [
    section([
      bio({ links }),
      stripes({ class: 'desktop' }),
    ]),
    section([
      embed(embeds.asliomar),
      content({}, [
        h('h2', {}, text('Projects')),
        h('ul', {}, projects.map(link =>
          h('li', {}, h('a', { href: link.url, target: '_blank' }, text(link.title)))
        )),
      ]),
      embed(embeds.twoBoats),
    ]),
    section([
      image(images.tree),
    ]),
  ]);

app({
  init: {
    embeds: EMBEDS,
    images: IMAGES,
    links: LINKS,
    projects: PROJECTS,
  },
  node: document.getElementById('app'),
  view: App,
});
