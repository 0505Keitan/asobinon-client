import { ButtonGroup } from '@chakra-ui/button';
import { Box, Code, Stack } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/toast';
import { Formik } from 'formik';
import { InputControl, ResetButton, SubmitButton, TextareaControl } from 'formik-chakra-ui';
import { useState } from 'react';
import * as Yup from 'yup';

export default function ContactForm() {
  const validationSchema = Yup.object({
    title: Yup.string().required('件名を入力してください。'),
    text: Yup.string().required('本文を入力してください。'),
    email: Yup.string().email('メールアドレスの形式が正しくありません').optional(),
  });
  const initialValues = {
    title: '',
    text: '',
    email: '',
  };
  const [fetchState, setFetchState] = useState({
    submitted: false,
    isError: false,
    message: '',
  });

  const toast = useToast();

  return (
    <Formik
      onSubmit={async (values) => {
        await fetch(`${process.env.HTTPS_URL}/api/send`, {
          method: 'POST',
          body: JSON.stringify(values),
          headers: {
            Authorization: process.env.FUNCTIONS_AUTH ?? '',
          },
        })
          .then((res) => {
            if (res.ok) {
              setFetchState((prevValue) => ({
                ...prevValue,
                submitted: true,
                message: '送信完了',
                isError: false,
              }));
              toast({
                title: 'お問い合わせが送信できました',
                status: 'success',
              });
            } else {
              toast({
                title: `送信に失敗しました: ${res.statusText}`,
                status: 'error',
              });
            }
          })
          .catch((e) => {
            console.error(e);
            setFetchState((prevState) => ({
              ...prevState,
              message: JSON.stringify(e),
              isError: true,
            }));
          });
      }}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      {({ values, handleSubmit }) => (
        <>
          {fetchState.submitted == false ? (
            <Stack spacing={6} as="form" onSubmit={handleSubmit as any}>
              <InputControl name="title" area-label="件名" label="件名" />
              <TextareaControl name="text" area-label="本文" label="本文" />
              <InputControl
                name="email"
                area-label="返信用メールアドレス(任意)"
                label="返信用メールアドレス(任意)"
              />

              {fetchState.isError == false ? (
                <ButtonGroup>
                  <SubmitButton>送信</SubmitButton>
                  <ResetButton>リセット</ResetButton>
                </ButtonGroup>
              ) : (
                <Box>
                  <Box mb={6}>
                    私どもの設定ミスにより、送信に失敗したようです。大変お手数おかけしますが、以下の内容を@sasigumeまでDMしていただけると助かります。
                  </Box>
                  <Box bg="gray.100">
                    <Code>{JSON.stringify(fetchState)}</Code>
                    <Code>{JSON.stringify(values)}</Code>
                  </Box>
                </Box>
              )}
            </Stack>
          ) : (
            <Box>
              <Box>送信ありがとうございました。</Box>
              <Box>受付日時: {new Date().toLocaleString('ja-JP')}</Box>
              <Box>送信内容: {values.text}</Box>
              {values.email.length > 0 && (
                <Box>返信までお時間をいただく場合がございますが、ご了承ください。</Box>
              )}
            </Box>
          )}
        </>
      )}
    </Formik>
  );
}
