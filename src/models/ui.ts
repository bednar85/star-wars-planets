export type Era = 'Prequel' | 'Original' | 'Sequel';

export interface Filters {
  searchQuery: string;
  media: string;
  era: Era[];
  myCanon: boolean;
}

export interface Appearance {
  title: string;
  year: string;
  media: string;
  era: Era;
}

export interface Planet {
  id: number;
  name: string;
  appearances: Appearance[];
  description: string;
}
