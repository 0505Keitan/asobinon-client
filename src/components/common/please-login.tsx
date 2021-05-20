import { Box, Button } from '@chakra-ui/react';
import LinkChakra from './link-chakra';
export default function PleaseLogin({ to }: { to?: string }) {
  return (
    <Box>
      <Button as={LinkChakra} href={`/authenticated${to ? '?to=' + to : ''}`}>
        ログイン
      </Button>
    </Box>
  );
}
