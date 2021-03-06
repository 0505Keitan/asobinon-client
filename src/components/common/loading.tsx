import { Center, Skeleton, Stack } from '@chakra-ui/react';

const Loading = () => (
  <Center w="full" h="full">
    <Stack>
      <Skeleton height="40px" />
      <Skeleton height="40px" />
      <Skeleton height="40px" />
    </Stack>
  </Center>
);

export default Loading;
