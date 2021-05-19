import { useState } from 'react';
import firebase from '@/lib/firebase';
import 'firebase/storage';
import 'firebase/firestore';

import { Box, Stack, Input, Badge } from '@chakra-ui/react';
import ImgToMarkdown from '@/components/common/img-to-markdown';

import { Formik } from 'formik';
import { CheckboxControl } from 'formik-chakra-ui';
import * as Yup from 'yup';
import Warning from '@/components/common/warning';
import { UserImage } from '@/models/firestore/user';
import CustomUploadButton from '@/components/uploader/customUploadButton';
import nsfwChecker from './nsfw-checker';
import NsfwWarning from '@/components/common/nsfw-warning';
import { NsfwLevel, NsfwResult } from '@/models/nsfw';
import NsfwDetailBox from './nsfw-detail-box';
import { nsfwColor } from '@/lib/nsfw-color';

interface UploadStateType {
  altToUpload: string;
  filename: string;
  username: string;
  isUploading: boolean;
  progress: number;
  result?: string;
  registered: boolean;
  altRegistered: string;
  error?: string;
  nsfw?: NsfwLevel;
  nsfwDetail?: NsfwResult['detail'];
}

export default function UserUploader({ uid }: { uid: string }) {
  const initialState = {
    altToUpload: '',
    filename: '',
    username: '',
    isUploading: false,
    progress: 0,
    result: undefined,
    registered: false,
    altRegistered: '',
    error: undefined,
    nsfw: undefined,
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
    if (uid) {
      const userRef = firebase.firestore().collection('users').doc(uid);
      const userSubCollectionRef = userRef.collection('images');
      setUploadState((prev) => ({
        ...prev,
        filename: filename,
        progress: 100,
        isUploading: false,
      }));
      firebase
        .storage()
        .ref(uploadRef(uid))
        .child(filename)
        .getDownloadURL()
        .then(async (url) => {
          // nsfwチェック
          await nsfwChecker(url).then((result) => {
            if (typeof result.level === 'number') {
              setUploadState((prev) => ({
                ...prev,
                result: url,
                nsfw: result.level,
                nsfwDetail: result.detail,
              }));
              const userData = {
                // 上はNSFW枚数、下は累計NSFWレベル
                picCount: firebase.firestore.FieldValue.increment(1),
                nsfwPicCount: firebase.firestore.FieldValue.increment(result.level > 0 ? 1 : 0),
                nsfwLevelCount: firebase.firestore.FieldValue.increment(result.level),
              };
              const registerData: UserImage = {
                alt: uploadState.altToUpload.length == 0 ? null : uploadState.altToUpload,
                filename: filename,
                src: url,
                uploadedTimeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                nsfw: result.level,
              };
              userRef
                .set(userData, { merge: true })
                .then(() => {
                  userSubCollectionRef
                    .add(registerData)
                    .then(() => {
                      setUploadState((prev) => ({
                        ...prev,
                        registered: true,
                        altRegistered: prev.altToUpload,
                        error: undefined,
                      }));
                    })
                    .catch((e) => {
                      setUploadState((prev) => ({
                        ...prev,
                        error: prev.error + `データ登録ができませんでした: ${e}`,
                      }));
                    });
                })
                .catch((e) => {
                  setUploadState((prev) => ({
                    ...prev,
                    error: prev.error + `データ登録ができませんでした: ${e}`,
                  }));
                });
            } else {
              setUploadState((prev) => ({
                ...prev,
                error: prev.error + 'NSFW判定ができませんでした',
              }));
            }
          });
        })
        .catch((e) => {
          setUploadState((prev) => ({
            ...prev,
            error: prev.error + `アップロードができませんでした: ${e}`,
          }));
        });
    } else {
      setUploadState((prev) => ({
        ...prev,
        error: prev.error + `ログインしてください`,
      }));
    }
  };

  return (
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
          <Box>
            <Warning />
          </Box>

          <Box>
            <Box pb={2}>画像のタイトル(任意)</Box>
            <Input
              value={uploadState.altToUpload}
              onChange={(e) => setUploadState((prev) => ({ ...prev, altToUpload: e.target.value }))}
              name="alt"
              area-label="画像のタイトル"
              placeholder="画像のタイトル"
            />
          </Box>
          <Box>
            <CheckboxControl value="agreed" name="agreed" label="利用規約に同意" />
          </Box>
          {values.agreed && (
            <CustomUploadButton
              accept="image/*"
              name="image"
              randomizeFilename
              storageRef={firebase.storage().ref(uploadRef(uid))}
              onUploadStart={handleUploadStart}
              onUploadError={handleUploadError}
              onUploadSuccess={handleUploadSuccess}
              onProgress={handleProgress}
              // maxWidth={1280}
            >
              クリックして画像を選択
            </CustomUploadButton>
          )}
          {uploadState.isUploading && <Box>アップロード中: {uploadState.progress}</Box>}
          {uploadState.result && (
            <>
              <Box>アップロードできました。</Box>
              {uploadState.registered && (
                <>
                  <Box>画像がデータベースに登録されました。</Box>
                  {uploadState.nsfw && uploadState.nsfw > 1 ? (
                    <Box>
                      <NsfwWarning nsfw={uploadState.nsfw} />
                    </Box>
                  ) : (
                    <Stack pt={4} spacing={4}>
                      <Badge colorScheme={nsfwColor(uploadState.nsfw ?? 0)}>
                        NSFWレベル: {uploadState.nsfw}
                      </Badge>
                      <Stack spacing={2}>
                        {/* altRegisteredじゃないとinputと同期してしまう*/}
                        <img src={uploadState.result} />
                        <ImgToMarkdown src={uploadState.result} alt={uploadState.altRegistered} />
                      </Stack>
                    </Stack>
                  )}
                  {uploadState.nsfwDetail && <NsfwDetailBox detail={uploadState.nsfwDetail} />}
                </>
              )}
            </>
          )}
          {uploadState.error && <Badge colorScheme="red">{uploadState.error}</Badge>}
        </Stack>
      )}
    </Formik>
  );
}
