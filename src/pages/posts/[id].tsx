import Layout from '@/components/layout';
import PostSingle from '@/components/posts/single';
import { getAllPostIds, getPostData } from '@/lib/markdown';
import { Post } from '@/models/markdown';
import { GetStaticPropsContext } from 'next';

export default function PostSinglePage({ postData }: { postData: Post }) {
  return (
    <Layout meta={{ title: postData.title, desc: `${postData.date}の記事` }}>
      <PostSingle post={postData} />
    </Layout>
  );
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  if (params && typeof params.id === 'string') {
    const postData = await getPostData(params.id);
    return {
      props: {
        postData,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
}
export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}
