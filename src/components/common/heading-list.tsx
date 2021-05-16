import { PostHeadingData } from '@/models/contentful/Post';
import { Box, Flex, Heading } from '@chakra-ui/layout';

const HeadingList = ({ headings }: { headings: PostHeadingData[] }) => {
  return (
    <Box p={3}>
      <Heading mb={4}>目次</Heading>
      <Box>
        {headings.length > 0 ? (
          <>
            {headings.map((h, n) => (
              <a
                area-label={h.text.slice(0, 100) + '...'}
                key={h.name + n}
                href={`#${h.name.replace(` `, `-`)}`}
              >
                <Flex mb={3} transitionDuration=".3s" opacity={0.7} _hover={{ opacity: 1 }}>
                  <Box fontSize="lg" color="gray.500" pr={3}>
                    {'#'.repeat(h.level)}
                  </Box>
                  <span>{h.name}</span>
                </Flex>
              </a>
            ))}
          </>
        ) : (
          <Box>編集担当者へ: 見出しつけてください</Box>
        )}
      </Box>
    </Box>
  );
};

export default HeadingList;
