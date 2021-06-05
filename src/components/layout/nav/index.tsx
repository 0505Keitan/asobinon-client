import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, Button, CloseButton, Flex, HStack, Stack, useColorMode } from '@chakra-ui/react';
import { ASIDE_WIDTH, LAYOUT_PADDING } from '@/theme/index';
import ColorSwitch from '../color-switch';
import Logo from '@/components/common/Logo';
import * as gtag from '@/lib/gtag';
import FaiconDiv from '@/components/common/faicon-div';
import LinkChakra from '@/components/common/link-chakra';
import CreateIssue from '@/components/common/create-issue';

const SignInComponent = dynamic(() => import('./signin'), { ssr: false });

// https://dev.to/guimg/hide-menu-when-scrolling-in-reactjs-47bj

export default function Nav() {
  const { colorMode } = useColorMode();
  const [isOpen, setIsOpen] = useState(false);
  const leftValue = () => {
    if (isOpen) {
      return 0;
    } else {
      // 左にずらして隠す
      return { base: `-${ASIDE_WIDTH + LAYOUT_PADDING}px`, lg: 0 };
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
          w={`${ASIDE_WIDTH}px`}
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
            <Stack spacing={6} pb={8} w="full">
              <Box>
                <Logo logoSelection="square" />
              </Box>
              <ColorSwitch />
              <Box>
                <SignInComponent />
              </Box>

              <CreateIssue />

              <Stack spacing={2}>
                <Button
                  leftIcon={<FaiconDiv icon={['fas', 'thumbs-up']} />}
                  as={LinkChakra}
                  href="/buy"
                >
                  支援する
                </Button>
                <Button
                  leftIcon={<FaiconDiv icon={['fas', 'thumbs-down']} />}
                  as={LinkChakra}
                  href="/feedback/list"
                >
                  対応が必要なページ
                </Button>

                <Button
                  leftIcon={<FaiconDiv icon={['fas', 'comment-alt']} />}
                  as={LinkChakra}
                  href="/contact"
                >
                  お問い合わせ
                </Button>

                <Button
                  leftIcon={<FaiconDiv icon={['fas', 'book']} />}
                  as={LinkChakra}
                  href="https://asobinon.org/eula/"
                  isExternal
                >
                  利用規約
                </Button>
                <Button
                  leftIcon={<FaiconDiv icon={['fas', 'book']} />}
                  as={LinkChakra}
                  href="https://asobinon.org/code-of-conduct/"
                  isExternal
                >
                  行動規範
                </Button>
                <Button
                  leftIcon={<FaiconDiv icon={['fas', 'user']} />}
                  as={LinkChakra}
                  href="https://asobinon.org/privacy-policy/"
                  isExternal
                >
                  プライバシーポリシー
                </Button>
                <Button leftIcon={<FaiconDiv icon={['fas', 'book']} />} as={LinkChakra} href="/law">
                  特定商取引法に基づく表示
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Flex>
      </Box>

      {/* これが上のメニュー */}
      <Box
        zIndex={5}
        top={0}
        left={0}
        pt={1}
        as="nav"
        w="100vw"
        alignItems="center"
        position="fixed"
      >
        <HStack
          px={3}
          ml="auto"
          w={{ base: '100vw', lg: `calc(100vw - ${ASIDE_WIDTH + LAYOUT_PADDING}px)` }}
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
        </HStack>
      </Box>
    </>
  );
}
