export type ReviewCategory = typeof REVIEW_TYPES[number];
export type ReviewProps = {
  image?: string
  name: string
  date: string
  rating?: number
  type: ReviewCategory
};

export const REVIEW_TYPES = ['business', 'beauty', 'boudoir', 'pärchen', 'live', 'sport'] as const;

export type Review = {
  id: string
  frontmatter: ReviewProps
  html: string | null
};

const ADVERTISED_CATEGORIES: Array<ReviewCategory> = ['beauty', 'boudoir', 'sport', 'pärchen'];

export function hasAdvertisedCategory(props: ReviewProps | ReviewCategory): boolean {
  return ADVERTISED_CATEGORIES.includes(typeof props === 'string' ? props : props.type);
}
