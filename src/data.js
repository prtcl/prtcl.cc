const data = {
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
  images: {
    tree: { src: '/assets/tree-compressed.jpg' },
  },
  embeds: {
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
  }
};

export default data;
