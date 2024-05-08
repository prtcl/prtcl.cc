import { Stack } from 'styled-system/jsx';
import Link from '~/components/Link';

export type LinkConfig = {
  title: string;
  url: string;
};

export const links: LinkConfig[] = [
  {
    title: "The Sounds and Patterns of Cory O'Brien's Aqueous Explorations",
    url: 'https://foxydigitalis.zone/2023/03/07/the-sounds-and-patterns-of-cory-obriens-aqueous-explorations/',
  },
  {
    title: 'TiberSynth Web Audio Synthesizer',
    url: 'https://tibersynth.cc/',
  },
  {
    title: 'SR01-22',
    url: 'https://coryobrien.bandcamp.com/album/sr01-22',
  },
  {
    title: 'Two Boats with Acoustic and Digital Resonators',
    url: 'https://coryobrien.bandcamp.com/album/two-boats-with-acoustic-and-digital-resonators',
  },
  {
    title: 'Central Park Binaural',
    url: 'https://coryobrien.bandcamp.com/album/central-park-binaural',
  },
];

const Projects = () => {
  return (
    <Stack gap={2} px={[3, 4]}>
      {links.map((link) => (
        <Link key={link.url} href={link.url} color="text" fontWeight={500}>
          {link.title}
        </Link>
      ))}
    </Stack>
  );
};

export default Projects;
