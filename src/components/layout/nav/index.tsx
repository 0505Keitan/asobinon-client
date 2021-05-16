import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Box,
  Button,
  CloseButton,
  Flex,
  HStack,
  Spacer,
  Stack,
  useColorMode,
} from '@chakra-ui/react';
import { ASIDE_WITDH, LAYOUT_PADDING, NAV_HEIGHT } from '@/theme/index';
import ColorSwitch from '../color-switch';
import Logo from '@/components/common/Logo';
import * as gtag from '@/lib/gtag';
import SearchBox from '@/components/common/search-box';
import FaiconDiv from '@/components/common/faicon-div';

const SignInComponent = dynamic(() => import('./signin'), { ssr: false });

const layoutSwitch = {
  search: 'md',
  logo: 'lg',
};

// https://dev.to/guimg/hide-menu-when-scrolling-in-reactjs-47bj

export default function Nav() {
  const { colorMode } = useColorMode();
  const [isOpen, setIsOpen] = useState(false);
  const leftValue = () => {
    if (isOpen) {
      return 0;
    } else {
      // 左にずらして隠す
      return { base: `-${ASIDE_WITDH + LAYOUT_PADDING}px`, lg: 0 };
    }
  };
  return (
    <>
      {/* 開いた時にメニュー以外を押して閉じるため */}
      <Box
        position="fixed"
        w={isOpen ? `100vw` : 0}
        h="100vh"
        top={0}
        left={0}
        opacity={isOpen ? 0.5 : 0}
        bg="black"
        transitionProperty="opacity"
        transitionDuration=".3s"
        as="button"
        onClick={() => setIsOpen(false)}
        zIndex={6}
      ></Box>
      {/* これは左固定メニュー */}
      <Box
        top={0}
        left={leftValue()}
        position="fixed"
        as="aside"
        sx={{ '.noScrollBar::-webkit-scrollbar': { display: 'none' } }}
        h="100vh"
        px={3}
        bg={colorMode == 'light' ? 'white' : '#1A202C'}
        shadow={{ base: 'xl', lg: 'none' }}
        transitionProperty="left"
        transitionDuration=".3s"
        borderRight="gray.400"
        borderRightWidth={2}
        zIndex={6}
      >
        <Flex
          w={`${ASIDE_WITDH}px`}
          flexDir="column"
          h="full"
          overflowY="scroll"
          className="noScrollBar"
          py={3}
        >
          <CloseButton
            display={{ base: 'block', lg: 'none' }}
            onClick={() => {
              setIsOpen(false);
              if (typeof window !== 'undefined') {
                gtag.event({
                  action: 'closeDrawer',
                  category: 'GUI',
                  label: 'ドロワーメニューを閉じる',
                });
              }
            }}
          />
          <Stack flexGrow={1} h="auto">
            <Stack pb={8} display={{ base: 'none', lg: 'block' }}>
              <Box pb={6} display={{ base: 'block', [layoutSwitch.logo]: 'none' }}>
                <Logo logoSelection="square" />
              </Box>

              <Box display={{ base: 'block', [layoutSwitch.search]: 'none' }}>
                <SearchBox />
              </Box>
            </Stack>
          </Stack>
        </Flex>
      </Box>

      {/* これが上のメニュー */}
      <Box
        zIndex={5}
        bg={colorMode == 'light' ? 'white' : '#1A202C'}
        h={`${NAV_HEIGHT}px`}
        top={0}
        left={0}
        as="nav"
        w="100vw"
        pt="0.4rem"
        pb="0.1rem"
        borderBottom="gray.400"
        borderBottomWidth={2}
        position="fixed"
      >
        <HStack
          px={3}
          ml="auto"
          w={{ base: '100vw', lg: `calc(100vw - ${ASIDE_WITDH + LAYOUT_PADDING}px)` }}
        >
          <Button
            display={{ base: 'block', lg: 'none' }}
            zIndex={10}
            mr={3}
            pr={2}
            colorScheme="blue"
            leftIcon={<FaiconDiv icon={['fas', 'bars']} />}
            onClick={() => {
              setIsOpen(true);
              if (typeof window !== 'undefined') {
                gtag.event({
                  action: isOpen ? 'closeDrawer' : 'openDrawer',
                  category: 'GUI',
                  label: `ドロワーメニューを${isOpen ? '閉じる' : '開く'}`,
                });
              }
            }}
          />
          <Box pr={4} display={{ base: 'none', [layoutSwitch.logo]: 'block' }}>
            <Logo logoSelection="square" />
          </Box>
          <ColorSwitch /> <Spacer />
          <Box>
            <SignInComponent />
          </Box>
          <Box display={{ base: 'none', [layoutSwitch.search]: 'block' }}>
            <SearchBox />
          </Box>
        </HStack>
      </Box>
    </>
  );
}
