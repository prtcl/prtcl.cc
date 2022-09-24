import { h, text, app } from 'hyperapp';
import './app.less';

const embeds = {
  asliomar: {
    width: '100%',
    height: '300',
    scrolling: 'no',
    frameborder: 'no',
    allow: 'autoplay',
    src: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1069275841&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true',
  },
  twoBoats: {
    style: { border: 0, width: '100%', height: '120px' },
    src: 'https://bandcamp.com/EmbeddedPlayer/album=2683632007/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/',
    seamless: true,
  },
};

const state = {
  links: [
    {
      title: 'Bandcamp',
      url: 'https://coryobrien.bandcamp.com',
    },
    {
      title: 'Github',
      url: 'https://github.com/prtcl'
    },
    {
      title: 'cory@prtcl.cc',
      url: 'mailto:cory@prtcl.cc'
    }
  ],
  projects: [
    {
      title: 'Release: Two Boats with Acoustic and Digital Resonators',
      url: 'https://coryobrien.bandcamp.com/album/two-boats-with-acoustic-and-digital-resonators'
    },
    {
      title: 'Release: Central Park Binaural',
      url: 'https://coryobrien.bandcamp.com/album/central-park-binaural',
    },
    {
      title: 'Release: Raw Croton',
      url: 'https://coryobrien.bandcamp.com/album/raw-croton'
    },
    {
      title: 'Release: Midtown Binaural',
      url: 'https://coryobrien.bandcamp.com/album/midtown-binaural',
    },
    {
      title: 'Compilation: Isolation',
      url: 'https://fuzzypanda.bandcamp.com/album/isolation',
    },
    {
      title: 'Software: TiberSynth',
      url: 'https://tibersynth.cc/'
    },
    {
      title: 'Release: Sympathetic Field Matrix',
      url: 'https://coryobrien.bandcamp.com/album/sympathetic-field-matrix',
    },
    {
      title: 'Release: Denser Materials',
      url: 'https://coryobrien.bandcamp.com/album/denser-materials',
    },
  ],
};

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
  h('main', { class: 'container' }, [
    h('section', {}, [
      content({ class: 'inverse' }, [
        h('p', {}, text('Cory O\'Brien is a software engineer and sound artist who lives in NYC')),
        h('ul', {}, links.map(link => h('li', {}, h('a', { href: link.url }, text(link.title))))),
      ]),
      stripes({ class: 'desktop' }),
    ]),
    h('section', {}, [
      embed({ type: 'asliomar' }),
      content({}, [
        h('h2', {}, text('Projects')),
        h('ul', {}, projects.map(link => h('li', {}, h('a', { href: link.url, target: '_blank' }, text(link.title))))),
      ]),
      spacer(),
      embed({ type: 'twoBoats' }),
    ]),
    h('section', {}, [
      h('img', { src: '/assets/tree-compressed.jpg' })
    ]),
  ]);

app({
  init: state,
  node: document.getElementById('app'),
  view: App,
});
