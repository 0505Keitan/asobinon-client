import Logo from '@/components/common/Logo';
import { SITE_DESC } from '@/lib/constants';
import { Center } from '@chakra-ui/react';
import Layout from '../components/layout';

const Index = () => (
  <Layout meta={{ title: 'TOP', desc: SITE_DESC }}>
    <Center h="100vh">
      <Logo logoSelection="rect" />
    </Center>
  </Layout>
);

export default Index;
