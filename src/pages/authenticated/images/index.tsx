import { useAuthentication } from '@/hooks/authentication';
import Layout from '@/components/layout';
import { Box } from '@chakra-ui/react';
import firebase from 'firebase';
import UserImageList from '@/components/image-uploader/user-image-list';
import { UserImage } from '@/models/firestore/user';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import PleaseLogin from '@/components/common/please-login';

export default function ImagesIndexPage({ error, images }: { error: string; images: UserImage[] }) {
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
            <UserImageList viewerUid={user.uid} images={images} />
          )}
        </>
      ) : (
        <PleaseLogin to="/authenticated/images" />
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  const uid = query.uid as string | undefined;
  const userRef = firebase.firestore().collection('users').doc(uid);

  if (!uid || (await userRef.get()).exists == false) {
    return {
      props: {
        error: 'ユーザーが見つかりませんでした',
        images: null,
      },
    };
  }

  const result = await userRef
    .collection('images')
    .get()
    .then((snapshot) => {
      return snapshot.docs.map((doc) => {
        const data = doc.data() as UserImage;
        return data;
      });
    });

  return {
    props: {
      error: null,
      images: JSON.parse(JSON.stringify(result)) ?? [],
    },
  };
};
