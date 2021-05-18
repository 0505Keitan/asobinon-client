import { useState } from 'react';
import firebase from '@/lib/firebase';
import 'firebase/storage';

import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import { useAuthentication } from '@/hooks/authentication';
import Layout from '@/components/layout';
import { Box, Stack } from '@chakra-ui/layout';
import ImgToMarkdown from '@/components/common/img-to-markdown';

interface UploadStateType {
  filename: string;
  username: string;
  isUploading: boolean;
  progress: number;
  result?: string;
}

export default function UploafPage() {
  const { user } = useAuthentication();
  const initialState: UploadStateType = {
    filename: '',
    username: '',
    isUploading: false,
    progress: 0,
    result: undefined,
  };
  const [uploadState, setUploadState] = useState(initialState);

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
        .then((url) => setUploadState((prev) => ({ ...prev, result: url })));
    } else {
      console.error(`Login required to upload`);
    }
  };

  return (
    <Layout meta={{ title: '画像アップローダー', desc: '画像アップローダーです' }}>
      {user ? (
        <Stack as="form">
          <CustomUploadButton
            style={{ cursor: 'pointer' }}
            accept="image/*"
            name="image"
            randomizeFilename
            storageRef={firebase.storage().ref(uploadRef(user.uid))}
            onUploadStart={handleUploadStart}
            onUploadError={handleUploadError}
            onUploadSuccess={handleUploadSuccess}
            onProgress={handleProgress}
          >
            <Box rounded="xl" bg="orange" p={6} fontWeight="bold" color="white">
              クリックして画像を選択
            </Box>
          </CustomUploadButton>
          {uploadState.isUploading && <Box>アップロード中: {uploadState.progress}</Box>}
          {uploadState.result && (
            <Box pt={8}>
              <ImgToMarkdown src={uploadState.result} />
            </Box>
          )}
        </Stack>
      ) : (
        <Box>ログインしてください</Box>
      )}
    </Layout>
  );
}
