export interface Author {
  name: string;
  isHighlighted?: boolean;
  isCorresponding?: boolean;
  isCoAuthor?: boolean;
}

export interface Publication {
  id: string;
  title: string;
  authors: Author[];
  abstract?: string;
  journal?: string;
  conference?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  year: number;
  month?: string;
  doi?: string;
  url?: string;
  code?: string;
  type: PublicationType;
  bibtex?: string;
  selected?: boolean;
  preview?: string;
  description?: string;
}

export type PublicationType =
  | 'journal'
  | 'conference'
  | 'workshop'
  | 'book-chapter'
  | 'book'
  | 'thesis'
  | 'preprint'
  | 'patent'
  | 'technical-report';
