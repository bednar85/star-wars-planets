export interface Filters {
  searchQuery: string;
  media: string;
  era: string[];
  myCanon: boolean;
}

export interface Appearance {
  title: string;
  year: string;
  media: string;
  era: string;
}

export interface Planet {
  id: number;
  name: string;
  appearances: Appearance[];
  description: string;
}
