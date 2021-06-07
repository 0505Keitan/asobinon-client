import LinkChakra from '@/components/common/link-chakra';
import { Badge, Box, Button, Stack } from '@chakra-ui/react';
import { GetServerSidePropsContext } from 'next';
import Layout from '../../components/layout';

interface PageProps {
  path?: string;
  value?: 'good' | 'bad';
  error?: string;
}

const FeedBackPage = ({ path, value, error }: PageProps) => {
  if (typeof path === 'string') {
    const actualPath =
      process.env.DOCS_URL +
      path
        .replace('/docs', '')
        .replace('index.md', '')
        .replace(`.md`, '')
        .replace(/[0-9]\-/g, '');
    return (
      <Layout meta={{ title: 'フィードバックありがとうございました', desc: '' }}>
        <Stack spacing={6}>
          {error ? (
            <>
              <Box>エラー: {error}</Box>
            </>
          ) : (
            <>
              <Box>フィードバックありがとうございました。</Box>

              <Box bg="gray.100" p={6} rounded="xl">
                評価したページ:
                <LinkChakra isExternal href={actualPath}>
                  <Badge textTransform="none">{actualPath}</Badge>
                </LinkChakra>
              </Box>

              {value == 'bad' && (
                <Box>もし間違いがある場合は、編集ボタンから記事の修正もご検討ください。</Box>
              )}
            </>
          )}
          <Button as={LinkChakra} href="/feedback/list">
            フィードバック一覧へ
          </Button>
        </Stack>
      </Layout>
    );
  } else {
    return;
  }
};

export default FeedBackPage;

export const getServerSideProps = async ({ query }: GetServerSidePropsContext) => {
  /*
  https://github.com/sasigume/asobinon/blob/main/src/components/docpage/rating.tsx
  フィードバックボタンから、pathとvalueが渡される
  */
  const path = query.path as string | undefined;
  const value = query.value as string | undefined;

  let api = `${process.env.FUNCTIONS_URL}/feedback-addFeedback?value=${value}`;
  if (typeof path === 'string') {
    api = api + `&path=${encodeURIComponent(path)}`;
  }
  return await fetch(api, {
    method: 'POST',
    headers: {
      Authorization: process.env.FUNCTIONS_AUTH ?? '',
    },
  })
    .then(async (res) => {
      if (res.ok) {
        return {
          props: {
            path,
            value,
          },
        };
      } else {
        return {
          props: {
            path,
            value,
            error: `${res.statusText}`,
          },
        };
      }
    })
    .catch((e) => {
      return {
        error: e.message ?? JSON.stringify(e),
      };
    });
};
