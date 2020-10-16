export interface Appearance {
  title: string;
  year: string;
  media: string;
  era: string;
}

export interface Planet {
  name: string;
  appearances: Appearance[];
  description: string;
}
