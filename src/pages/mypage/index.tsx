import Layout from '@/components/layout';
import { useAuthentication } from '../../hooks/authentication';
import { Box, Heading, Stack } from '@chakra-ui/react';
import Loading from '@/components/common/loading';

export default function MyPage() {
  const { user } = useAuthentication();

  return (
    <Layout meta={{ title: 'マイページ', desc: 'マイページ' }}>
      {user ? (
        <>
          <Stack>
            <Box>
              <Heading as="h1" mb={6} fontStyle="h1">
                マイページ
              </Heading>
              <Box bg="gray.100" rounded="lg" p={6} m={3}>
                <Box>{user.name}さん</Box>
                <Box>(お問い合わせID: {user.uid})</Box>
              </Box>
            </Box>
          </Stack>
        </>
      ) : (
        <>
          <Box>ユーザー情報を読み取り中...</Box>
          <Loading />
        </>
      )}
    </Layout>
  );
}
