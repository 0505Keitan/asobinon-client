import { SITE_DESC } from '@/lib/constants';
import getMd, { PageProps } from '@/lib/markdown';
import { Center, Heading, Stack } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import Layout from '../components/layout';
const gfm = require('remark-gfm');

const Law = ({ data, content }: PageProps) => (
  <Layout meta={{ title: data?.title ?? '特定商取引法に基づく表示', desc: SITE_DESC }}>
    <Center>
      <Stack spacing={6}>
        <Heading as="h1">{data?.title ?? '特定商取引法に基づく表示'}</Heading>
        {content && <ReactMarkdown plugins={[gfm]}>{content}</ReactMarkdown>}
      </Stack>
    </Center>
  </Layout>
);

export default Law;

export async function getStaticProps() {
  const { data, content } = await getMd('law');
  return {
    props: {
      data: data ?? null,
      content: content ?? null,
    },
    revalidate: false,
  };
}
