import { useState } from 'react';
import firebase from '@/lib/firebase';
import 'firebase/storage';
import 'firebase/firestore';

import { Box, Stack, Input, Badge, Flex, Heading } from '@chakra-ui/react';
import ImgToMarkdown from '@/components/common/img-to-markdown';

import { Formik } from 'formik';
import * as Yup from 'yup';
import Warning from '@/components/common/warning';
import CustomUploadButton from '@/components/image-uploader/firebase-uploader';
import NsfwWarning from '@/components/common/nsfw-warning';
import { NsfwFunctionResult } from '@/models/nsfw';
import { nsfwColor } from '@/lib/nsfw-color';
import { useAuthentication } from '@/hooks/authentication';
import UploaderWarning from './uploader-warning';

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
  nsfwMessages: NsfwFunctionResult['messages'];
  // NSFWチェック終わったか
  registered: boolean;

  // アップ成功した場合はresultがURLに
  result?: string;

  // エラー
  error?: string;
}

export default function ImageUploader() {
  const sizeLimit = process.env.STORAGE_SIZE_LIMIT ?? '(未設定)';
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
    nsfwMessages: [],
  };
  const [uploadState, setUploadState] = useState<UploadStateType>(initialState);

  const validationSchema = Yup.object({
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
      error: `容量が${sizeLimit}を超えているか、運営の設定ミスです`,
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
      <>
        <Formik
          initialValues={{
            alt: '',
          }}
          validationSchema={validationSchema}
          onSubmit={() => {}}
        >
          {() => (
            <Flex flexDirection={{ base: 'column', md: 'row' }} as="form">
              <Stack spacing={6} w={{ base: '100%', md: '40%' }} pr={{ base: 0, md: 8 }}>
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
                      </>
                    )}
                    {uploadState.registered && uploadState.result && (
                      <>
                        <Heading as="h2">Markdown</Heading>
                        {/* altRegisteredじゃないとinputと同期してしまう*/}
                        {uploadState.nsfw && uploadState.nsfw > 0 ? (
                          <Box>表示できません</Box>
                        ) : (
                          <ImgToMarkdown src={uploadState.result} alt={uploadState.altRegistered} />
                        )}
                      </>
                    )}
                  </>
                )}
              </Stack>
              <Box w={{ base: '100%', md: '60%' }} flexGrow={1}>
                {uploadState.result ? (
                  <>
                    {uploadState.registered && (
                      <>
                        <Box>
                          {!uploadState.isUploading && (
                            <Stack pt={4} spacing={6}>
                              <Stack>
                                <Heading as="h2">AIによる判定結果</Heading>
                                <Flex gridGap={2}>
                                  <Badge colorScheme={nsfwColor(uploadState.nsfw ?? 0)}>
                                    NSFWレベル: {uploadState.nsfw}
                                  </Badge>
                                  {uploadState.nsfwMessages?.length > 0 && (
                                    <Badge colorScheme={nsfwColor(uploadState.nsfw ?? 0)}>
                                      理由: {uploadState.nsfwMessages.join('、')}
                                    </Badge>
                                  )}
                                </Flex>
                                <Badge colorScheme="teal">
                                  {`NSFWレベル = {アダルト度+(露出度-1)}/2 の四捨五入`}
                                </Badge>
                              </Stack>
                              {uploadState.nsfw && uploadState.nsfw > 1 ? (
                                <Box>
                                  <NsfwWarning nsfw={uploadState.nsfw} />
                                </Box>
                              ) : (
                                <>
                                  <img src={uploadState.result} />
                                </>
                              )}
                            </Stack>
                          )}
                        </Box>
                      </>
                    )}
                  </>
                ) : (
                  <Box>記事に貼る画像をアップロードできます。</Box>
                )}
                {uploadState.error && (
                  <Badge colorScheme="red">{JSON.stringify(uploadState.error)}</Badge>
                )}
                <Stack pt={8} spacing={2}>
                  <Warning />
                  <UploaderWarning />
                </Stack>
              </Box>
            </Flex>
          )}
        </Formik>
      </>
    );
  } else {
    return <></>;
  }
}
