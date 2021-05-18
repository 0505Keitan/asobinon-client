import { useState } from 'react';
import firebase from '@/lib/firebase';
import 'firebase/storage';
import 'firebase/firestore';

import { useAuthentication } from '@/hooks/authentication';
import Layout from '@/components/layout';
import { Box, Stack, Input } from '@chakra-ui/react';
import ImgToMarkdown from '@/components/common/img-to-markdown';

import { Formik } from 'formik';
import { CheckboxControl } from 'formik-chakra-ui';
import * as Yup from 'yup';
import Warning from '@/components/common/warning';
import { UserImage } from '@/models/firestore/user';
import CustomUploadButton from '@/components/uploader/customUploadButton';

interface UploadStateType {
  altToUpload: string;
  filename: string;
  username: string;
  isUploading: boolean;
  progress: number;
  result?: string;
  registered: boolean;
  altRegistered: string;
}

export default function UploafPage() {
  const { user } = useAuthentication();
  const initialState = {
    altToUpload: '',
    filename: '',
    username: '',
    isUploading: false,
    progress: 0,
    result: undefined,
    registered: false,
    altRegistered: '',
  };
  const [uploadState, setUploadState] = useState<UploadStateType>(initialState);

  const validationSchema = Yup.object({
    agreed: Yup.bool().required('利用規約に同意いただかない場合は、サービスを提供できません。'),
    alt: Yup.string().optional(),
  });

  const uploadRef = (username: string) => `images/userupload/${username}`;

  const handleUploadStart = () =>
    setUploadState((prev) => ({ ...prev, isUploading: true, progress: 0 }));
  const handleProgress = (progress: number) => setUploadState((prev) => ({ ...prev, progress }));
  const handleUploadError = (error: any) => {
    setUploadState((prev) => ({ ...prev, isUploading: false }));
    console.error(error);
  };
  const handleUploadSuccess = (filename: string) => {
    if (user) {
      const userSubCollectionRef = firebase
        .firestore()
        .collection('users')
        .doc(user.uid)
        .collection('images');
      setUploadState((prev) => ({
        ...prev,
        filename: filename,
        progress: 100,
        isUploading: false,
      }));
      firebase
        .storage()
        .ref(uploadRef(user.uid))
        .child(filename)
        .getDownloadURL()
        .then((url) => {
          setUploadState((prev) => ({ ...prev, result: url }));

          const registerData: UserImage = {
            alt: uploadState.altToUpload.length == 0 ? null : uploadState.altToUpload,
            filename: filename,
            src: url,
            uploadedTimeStamp: firebase.firestore.FieldValue.serverTimestamp(),
            nsfw: false,
          };
          userSubCollectionRef.add(registerData).then(() => {
            setUploadState((prev) => ({
              ...prev,
              registered: true,
              altRegistered: prev.altToUpload,
            }));
          });
        });
    } else {
      console.error(`Login required to upload`);
    }
  };

  return (
    <Layout meta={{ title: '画像アップローダー', desc: '画像アップローダーです' }}>
      {user ? (
        <Formik
          initialValues={{
            agreed: false,
            alt: '',
          }}
          validationSchema={validationSchema}
          onSubmit={() => {}}
        >
          {({ values }) => (
            <Stack as="form" spacing={6}>
              <div>{JSON.stringify(uploadState)}</div>
              <Box>
                <Warning />
              </Box>
              <Box>
                <CheckboxControl value="agreed" name="agreed" label="利用規約に同意" />
              </Box>
              <Box>
                <Box pb={2}>画像のタイトル(任意)</Box>
                <Input
                  value={uploadState.altToUpload}
                  onChange={(e) => setUploadState((prev) => ({ ...prev, alt: e.target.value }))}
                  name="alt"
                  area-label="画像のタイトル"
                  placeholder="画像のタイトル"
                />
              </Box>
              {values.agreed && (
                <CustomUploadButton
                  accept="image/*"
                  name="image"
                  randomizeFilename
                  storageRef={firebase.storage().ref(uploadRef(user.uid))}
                  onUploadStart={handleUploadStart}
                  onUploadError={handleUploadError}
                  onUploadSuccess={handleUploadSuccess}
                  onProgress={handleProgress}
                  maxWidth={1280}
                >
                  クリックして画像を選択
                </CustomUploadButton>
              )}
              {uploadState.isUploading && <Box>アップロード中: {uploadState.progress}</Box>}
              {uploadState.registered && (
                <Stack pt={4} spacing={4}>
                  {uploadState.result && (
                    // altRegisteredじゃないとinputと同期してしまう
                    <ImgToMarkdown src={uploadState.result} alt={uploadState.altRegistered} />
                  )}
                  <Box>画像がデータベースに登録されました。</Box>
                </Stack>
              )}
            </Stack>
          )}
        </Formik>
      ) : (
        <Box>ログインしてください</Box>
      )}
    </Layout>
  );
}
