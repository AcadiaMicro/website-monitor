import { SeoMetaTagType } from 'react-datocms';

interface ArticleType {
  headline: string;
  slug: string;
  author: AuthorType;
  date: string;
  body: string;
  image: BlogImageType;
  featuredBlog: boolean;
  featuredHomepage: boolean;
  featuredImage: BlogImageType;
  seo: Array<SeoMetaTagType>;
}

interface AuthorType {
  name: string;
}

interface BlogImageType {
  alt: string;
  title: string;
  url: string;
  responsiveImage?: { [key: string]: string };
}

export interface CustomPageType {
  slug: string;
  customContent?: HtmlCssType;
  includeHeader: boolean;
  includeFooter: boolean;
  seo: Array<SeoMetaTagType>;
}

export interface DefaultContentPageType {
  slug: string;
  helpEmail: string;
  helpPhoneNumber: string;
  faqCategory: FAQCategory;
  seo?: Array<SeoMetaTagType>;
}

interface FAQType {
  question: string;
  answer: string;
}

export interface FAQCategoryType {
  name: string;
  faqs: Array<FAQType>;
}

interface FeatureType {
  name: string;
  description: string;
  image: ImageType;
}

interface HeaderType {
  header: string;
  subheader: string;
}

interface HtmlCssType {
  html: string;
  css: string;
}

interface ImageType {
  slug: string;
}

export interface JobAdditionalContentType {
  text: string;
}

export interface JobType {
  slug: string;
  jobPosition: string;
  jobDescription: string;
  additionalContent?: Array<JobAdditionalContentType>;
  seo?: Array<SeoMetaTagType>;
}

interface LandingPageHeaderType {
  title: string;
  logos: HtmlCssType;
}

export interface LandingPageType {
  slug: string;
  vid: string;
  wid?: string;
  brand?: string;
  header: LandingPageHeaderType;
  offer: HtmlCssType;
  helpEmail: string;
  helpPhoneNumber: string;
  customContent?: HtmlCssType;
  faqCategory: FAQCategory;
  seo: Array<SeoMetaTagType>;
}

export interface PolicyType {
  effectiveDate: string;
  title: string;
  slug: string;
  content: string;
  seo: Array<SeoMetaTagType>;
}

export interface StatePageType {
  state: string;
  slug: string;
  image: ImageType;
  title: string;
  summary: string;
  content: string;
  enrollment: string;
  billing: string;
  resources?: string;
  seo: Array<SeoMetaTagType>;
}

export interface TownPageType {
  town: string;
  slug: string;
  state: string;
  title: string;
  summary: string;
  content: string;
  resources: string;
  featuresHeadline: Array<HeadlineType>;
  featuresList: Array<FeatureType>;
  seo: Array<SeoMetaTagType>;
}
