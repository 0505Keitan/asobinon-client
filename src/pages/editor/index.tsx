//import EditorV1 from '@/components/editor/editor-v1';
import EditorV2 from '@/components/editor/editor-v2';
import {
  Button,
  Box,
  Heading,
  Stack,
  Tab,
  TabList,
  Tabs,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import LinkChakra from '../../components/common/link-chakra';
import Layout from '../../components/layout';
import { GetServerSidePropsContext } from 'next';
import { GetResOk } from '@/models/github';

/*
このページは「このページを編集」からクエリ付きでアクセスする前提
*/

const EditorPage = ({
  path,
  initialData,
  forbidden,
  error,
}: {
  path: string;
  initialData: GetResOk | null;
  forbidden?: boolean;
  error?: string;
}) => {
  const title = `編集補助ページ (編集対象:${path})`;
  const repoUrl = process.env.DOCS_REPOSITORY_URL;
  if (!repoUrl) {
    return (
      <Box>
        レポジトリの環境変数<pre>DOCS_REPOSITORY_URL</pre>を設定してください
      </Box>
    );
  }

  if (error) {
    return <Box>{error}</Box>;
  }

  if (forbidden) {
    return <Box>このファイルは編集できません</Box>;
  }

  if (typeof path === 'string') {
    /* 注意: pathは「/」がすでに付いている！！！ */

    // 「2-」とかはURLにない
    const actualPath =
      process.env.DOCS_URL +
      path
        .replace('/docs', '')
        .replace('index.md', '')
        .replace(`.md`, '')
        .replace(/[0-9]\-/g, '');

    return (
      <Layout meta={{ title: title, desc: '編集ページ' }}>
        <Stack spacing={3}>
          <Heading as="h1">{title}</Heading>

          {path.includes('/docs/') && (
            <Box bg="gray.100" p={6} rounded="xl">
              編集するページ:
              <LinkChakra isExternal href={actualPath}>
                <pre>{actualPath}</pre>
              </LinkChakra>
            </Box>
          )}

          <Button
            colorScheme="green"
            as={LinkChakra}
            isExternal
            href="https://asobinon.org/ASOBINON/contribute/"
          >
            画像アップの方法
          </Button>

          <Tabs>
            <TabList>
              <Tab>今すぐ編集したい方</Tab>
              <Tab>GitHubアカウントがある方</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Stack spacing={6}>
                  {initialData && initialData.content ? (
                    <EditorV2 path={path} initialData={initialData} />
                  ) : (
                    <Box>ファイルの新規作成には対応していません</Box>
                  )}
                </Stack>
              </TabPanel>
              <TabPanel>
                <Stack spacing={6}>
                  <Button colorScheme="blue" as={LinkChakra} href={`/editor/github?path=${path}`}>
                    GitHubを使った編集方法はこちら
                  </Button>
                </Stack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </Layout>
    );
  } else {
    return <Box>編集するファイルが指定されていません</Box>;
  }
};

export default EditorPage;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const path = context.query.path;

  if (typeof path !== 'string') {
    return {
      props: {
        path: null,
        initialData: null,
      },
    };
  }

  // 拡張子がmdでない場合
  if (typeof path === 'string' && path?.split('.').pop() !== 'md') {
    return {
      props: {
        path: null,
        initialData: null,
        forbidden: true,
      },
    };
  }

  return await fetch(`${process.env.HTTPS_URL}/api/get-github?path=${encodeURIComponent(path)}`, {
    headers: {
      Authorization: process.env.FUNCTIONS_AUTH ?? '',
    },
  })
    .then(async (res) => {
      if (res.ok) {
        const data = await res.json();

        return {
          props: {
            path: path ?? null,
            initialData: data,
          },
        };
      } else {
        // 404は新規作成できない旨を示す
        if (res.status == 404) {
          return {
            props: {
              path: path ?? null,
              initialData: null,
            },
          };
        }
        return {
          props: {
            path: path ?? null,
            initialData: null,
            error: `${res.statusText}`,
          },
        };
      }
    })
    .catch((e) => {
      console.error(e);
      return {
        props: {
          path: path ?? null,
          initialData: null,
          error: e.message ?? '不明なエラー',
        },
      };
    });
};
