export type ActiveTab = 'puzzle' | 'coloring' | 'meter' | 'finale';

export interface ColoringTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  svgData?: string;
  imageUrl?: string;
}

export interface Stamp {
  id: string;
  icon: string;
  label: string;
}

export interface SavedArtwork {
  id: string;
  title: string;
  dataUrl: string;
  createdAt: string;
}
