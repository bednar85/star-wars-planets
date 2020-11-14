import { Era, Media } from './models/ui';

export const FILTER_KEY = {
  MEDIA: 'media',
  ERA: 'era',
  MY_CANON: 'myCanon'
};

export const MEDIA: {
  [x: string]: Media;
} = {
  ALL: 'All',
  FILM: 'Film',
  EPISODES: 'Episodes',
  SPINOFFS: 'Spinoffs',
  TV: 'TV Series'
};

export const ERA: {
  [x: string]: Era;
} = {
  PREQUEL: 'Prequel',
  ORIGINAL: 'Original',
  SEQUEL: 'Sequel'
};
