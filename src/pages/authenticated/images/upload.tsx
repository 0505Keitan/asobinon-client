import Layout from '@/components/layout';
import ImageUploader from '@/components/image-uploader';
import { useAuthentication } from '@/hooks/authentication';
import PleaseLogin from '@/components/common/please-login';
export default function UploadPage() {
  const { user } = useAuthentication();
  return (
    <Layout meta={{ title: '画像アップローダー', desc: '画像アップローダーです' }}>
      {user ? <ImageUploader /> : <PleaseLogin to="/authenticated/images/upload" />}
    </Layout>
  );
}
