import { Box, Button, Heading, Stack, Stat, StatHelpText, StatNumber } from '@chakra-ui/react';
import Layout from '@/components/layout';
import { GetServerSidePropsContext } from 'next';
import LinkChakra from '@/components/common/link-chakra';
import { useEffect, useState } from 'react';

const SuccessPage = ({ path }: { path: string | null }) => {
  const title = '編集完了!';
  const [count, setCount] = useState(60);
  useEffect(() => {
    count > 0 &&
      setTimeout(() => {
        setCount(count - 1);
      }, 1000);
  }, [count]);
  if (typeof path === 'string') {
    const actualPath = process.env.DOCS_URL + path.replace(`.md`, '').replace(/[0-9]\-/g, '');
    return (
      <Layout meta={{ title: title, desc: '編集が完了しました' }}>
        <Heading as="h1">{title}</Heading>

        <Stack>
          <Box>変更の反映には1分ほど時間がかかります</Box>
          <Stat>
            <StatNumber>{count}</StatNumber>
            <StatHelpText>
              {count == 0 ? 'おそらく反映されました' : '0になるまで待ってね!'}
            </StatHelpText>
          </Stat>
          {count == 0 && (
            <Button as={LinkChakra} isExternal href={actualPath}>
              編集が反映されたか見にいく
            </Button>
          )}
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
