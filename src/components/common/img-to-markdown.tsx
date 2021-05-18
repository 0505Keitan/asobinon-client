import { Button } from '@chakra-ui/button';
import { Box, Code, Stack } from '@chakra-ui/layout';

export default function ImgToMarkdown({ src }: { src: string }) {
  const md = `![](${src})`;
  return (
    <Stack spacing={6}>
      <img src={src} />
      <Stack spacing={4}>
        <Box>これをコピーして記事に貼ってください。</Box>
        <Code p={3} lang="md">
          {md}
        </Code>
        <Button onClick={() => navigator.clipboard.writeText(md)}>コピー</Button>
      </Stack>
    </Stack>
  );
}
