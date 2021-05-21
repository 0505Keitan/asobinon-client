import Head from 'next/head';
import { SITE_NAME } from '@/lib/constants';
import { THEME_COLOR } from '@/theme/index';
interface Props {
  desc: string;
  title: string;
  heroImageUrl?: string;
}

export default function Meta({ desc, title, heroImageUrl }: Props) {
  const ogpUrl = heroImageUrl ?? process.env.HTTPS_URL + '/ogp/ogp-1200x630.png';

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        {/* アイコン */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" sizes="16x16" type="image/png" href="/favicon-16x16.png" />
        <link rel="icon" sizes="32x32" type="image/png" href="/favicon-32x32.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content={THEME_COLOR}></meta>

        <meta property="og:title" key="ogTItle" content={title} />
        <meta property="og:site_name" key="ogSiteName" content={title} />
        <meta property="og:description" key="ogDescription" content={desc} />
        <meta name="description" content={desc} />
        <meta property="og:image" content={ogpUrl} />
        <meta property="og:image" key="ogImage" content={ogpUrl} />
        <meta name="twitter:card" key="twitterCard" content="summary_large_image" />
        <meta name="twitter:image" key="twitterImage" content={ogpUrl} />

        <title>{title == SITE_NAME ? SITE_NAME : title + ' | ' + SITE_NAME}</title>
      </Head>
    </>
  );
}
