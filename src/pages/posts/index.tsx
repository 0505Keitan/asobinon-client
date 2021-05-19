import Layout from '@/components/layout';
import PostCompact from '@/components/posts/compact';
import { getSortedPostsData } from '@/lib/markdown';
import { Post } from '@/models/markdown';
import { Stack } from '@chakra-ui/react';

export default function MdIndex({ allPostsData }: { allPostsData: Post[] }) {
  return (
    <Layout meta={{ title: '全記事一覧', desc: '一覧です' }}>
      <Stack spacing={6}>
        {allPostsData.map((post) => {
          return <PostCompact key={post.id} post={post} />;
        })}
      </Stack>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
