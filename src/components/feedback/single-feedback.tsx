import { Feedback } from '@/models/firestore/feedback';
import { Badge, Box, Flex, Stack } from '@chakra-ui/layout';
import FaiconDiv from '../common/faicon-div';
import LinkChakra from '../common/link-chakra';

const SingleFeedback = ({ feedback }: { feedback: Feedback }) => {
  const good = feedback.good ?? 0;
  const bad = feedback.bad ?? 0;
  const ratio = (good / (good + bad)) * 100;
  let noRatio = false;
  if (good + bad == 0) {
    noRatio = true;
  }

  const actualPath =
    process.env.DOCS_URL +
    feedback.path
      .replace('/docs', '')
      .replace('index.md', '')
      .replace(`.md`, '')
      .replace(/[0-9]\-/g, '');

  return (
    <Stack p={3} border="gray.500" shadow="lg" borderWidth={2} spacing={4} rounded="xl">
      <Box>
        <LinkChakra isExternal href={actualPath}>
          <Badge textTransform="none">{actualPath}</Badge>
        </LinkChakra>
      </Box>
      <Flex
        fontSize="xl"
        alignContent="center"
        justifyContent="space-between"
        fontWeight="bold"
        w="full"
        position="relative"
      >
        <Box>
          <Box aria-label="高評価" color="blue.500">
            <FaiconDiv w={'22px'} icon={['fas', 'thumbs-up']} />
          </Box>
          <b>Like {good}</b>
        </Box>
        <Box>
          <Box aria-label="低評価" color="gray.500">
            <FaiconDiv w={'22px'} icon={['fas', 'thumbs-down']} />
          </Box>
          <b> Dis {bad}</b>
        </Box>
      </Flex>
      <Flex w="full" h={3}>
        {noRatio ? (
          <>
            <Box w="50%" h="full" bg="gray.300"></Box>
            <Box w="50%" h="full" bg="gray.300"></Box>
          </>
        ) : (
          <>
            <Box w={noRatio ? 50 : `${ratio}%`} h="full" bg="blue.500"></Box>
            <Box w={`${100 - ratio}%`} h="full" bg="red.500"></Box>
          </>
        )}
      </Flex>
    </Stack>
  );
};
export default SingleFeedback;
