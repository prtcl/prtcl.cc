import { app } from 'hyperapp';
import './app.less';
import bio from './components/bio';
import embed from './components/embed';
import image from './components/image';
import main from './components/main';
import projects from './components/projects';
import section from './components/section';
import stripes from './components/stripes';
import { LINKS, PROJECTS, IMAGES, EMBEDS } from './data';

const App = (state) =>
  main({}, [
    section([
      bio({ links: state.links }),
      stripes({ class: 'desktop' }),
    ]),
    section([
      embed(state.embeds.asliomar),
      projects({ projects: state.projects }),
      embed(state.embeds.twoBoats),
    ]),
    section([
      image(state.images.tree),
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
