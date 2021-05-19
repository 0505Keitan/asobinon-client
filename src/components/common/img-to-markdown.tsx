import { Button } from '@chakra-ui/button';
import { Box, Code, Stack } from '@chakra-ui/react';
import { useState } from 'react';

export default function ImgToMarkdown({ src, alt }: { src: string; alt: string }) {
  const [copied, setCopied] = useState(false);
  const md = `![${alt?.length == 0 ? '' : alt}](${src})`;
  const handlecopy = () => {
    navigator.clipboard.writeText(md);
    setCopied(true);
  };
  return (
    <Stack spacing={6}>
      <Stack spacing={4}>
        <Box>これをコピーして記事に貼ってください。</Box>
        <Code p={3} lang="md">
          {md}
        </Code>
        <Button onClick={handlecopy}>{copied ? 'コピーしました!' : 'コピー'}</Button>
      </Stack>
    </Stack>
  );
}
