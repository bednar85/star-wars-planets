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
