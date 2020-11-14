export type Media = 'All' | 'Film' | 'Episodes' | 'Spinoffs' | 'TV Series';
export type Era = 'Prequel' | 'Original' | 'Sequel';

export interface Filters {
  searchQuery: string;
  media: Media;
  era: Era[];
  myCanon: boolean;
}

export interface Appearance {
  title: string;
  year: string;
  media: Media;
  era: Era;
}

export interface Planet {
  id: number;
  name: string;
  appearances: Appearance[];
  description: string;
}
