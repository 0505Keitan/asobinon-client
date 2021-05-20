import Layout from '@/components/layout';
import ImageUploader from '@/components/image-uploader';
import { useAuthentication } from '@/hooks/authentication';
import PleaseLogin from '@/components/common/please-login';
import { Heading } from '@chakra-ui/layout';
export default function UploadPage() {
  const { user } = useAuthentication();
  return (
    <Layout meta={{ title: '画像アップローダー', desc: '画像アップローダーです' }}>
      <Heading as="h1" pb={4}>
        画像アップローダー (NSFW判定付き)
      </Heading>
      {user ? <ImageUploader /> : <PleaseLogin to="/authenticated/images/upload" />}
    </Layout>
  );
}
