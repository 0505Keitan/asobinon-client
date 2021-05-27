import { ReactNode } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Meta from './meta';
import { ASIDE_WIDTH, LAYOUT_PADDING, MAIN_WIDTH } from '@/theme/index';
import Nav from './nav';
import LayoutFooter from './layout-footer';

interface LayoutProps {
  children: ReactNode;
  meta: {
    title: string;
    desc: string;
    ogpUrl?: string;
  };
  revalEnv?: number;
}

export default function Layout({ children, meta }: LayoutProps) {
  return (
    <>
      {/* OGPの生成 */}
      <Meta title={meta.title} desc={meta.desc} heroImageUrl={meta.ogpUrl} />
      <Box w="100vw">
        <Nav />

        <Flex
          minH="100vh"
          ml="auto"
          w={{ base: '100vw', lg: `calc(100vw - ${ASIDE_WIDTH + LAYOUT_PADDING}px)` }}
          flexDirection="column"
        >
          <Box
            as="main"
            mx="auto"
            pt={8}
            pb={8}
            overflowX="hidden"
            w={{ base: 'full', lg: `${MAIN_WIDTH}px` }}
            px={{ base: 3, lg: 0 }}
            flexGrow={1}
          >
            {children}
          </Box>
          <LayoutFooter maxW={MAIN_WIDTH} />
        </Flex>
      </Box>
    </>
  );
}
