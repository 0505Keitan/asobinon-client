import { Post } from '@/models/markdown';
import { Badge, Box, Divider, Heading, Stack } from '@chakra-ui/react';

export default function PostSingle({ post }: { post: Post }) {
  return (
    <Box>
      <Stack spacing={2} mb={6}>
        <Heading as="h1">{post.title}</Heading>
        <Box>
          <Badge>{post.date}</Badge>
        </Box>
      </Stack>
      <Divider />
      {post.contentHtml ? (
        <Box>
          <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        </Box>
      ) : (
        <Box>本文なし</Box>
      )}
    </Box>
  );
}
