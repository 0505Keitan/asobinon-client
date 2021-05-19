import { nsfwColor } from '@/lib/nsfw-color';
import { NsfwLevel } from '@/models/nsfw';
import { Box, Stack } from '@chakra-ui/react';
import LinkChakra from './link-chakra';

const NsfwWarning = ({ nsfw }: { nsfw: NsfwLevel }) => {
  return (
    <Stack
      bg={nsfwColor(nsfw ?? 0)}
      fontWeight="bold"
      background="red.500"
      color="white"
      p={6}
      rounded="xl"
    >
      <Box>
        <Box fontSize="xl">警告レベル: {nsfw}</Box>
        <Box>厳正に処罰します。</Box>
      </Box>
      <Box>
        <LinkChakra href="/posts/eula">利用規約</LinkChakra>
        に反した投稿は即刻削除します。
      </Box>
    </Stack>
  );
};
export default NsfwWarning;
