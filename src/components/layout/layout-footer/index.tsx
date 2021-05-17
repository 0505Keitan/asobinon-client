import { VERCEL_LAST_COMMIT, VERCEL_LAST_COMMIT_MESSAGE } from '@/lib/constants';
import { Box, Container, Flex, Stack, Badge } from '@chakra-ui/react';
import LinkChakra from '@/components/common/link-chakra';

interface FooterProps {
  maxW: number;
}

const LayoutFooter = ({ maxW }: FooterProps) => {
  return (
    <Box as="footer" w="full" background="gray.700" py={8}>
      <Container maxW={`${maxW}px`}>
        <Flex
          flexDirection={{ base: 'column', md: 'row' }}
          justifyContent={{ base: 'center', lg: 'space-between' }}
          alignItems={{ base: 'center', lg: 'flex-end' }}
          px={{ base: 3, lg: 0 }}
        >
          <Box color="white">
            <Box mb={3}>これは「ASOBINON」の編集補助を担うWebアプリケーションです</Box>
            <Stack direction="column">
              <Box>
                <Badge maxW="20rem" whiteSpace="nowrap" textTransform="none" isTruncated>
                  Last commit:{' '}
                  <LinkChakra href={VERCEL_LAST_COMMIT}>{VERCEL_LAST_COMMIT_MESSAGE}</LinkChakra>
                </Badge>
              </Box>
            </Stack>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default LayoutFooter;
