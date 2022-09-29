import { h } from 'hyperapp';
import './embed.less';

const EMBEDS = new Map([
  ['asliomar', {
    width: '100%',
    height: '300',
    scrolling: 'no',
    frameborder: 'no',
    allow: 'autoplay',
    src: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1069275841&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true',
  }],
  ['twoBoats', {
    style: { border: 0, width: '100%', height: '120px' },
    src: 'https://bandcamp.com/EmbeddedPlayer/album=2683632007/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/',
    seamless: true,
  }],
]);

const embed = (props) =>
  h('div', { class: `embed ${props.class || ''}`, style: props.style }, [
    h('iframe', EMBEDS.get(props.type)),
  ]);

export default embed;
