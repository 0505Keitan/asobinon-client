import { SITE_DESC, SITE_NAME } from '@/lib/constants';
import { Post } from '@/models/contentful/Post';

interface GraphSchema {
  '@context': string;
  '@graph': Graph[];
}

interface Graph {
  '@type': string;
  '@id': string;
  url?: string;
  name?: string;
  description?: string;
  publisher?: Breadcrumb;
  itemListElement?: ItemListElement[];
  image?: Image;
  sameAs?: string[];
  inLanguage?: string;
  isPartOf?: Breadcrumb;
  breadcrumb?: Breadcrumb;
  author?: Breadcrumb | string;
  creator?: string;
  primaryImageOfPage?: Breadcrumb;
  datePublished?: string;
  dateModified?: string;
  headline?: string;
  articleSection?: string;
  mainEntityOfPage?: Breadcrumb;
}

interface Breadcrumb {
  '@id': string;
}

interface Image {
  '@type': string;
  '@id': string;
  url: string;
  width?: string;
  height?: string;
  caption?: string;
}

interface ItemListElement {
  '@type': string;
  '@id': string;
  position: string;
  item: Item;
  nextItem?: string;
  previousItem?: string;
}

interface Item {
  '@id': string;
  name: string;
  description: string;
  url: string;
}

const generateGraphSchema = (post: Post): GraphSchema => {
  const defaultOgp = process.env.HTTPS_URL + '/api/ogpgen?text=' + encodeURIComponent(post.title);
  return {
    '@context': 'http://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${process.env.HTTPS_URL}/#website`,
        url: process.env.HTTPS_URL,
        name: SITE_NAME,
        description: SITE_DESC,
        publisher: {
          '@id': `${process.env.HTTPS_URL}/#organization`,
        },
      },
      {
        '@type': 'Organization',
        '@id': `${process.env.HTTPS_URL}/#organization`,
        name: 'アエルヨネ',
        url: 'https://aely.one/',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${process.env.HTTPS_URL}/${post.slug}#breadcrumblist`,
        itemListElement: [
          {
            '@type': 'ListItem',
            '@id': `${process.env.HTTPS_URL}/#listItem`,
            position: '1',
            item: {
              '@id': `${process.env.HTTPS_URL}/#item`,
              name: 'ホーム',
              description: SITE_DESC,
              url: process.env.HTTPS_URL ?? '',
            },
            nextItem: `${process.env.HTTPS_URL}/${post.slug}/#listItem`,
          },
          {
            '@type': 'ListItem',
            '@id': `${process.env.HTTPS_URL}/${post.slug}/#listItem`,
            position: '2',
            item: {
              '@id': `${process.env.HTTPS_URL}/${post.slug}/#item`,
              name: post.title,
              description: post.description ?? post.title,
              url: `${process.env.HTTPS_URL}/${post.slug}/`,
            },
            previousItem: `${process.env.HTTPS_URL}/#listItem`,
          },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `${process.env.HTTPS_URL}/${post.slug}/#webpage`,
        url: `${process.env.HTTPS_URL}/${post.slug}/`,
        name: post.title,
        description: post.description ?? post.title,
        inLanguage: 'ja',
        isPartOf: {
          '@id': `${process.env.HTTPS_URL}/#website`,
        },
        breadcrumb: {
          '@id': `${process.env.HTTPS_URL}/${post.slug}/#webpage`,
        },
        author: `${process.env.HTTPS_URL}/persons/${post.person?.slug}#author`,
        creator: `${process.env.HTTPS_URL}/persons/${post.person?.slug}#author`,
        image: {
          '@type': 'ImageObject',
          '@id': `${process.env.HTTPS_URL}/#mainImage`,
          url: post.heroImage != undefined ? post.heroImage.url : defaultOgp,
        },
        primaryImageOfPage: {
          '@id': `${process.env.HTTPS_URL}/${post.slug}/#mainImage`,
        },
        datePublished: post.sys.firstPublishedAt,
        dateModified: post.sys.publishedAt,
      },
      {
        '@type': 'BlogPosting',
        '@id': `${process.env.HTTPS_URL}/${post.slug}/#blogposting`,
        name: post.title,
        description: post.description ?? post.title,
        headline: post.title,
        author: {
          '@id': `${process.env.HTTPS_URL}/persons/${post.person?.slug}#author`,
        },
        publisher: {
          '@id': `${process.env.HTTPS_URL}/#organization`,
        },
        datePublished: post.sys.firstPublishedAt,
        dateModified: post.sys.publishedAt,
        mainEntityOfPage: {
          '@id': `${process.env.HTTPS_URL}/${post.slug}/#webpage`,
        },
        isPartOf: {
          '@id': `${process.env.HTTPS_URL}/${post.slug}/#webpage`,
        },
        image: {
          '@type': 'ImageObject',
          '@id': `${process.env.HTTPS_URL}/${post.slug}/#articleImage`,
          url: post.heroImage != undefined ? post.heroImage.url : defaultOgp,
        },
      },
    ],
  };
};

export default generateGraphSchema;
