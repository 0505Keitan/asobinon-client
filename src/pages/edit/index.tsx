import { Button } from "@chakra-ui/button";
import {
  Box,
  Code,
  Divider,
  Heading,
  Stack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import LinkChakra from "../../components/common/link-chakra";
import Layout from "../../components/layout";

interface PageProps {
  path?: string;
}

/*
このページは「このページを編集」からクエリ付きでアクセスする前提
TODO: 画像投稿もここでしたい。
*/

const EditDocsPage = ({ path }: PageProps) => {
  const title = `編集補助ページ (編集対象:${path})`;
  const repoUrl = process.env.DOCS_REPOSITORY_URL;
  if (!repoUrl) {
    return (
      <Box>
        レポジトリの環境変数<pre>DOCS_REPOSITORY_URL</pre>を設定してください
      </Box>
    );
  }
  if (path) {
    /* 注意: pathは「/」がすでに付いている！！！ */

    // 「2-」とかはURLにない
    const actualPath =
      process.env.DOCS_URL + path.replace(`.md`, "").replace(/[0-9]\-/g, "");
    const editPath =
      process.env.DOCS_REPOSITORY_URL + "/edit/main/website" + path;

    return (
      <Layout title={title}>
        <Box>
          <Heading as="h1">{title}</Heading>
          <Divider my={8} />
          <Stack spacing={6}>
            <Heading as="h2" mb={6}>
              クローンする(推奨)
            </Heading>
            <Box>
              <Code>$ git clone {repoUrl}.git</Code>
            </Box>
            <Box>
              <Box>変更したらプッシュ:</Box>
              <Code>$ git push origin main</Code>
            </Box>
          </Stack>

          <Divider my={8} />

          <Stack spacing={6}>
            <Heading as="h2" mb={6}>
              GitHub.comで編集する(非推奨)
            </Heading>

            <Box bg="gray.100" p={6} rounded="xl">
              編集するページ:
              <LinkChakra isExternal href={actualPath}>
                <pre>{actualPath}</pre>
              </LinkChakra>
            </Box>

            <Alert mb={8} status="error">
              <AlertIcon />
              <AlertTitle mr={2}>
                何回も変更する場合はクローンしてください!
              </AlertTitle>
              <AlertDescription>
                直接変更すると、その度にサイト全体の更新がされ、サーバーに負荷がかかります。
              </AlertDescription>
            </Alert>

            <Button as={LinkChakra} isExternal href={editPath}>
              GitHub.comで編集する
            </Button>
          </Stack>
        </Box>
      </Layout>
    );
  } else {
    return <Box>パス指定がないよ!</Box>;
  }
};

export default EditDocsPage;

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  /*
  https://github.com/imaicu/markdown-gaming/blob/main/website/docusaurus.config.js
  編集リンクから「/docs/XXX」が渡される
  */
  const path = query.path;
  return {
    props: {
      path: path ?? null,
    },
  };
};
