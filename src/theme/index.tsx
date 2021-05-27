import { extendTheme } from '@chakra-ui/react';

import globalTheme from './globalTheme';

import { globalLayout } from './globalTheme';

export const ASIDE_WIDTH = globalLayout.asideWitdh;
export const MAIN_WIDTH = globalLayout.mainWidth;
export const LAYOUT_PADDING = globalLayout.layoutPadding;
export const LAYOUT_MAXW = globalLayout.maxW;
export const THEME_COLOR = '#2687e8';
export const OGP_W = globalLayout.ogp.w;
export const OGP_H = globalLayout.ogp.h;

export const theme = extendTheme(globalTheme);
