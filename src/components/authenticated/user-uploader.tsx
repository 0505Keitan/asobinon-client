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
import CustomUploadButton from '@/components/uploader/customUploadButton';
import NsfwWarning from '@/components/common/nsfw-warning';
import { NsfwFunctionResult } from '@/models/nsfw';
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
  nsfw?: NsfwFunctionResult['level'];
  nsfwMessages?: NsfwFunctionResult['messages'];
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
    setUploadState((prev) => ({
      ...prev,
      isUploading: true,
      progress: 0,
      error: undefined,
      nsfw: undefined,
      nsfwMessages: undefined,
    }));
  const handleProgress = (progress: number) => setUploadState((prev) => ({ ...prev, progress }));
  const handleUploadError = (error: any) => {
    setUploadState((prev) => ({
      ...prev,
      isUploading: false,
      error: `(おそらく容量がデカすぎます) ${error}`,
    }));
    console.error(error);
  };
  const handleUploadSuccess = (filename: string) => {
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
        if (url) {
          // nsfwチェック
          const result: NsfwFunctionResult = await fetch(
            `${process.env.HTTPS_URL}/api/check-image?src=${url}&uid=${uid}&alt=${uploadState.altToUpload}`,
            {
              headers: {
                Authorization: process.env.FUNCTIONS_AUTH ?? '',
              },
            },
          )
            .then((res) => {
              return res.json();
            })
            .catch((e) => console.error(e));
          if (result.level != undefined) {
            setUploadState((prev) => ({
              ...prev,
              result: url,
              nsfw: result.level,
              nsfwMessages: result.messages,
              registered: true,
              altToUpload: '',
              altRegistered: prev.altToUpload,
              error: undefined,
            }));
          } else {
            setUploadState((prev) => ({
              ...prev,
              error: 'アップロードできませんでした',
            }));
          }
        } else {
          setUploadState((prev) => ({
            ...prev,
            error: 'NSFW判定できませんでした',
          }));
        }
      });
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
                  {uploadState.nsfwMessages && <>{uploadState.nsfwMessages.join('、')}</>}
                </>
              )}
            </>
          )}
          {uploadState.error && (
            <Badge colorScheme="red">{JSON.stringify(uploadState.error)}</Badge>
          )}
        </Stack>
      )}
    </Formik>
  );
}
