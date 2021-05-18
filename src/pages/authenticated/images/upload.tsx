import { useAuthentication } from '@/hooks/authentication';
import Layout from '@/components/layout';
import { Box } from '@chakra-ui/react';

import UserUploader from '@/components/authenticated/user-uploader';
export default function UploafPage() {
  const { user } = useAuthentication();

  return (
    <Layout meta={{ title: '画像アップローダー', desc: '画像アップローダーです' }}>
      {user ? <UserUploader uid={user.uid} /> : <Box>ログインしてください</Box>}
    </Layout>
  );
}
