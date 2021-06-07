import {
  Button,
  Box,
  Code,
  Heading,
  Stack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tab,
  TabList,
  Tabs,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import CreateIssue from '@/components/common/create-issue';
import LinkChakra from '../../components/common/link-chakra';
import Layout from '../../components/layout';
import { GetServerSidePropsContext } from 'next';

/*
このページは「このページを編集」からクエリ付きでアクセスする前提
*/

const EditorPage = ({ path }: { path: string }) => {
  const title = `編集補助ページ (編集対象:${path})`;
  const repoUrl = process.env.DOCS_REPOSITORY_URL;
  if (!repoUrl) {
    return (
      <Box>
        レポジトリの環境変数<pre>DOCS_REPOSITORY_URL</pre>を設定してください
      </Box>
    );
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
    const editPath = process.env.DOCS_REPOSITORY_URL + '/edit/main' + path;

    return (
      <Layout meta={{ title: title, desc: '編集ページ' }}>
        <Stack spacing={6}>
          <Heading as="h1">{title}</Heading>

          <Box my={6}>
            <Heading as="h2">画像アップはこちら</Heading>
            <Button as={LinkChakra} isExternal href="https://asobinon.org/ASOBINON/contribute/">
              画像アップの方法
            </Button>
          </Box>

          {path.includes('/docs/') && (
            <Box bg="gray.100" p={6} rounded="xl">
              編集するページ:
              <LinkChakra isExternal href={actualPath}>
                <pre>{actualPath}</pre>
              </LinkChakra>
            </Box>
          )}

          <Tabs>
            <TabList>
              <Tab>GitHub.com</Tab>
              <Tab>ローカル</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Stack spacing={6}>
                  <Heading as="h2" mb={6}>
                    GitHub.comで編集する
                  </Heading>

                  <Alert mb={8} status="error">
                    <AlertIcon />
                    <AlertTitle mr={2}>短時間に何回も編集しないでね!</AlertTitle>
                    <AlertDescription>
                      何度もGitHub.comで編集すると、その度にサイト全体の更新がされ、サーバーに負荷がかかります。
                    </AlertDescription>
                  </Alert>

                  <Button colorScheme="blue" as={LinkChakra} isExternal href={editPath}>
                    GitHub.comで編集する
                  </Button>
                </Stack>
              </TabPanel>
              <TabPanel>
                <Stack spacing={6}>
                  <Heading as="h2" mb={6}>
                    クローンする(メンバーの方)
                  </Heading>
                  <Stack mb={6}>
                    <Alert mb={8} status="info">
                      <AlertIcon />
                      <AlertTitle mr={2}>メンバー参加は下のボタンを押してください</AlertTitle>
                      <AlertDescription>
                        「Submit new issue」を押して送信するのを忘れずに！
                      </AlertDescription>
                    </Alert>
                    <CreateIssue
                      colorScheme="green"
                      text="メンバー参加を申請する"
                      issue={{ title: 'メンバー参加を申請します', body: '(補助サイトより作成)' }}
                    />
                  </Stack>
                  <Stack spacing={6} mb={6}>
                    <Heading as="h3">クローンとプッシュ</Heading>
                    <Box textDecoration="underline">
                      <a
                        target="_blank"
                        href="https://www.youtube.com/watch?v=VZVZUA3MW1g"
                        rel="noreferrer"
                      >
                        こちらの動画で解説しています
                      </a>
                    </Box>
                    <Box>
                      <Code>$ git clone {repoUrl}.git</Code>
                    </Box>
                    <Box>
                      <Box>変更したらプッシュ:</Box>
                      <Code>$ git push origin main</Code>
                    </Box>
                  </Stack>
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

  return {
    props: {
      path: path ?? null,
      initialData: null,
    },
  };
};
