import { useAuthentication } from '@/hooks/authentication';
import Layout from '@/components/layout';
import { Box } from '@chakra-ui/react';
import UserImageList from '@/components/image-uploader/user-image-list';
import PleaseLogin from '@/components/common/please-login';

export default function ImagesIndexPage({ error }: { error: string }) {
  const { user } = useAuthentication();

  return (
    <Layout meta={{ title: 'アップロード画像一覧', desc: '画像一覧です' }}>
      {user ? (
        <>
          {error ? (
            <>
              <Box>{error}</Box>
            </>
          ) : (
            <UserImageList />
          )}
        </>
      ) : (
        <PleaseLogin to="/authenticated/images" />
      )}
    </Layout>
  );
}
