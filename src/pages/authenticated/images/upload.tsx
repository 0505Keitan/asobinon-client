import Layout from '@/components/layout';
import ImageUploader from '@/components/image-uploader';
export default function UploadPage() {
  return (
    <Layout meta={{ title: '画像アップローダー', desc: '画像アップローダーです' }}>
      <ImageUploader />
    </Layout>
  );
}
