export type TestiminialCategory = typeof REVIEW_TYPES[number];
export type TestimonialProps = {
  image?: string
  name: string
  date: string
  rating?: number
  type: TestiminialCategory
};

export const REVIEW_TYPES = ['business', 'beauty', 'boudoir', 'pärchen', 'live', 'sport'] as const;

export type Testimonial = {
  id: string
  frontmatter: TestimonialProps
  html: string | null
};

const ADVERTISED_CATEGORIES: Array<TestiminialCategory> = ['beauty', 'boudoir', 'sport', 'pärchen'];

export function hasAdvertisedCategory(props: TestimonialProps | TestiminialCategory): boolean {
  return ADVERTISED_CATEGORIES.includes(typeof props === 'string' ? props : props.type);
}
