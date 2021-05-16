import { Badge, Box } from '@chakra-ui/react';
import LinkChakra from './link-chakra';

const Warning = () => (
  <Box background="gray.700" color="white" p={6} rounded="xl">
    <div>
      <Badge>
        <LinkChakra href="/posts/eula">利用規約(タップで読む)</LinkChakra>
      </Badge>
      に反した投稿は即刻削除します。
    </div>
  </Box>
);
export default Warning;
