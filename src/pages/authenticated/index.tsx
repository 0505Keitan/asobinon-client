import firebase from 'firebase/app';
import Layout from '@/components/layout';
import { useAuthentication } from '../../hooks/authentication';
import { Box, Heading, ButtonGroup, Stack } from '@chakra-ui/react';
import { ResetButton, SubmitButton, CheckboxSingleControl } from 'formik-chakra-ui';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as gtag from '@/lib/gtag';

import Warning from '@/components/common/warning';

export default function UsersMe() {
  const { user } = useAuthentication();

  const validationSchema = Yup.object({
    agreed: Yup.bool().required('利用規約に同意していたかない場合、サービスのご利用はできません。'),
  });

  const login = () => {
    // 今のところscopeは追加しない (組織判定はread:orgが必要)
    const provider = new firebase.auth.GithubAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <Layout meta={{ title: 'マイページ', desc: 'マイページ' }}>
      {user ? (
        <>
          <Box>
            <Heading as="h1" mb={6} fontStyle="h1">
              マイページ
            </Heading>
            <Box bg="gray.100" rounded="lg" p={6} m={3}>
              <Box>{user.name}さん</Box>
              <Box>(お問い合わせID: {user.uid})</Box>
            </Box>
          </Box>
        </>
      ) : (
        <>
          <Box>
            <Heading as="h1" mb={6} fontStyle="h1">
              マイページ
            </Heading>
          </Box>
          <Heading as="h2" fontStyle="h2" mb={4}>
            ログイン
          </Heading>
          <Box mb={8}>
            <Formik
              initialValues={{
                agreed: false,
              }}
              validationSchema={validationSchema}
              onSubmit={() => {
                if (typeof window !== 'undefined') {
                  gtag.event({
                    action: 'login',
                    category: 'user',
                    label: 'マイページでログイン',
                  });
                }
                setTimeout(() => {
                  login();
                }, 1000);
              }}
            >
              {({ handleSubmit, values }) => (
                <Stack as="form" onSubmit={handleSubmit as any} spacing={6}>
                  <Box mb={2}>
                    <Warning />
                  </Box>
                  <CheckboxSingleControl mt={2} name="agreed">
                    利用規約に同意しました
                  </CheckboxSingleControl>
                  <ButtonGroup>
                    {values.agreed && <SubmitButton>ログイン</SubmitButton>}
                    <ResetButton>リセット</ResetButton>
                  </ButtonGroup>
                </Stack>
              )}
            </Formik>
          </Box>
        </>
      )}
    </Layout>
  );
}
