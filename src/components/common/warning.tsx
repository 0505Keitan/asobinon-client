import { Badge, Box } from '@chakra-ui/react';

const Warning = () => (
  <Box background="gray.700" color="white" p={6} rounded="xl">
    <div>
      <Badge>
        <a href={`${process.env.DOC_URL}/eula/`}>利用規約(タップで読む)</a>
      </Badge>
      に反した投稿は即刻削除します。
    </div>
  </Box>
);
export default Warning;
