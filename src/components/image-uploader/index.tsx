import { useState } from 'react';
import firebase from '@/lib/firebase';
import 'firebase/storage';
import 'firebase/firestore';

import { Box, Stack, Input, Badge } from '@chakra-ui/react';
import ImgToMarkdown from '@/components/common/img-to-markdown';
import PleaseLogin from '@/components/common/please-login';

import { Formik } from 'formik';
import { CheckboxControl } from 'formik-chakra-ui';
import * as Yup from 'yup';
import Warning from '@/components/common/warning';
import CustomUploadButton from '@/components/image-uploader/firebase-uploader';
import NsfwWarning from '@/components/common/nsfw-warning';
import { NsfwFunctionResult } from '@/models/nsfw';
import { nsfwColor } from '@/lib/nsfw-color';
import { useAuthentication } from '@/hooks/authentication';

interface UploadStateType {
  // これが「タイトル入力フィールド」と同期
  altToUpload: string;
  // 「確定した」画像タイトルはここ
  altRegistered: string;

  // アップロード中か
  isUploading: boolean;

  // アップロード進捗
  progress: number;

  // NSFWチェック中か
  isChecking: boolean;
  // NSFWレベル(APIから取得)
  nsfw?: NsfwFunctionResult['level'];
  nsfwMessages?: NsfwFunctionResult['messages'];
  // NSFWチェック終わったか
  registered: boolean;

  // アップ成功した場合はresultがURLに
  result?: string;

  // エラー
  error?: string;
}

export default function ImageUploader() {
  const { user } = useAuthentication();
  const initialState = {
    altToUpload: '',
    username: '',
    isChecking: false,
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
      registered: false,
      result: undefined,
      progress: 0,
      error: undefined,
    }));
  const handleProgress = (progress: number) => setUploadState((prev) => ({ ...prev, progress }));
  const handleUploadError = (error: any) => {
    setUploadState((prev) => ({
      ...prev,
      isUploading: false,
      error: `容量が5MBを超えているか、運営の設定ミスです`,
    }));
    console.error(error);
  };
  const handleUploadSuccess = (filename: string) => {
    setUploadState((prev) => ({
      ...prev,
      progress: 100,
      isUploading: false,
      isChecking: true,
    }));
    firebase
      .storage()
      .ref(uploadRef(user.uid))
      .child(filename)
      .getDownloadURL()
      .then(async (url) => {
        // nsfwチェック
        const body = {
          src: url,
          alt: uploadState.altToUpload ?? null,
          uid: user.uid,
        };
        const result: NsfwFunctionResult = await fetch(
          `${process.env.HTTPS_URL}/api/check-image-v2`,
          {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
              Authorization: process.env.FUNCTIONS_AUTH ?? '',
            },
          },
        )
          .then((res) => {
            // チェック中をOFF
            setUploadState((prev) => ({
              ...prev,
              isChecking: false,
            }));
            return res.json();
          })
          .catch((e) => {
            console.error(e);
            setUploadState((prev) => ({
              ...prev,
              error: `NSFW判定できませんでした: ${e}`,
            }));
          });
        console.log(`SEARCHED: ${result.searched}`);
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
            error: 'NSFW判定ができませんでした',
          }));
        }
      });
  };

  if (user) {
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
            {uploadState.isUploading ? (
              <Box>アップロード中: {uploadState.progress}</Box>
            ) : (
              <>
                {uploadState.isChecking ? (
                  <Box>NSFW要素をAIが判定中...</Box>
                ) : (
                  <>
                    <Box>
                      <Box pb={2}>画像のタイトル(任意)</Box>
                      <Input
                        value={uploadState.altToUpload}
                        onChange={(e) =>
                          setUploadState((prev) => ({ ...prev, altToUpload: e.target.value }))
                        }
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
                        storageRef={firebase.storage().ref(uploadRef(user.uid))}
                        onUploadStart={handleUploadStart}
                        onUploadError={handleUploadError}
                        onUploadSuccess={handleUploadSuccess}
                        onProgress={handleProgress}
                        // maxWidth={1280}
                      >
                        クリックして画像を選択
                      </CustomUploadButton>
                    )}
                  </>
                )}
              </>
            )}

            {uploadState.result && (
              <>
                {uploadState.registered && (
                  <>
                    {uploadState.nsfw && uploadState.nsfw > 1 ? (
                      <Box>
                        <NsfwWarning nsfw={uploadState.nsfw} />
                      </Box>
                    ) : (
                      <>
                        {!uploadState.isUploading && (
                          <Stack pt={4} spacing={4}>
                            <Box>アップロードできました。</Box>
                            <Badge colorScheme={nsfwColor(uploadState.nsfw ?? 0)}>
                              NSFWレベル: {uploadState.nsfw}
                            </Badge>
                            <Stack spacing={2}>
                              {/* altRegisteredじゃないとinputと同期してしまう*/}
                              <img src={uploadState.result} />
                              <ImgToMarkdown
                                src={uploadState.result}
                                alt={uploadState.altRegistered}
                              />
                            </Stack>
                          </Stack>
                        )}
                      </>
                    )}
                    {uploadState.nsfwMessages && (
                      <Badge colorScheme={nsfwColor(uploadState.nsfw ?? 0)}>
                        {uploadState.nsfwMessages.join('、')}
                      </Badge>
                    )}
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
  } else {
    return <>ログインしてください</>;
  }
}
