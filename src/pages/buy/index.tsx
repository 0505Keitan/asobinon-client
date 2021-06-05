import LinkChakra from '@/components/common/link-chakra';
import { SITE_DESC } from '@/lib/constants';
import { Button, Center, Heading, Stack } from '@chakra-ui/react';
import Layout from '../../components/layout';

const Buy = () => (
  <Layout meta={{ title: 'TOP', desc: SITE_DESC }}>
    <Center>
      <Stack spacing={6}>
        <Heading as="h1">運営の支援</Heading>
        <Button
          colorScheme="green"
          as={LinkChakra}
          href="https://buy.stripe.com/3cseVc0tp5EZfQIbII"
          isExternal
        >
          支援リンクへ
        </Button>
      </Stack>
    </Center>
  </Layout>
);

export default Buy;
