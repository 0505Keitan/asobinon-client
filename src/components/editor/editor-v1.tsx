import { useEffect, useState } from 'react';
import MDEditor from '@namskiiiii/react-md-editor-naked';
import '@namskiiiii/react-md-editor-naked/dist/markdown-editor.css';
const gfm = require('remark-gfm');
import { decode } from 'js-base64';
import useSWR from 'swr';
import {
  Badge,
  Stack,
  Box,
  useToast,
  Code,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
} from '@chakra-ui/react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { InputControl, SubmitButton } from 'formik-chakra-ui';
import { GetResOk } from '@/models/github';
import LinkChakra from '../common/link-chakra';

const EditorV1 = ({ path }: { path: string }) => {
  const toast = useToast();

  const [errorString, setErrorString] = useState('');
  const [loading, setLoading] = useState(false);

  const fetcher = async (path: string) => {
    console.debug(`Triggering fetcher`);
    setLoading(true);

    const result: GetResOk = await fetch(`${process.env.HTTPS_URL}/api/get-github?path=${path}`, {
      headers: {
        authorization: process.env.FUNCTIONS_AUTH ?? '',
      },
    })
      .then(async (res) => {
        console.info(`%cInitial data loaded`, `font-weight:bold`);

        setLoading(false);
        const data = await res.json();
        console.log(data);
        return data;
      })
      .catch((e) => console.error(e));

    return result;
  };

  // これが入力中のMarkdown
  const { data } = useSWR(`${path}`, (path) => fetcher(path), {
    refreshInterval: 0,
    revalidateOnFocus: false,
  });
  const decoded = decode(data?.content ?? '');
  const [md, setMd] = useState(decoded);
  const [link, setLink] = useState(data?.html_url);

  useEffect(() => {
    setMd(decoded);
  }, [data]);

  /*-------------------------
   Form
  ------------------------ */

  const [sending, setSending] = useState(false);
  const initialValues = {
    message: '',
  };
  const validation = Yup.object({
    message: Yup.string()
      .required('コミットメッセージは必須です')
      .min(5, '短すぎます')
      .max(80, '長すぎます'),
  });

  /* -------------------------
  Conflictしたとき
  ------------------- */
  const [isConflict, setIsConflict] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  // 矛盾した時に取得
  const currentData = () => {
    try {
      const { data, error, mutate } = useSWR(`${path}_CONFLICT`, (path) => fetcher(path), {
        refreshInterval: 0,
        revalidateOnFocus: false,
      });
      return { data: data, error: error, mutate: mutate };
    } catch (e) {
      console.error(e);
    }
  };
  const toggleConflictView = () => {
    currentData()?.mutate();
    setIsConflict(true);
    setErrorString('矛盾を修復してください。');
  };

  /*-----------------------------------*/

  return (
    <>
      {loading ? (
        <Box>Loading...</Box>
      ) : (
        <Stack spacing={6}>
          {path && (
            <Button as={LinkChakra} isExternal href={link}>
              GitHubで見る
            </Button>
          )}
          <MDEditor
            value={md}
            onChange={(current) => setMd(current ?? '')}
            previewOptions={{
              remarkPlugins: [gfm],
            }}
          />
          <Formik
            onSubmit={(values) => {
              const body = {
                message: values.message,
                path: path,
                content: md,
                committer: {
                  name: `asobinon`,
                  email: `sasigume+test@gmail.com`,
                },
                sha: data?.sha,
              };
              setSending(true);
              fetch(`${process.env.HTTPS_URL}/api/edit`, {
                method: 'PUT',
                headers: {
                  Authorization: process.env.FUNCTIONS_AUTH ?? '',
                },
                body: JSON.stringify(body),
              })
                .then(async (res) => {
                  setSending(false);
                  // 201はファイル作成
                  if (res.status == (200 || 201)) {
                    toast({
                      title: '編集が反映されました',
                      status: 'success',
                    });
                  } else {
                    // shaが矛盾すると409 Conflictになる
                    if (res.status == 409) {
                      // モーダル
                      onOpen();
                    } else {
                      const data = await res.json();
                      setErrorString(
                        data.message ?? '内部のAPIからエラー理由が帰って来ませんでした',
                      );
                      toast({
                        title: '送信に失敗しました',
                        description:
                          data.message ?? '内部のAPIからエラー理由が帰って来ませんでした',
                        status: 'error',
                      });
                    }
                  }
                })
                .catch((e) => {
                  setErrorString(e.message ?? JSON.stringify(e));
                  toast({
                    title: '送信に失敗しました',
                    description: JSON.stringify(e),
                    status: 'error',
                  });
                });
            }}
            validationSchema={validation}
            initialValues={initialValues}
          >
            {({ errors, values, handleSubmit }) => (
              <Stack as="form" onSubmit={handleSubmit as any}>
                <Box>
                  <InputControl name="message" label="コミットメッセージ" />
                  <Badge>{values.message.length}文字</Badge>
                </Box>
                {!isConflict && (
                  <>
                    {!errors.message && (
                      <SubmitButton isLoading={sending}>GitHubに反映させる</SubmitButton>
                    )}
                    {errorString.length > 0 && <Code colorScheme="red">{errorString}</Code>}
                  </>
                )}
                {isConflict && <Box>{currentData()?.data?.content}</Box>}
              </Stack>
            )}
          </Formik>
          {/* Conflictすると開く。コピーすると追加でロード */}
          <Modal isOpen={isOpen} onClose={() => {}}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>他の人がファイルを編集しました</ModalHeader>
              <ModalBody>
                <Box>以下のボタンを押すと、比較画面が出ます。</Box>
                {/* ここに案内画像 */}
                <Box>自分の書いた部分と比べて、相手の編集と矛盾をなくしてください。</Box>
              </ModalBody>

              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={() => {
                    toggleConflictView;
                    onClose;
                  }}
                >
                  わかりました
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Stack>
      )}
    </>
  );
};

export default EditorV1;
