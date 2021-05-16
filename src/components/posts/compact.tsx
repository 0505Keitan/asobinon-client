import { Post } from '@/models/markdown';
import { Button } from '@chakra-ui/button';
import { Badge, Box, Heading, Stack } from '@chakra-ui/layout';
import LinkChakra from '../common/link-chakra';

export default function PostCompact({ post }: { post: Post }) {
  return (
    <Box p={6} shadow="xl" rounded="xl" border="gray.300">
      <Stack spacing={4} mb={4}>
        <Heading>{post.title}</Heading>
        <Box>
          <Badge>{post.date}</Badge>
        </Box>
      </Stack>
      <Button as={LinkChakra} href={`/posts/${post.id}`}>
        Read more
      </Button>
    </Box>
  );
}
