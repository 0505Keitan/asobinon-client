/// <reference types="next" />
/// <reference types="next/types/global" />

declare module 'react-gtm-module';
declare module 'react-firebase-file-uploader';
declare module 'uuid';

// https://sunday-morning.app/posts/2020-12-09-nextjs-google-analytics
interface Window {
  gtag(type: 'config', googleAnalyticsId: string, { page_path: string });
  gtag(
    type: 'event',
    eventAction: string,
    fieldObject: {
      event_label: string;
      event_category: string;
      value?: number;
    },
  );
}

interface Window {
  dataLayer: { [key: string]: unknown }[];
}
