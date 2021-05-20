import { createBreakpoints } from '@chakra-ui/theme-tools';

export const globalLayout = {
  asideWitdh: 300,
  mainWidth: 900,
  layoutPadding: 30,
  maxW: 0,
  ogp: {
    w: 1300,
    h: 650,
  },
};

globalLayout.maxW = globalLayout.asideWitdh + globalLayout.mainWidth + globalLayout.layoutPadding;

export const customBreakPoints = createBreakpoints({
  sm: '30em',
  //md: "48em",
  md: `${globalLayout.mainWidth / 16}em`,
  lg: `${globalLayout.maxW / 16}em`,
  xl: '80em',
  '2xl': '96em',
});

// Do not name this 'theme' since this must be 'extended' with 'extendTheme'
const globalTheme = {
  breakpoints: customBreakPoints,
  textStyles: {
    h1: {
      fontSize: ['28px', '36px'],
      fontWeight: 'bold',
      lineHeight: '110%',
      letterSpacing: '-2%',
    },
    h2: {
      fontSize: ['26px', '34px'],
      fontWeight: 'semibold',
      lineHeight: '110%',
      letterSpacing: '-1%',
    },
    h3: {
      fontSize: ['24px', '32px'],
      fontWeight: 'semibold',
      lineHeight: '110%',
      letterSpacing: '-1%',
    },
    h4: {
      fontSize: ['22px', '24px'],
      fontWeight: 'semibold',
      lineHeight: '110%',
      letterSpacing: '-1%',
    },
    h5: {
      fontSize: ['20px', '28px'],
      fontWeight: 'semibold',
      lineHeight: '110%',
      letterSpacing: '-1%',
    },
    h6: {
      fontSize: ['11px', '14px'],
      fontWeight: 'semibold',
      lineHeight: '110%',
      letterSpacing: '-1%',
    },
  },
  styles: {
    global: {
      p: {
        marginTop: '1rem',
        marginBottom: '1.4rem',
      },
      'h1,h2,h3,h4': {
        marginTop: '1.8rem',
        marginBottom: '1.4rem',
        fontSize: '1.4rem',
      },
      h2: {
        fontSize: '2rem',
      },
      h3: {
        fontSize: '1.7rem',
      },
      'ul,ol': {
        marginLeft: '1.4rem',
      },
      ul: {
        listStyle: 'disc',
      },
      li: {
        marginBottom: '0.4rem',
      },
      'li>ul, li>ol': {
        marginTop: '1rem',
        marginBottom: '1.4rem',
        marginLeft: '2.6rem',
      },
    },
  },
};

export default globalTheme;
