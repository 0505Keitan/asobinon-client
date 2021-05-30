import { Box, Button, Heading, Stack } from '@chakra-ui/react';
import Layout from '@/components/layout';
import { GetServerSidePropsContext } from 'next';
import LinkChakra from '@/components/common/link-chakra';
import SlideShow from '@/components/common/slide-show';

const SuccessPage = ({ path }: { path: string | null }) => {
  // 段階に応じてカウントを分割

  const title = '編集完了!';
  if (typeof path === 'string') {
    const actualPath =
      process.env.DOCS_URL +
      path
        .replace('/docs', '')
        .replace('index.md', '')
        .replace(`.md`, '')
        .replace(/[0-9]\-/g, '');
    return (
      <Layout meta={{ title: title, desc: '編集が完了しました' }}>
        <Stack spacing={6}>
          <Heading as="h1">{title}</Heading>
          <Box bg="red" color="white" p={3} fontWeight="bold">
            注意! 1日に「サイトが」更新される回数の上限は「100回」です!
            ソースコードは更新されているので、明日になればサイトに反映されます。
          </Box>
          <SlideShow
            initialCount={45}
            contents={[
              '更新開始...',
              'GitHubからサーバーへ転送中...',
              'サーバーが読み取り中...',
              'パッケージをインストール中...',
              '構文をチェック中...',
              '(ここでHTMLがおかしいと止まります)',
              '(HTMLがOKなら)ビルド完了...',
              '(HTMLがOKなら)デプロイ中...',
              '(HTMLがOKなら)DONE!',
            ]}
          />

          <Button as={LinkChakra} isExternal href={actualPath}>
            編集が反映されたか見にいく
          </Button>
        </Stack>
      </Layout>
    );
  } else {
    return <Box>編集ファイルが指定されていません</Box>;
  }
};

export default SuccessPage;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const path = context.query.path;
  return {
    props: {
      path: path ?? null,
    },
  };
};
