import firebase from 'firebase/app';
import Layout from '@/components/layout';
import { useAuthentication } from '../../hooks/authentication';
import {
  Box,
  Heading,
  Stack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Badge,
  useToast,
} from '@chakra-ui/react';
import Loading from '@/components/common/loading';
import { useEffect, useState } from 'react';

export default function MyPage() {
  const toast = useToast();
  const { user } = useAuthentication();
  const [hasGitHub, setHasGitHub] = useState(false);
  const [errorString, setErrorString] = useState('');
  const [alreadyUse, setAlreadyUse] = useState(false);
  const { onOpen, isOpen, onClose } = useDisclosure();
  const provider = new firebase.auth.GithubAuthProvider();

  useEffect(() => {
    const providerId = firebase.auth().currentUser?.providerId;
    if (providerId?.includes('github')) {
      setHasGitHub(true);
    } else {
      console.info(`匿名でログインします`);
      firebase
        .auth()
        .signInAnonymously()
        .catch((error) => {
          if (error.code === 'auth/operation-not-allowed') {
            alert('匿名ログインが無効です');
          } else {
            console.error(error);
          }
        });
      setHasGitHub(false);
    }
  }, []);
  const linkWithGitHub = () => {
    firebase
      .auth()
      .currentUser?.linkWithPopup(provider)
      .then(() => {
        setHasGitHub(true);
      })
      .catch((error) => {
        console.error(error);
        if (error.code == 'auth/credential-already-in-use') {
          setErrorString(`このGitHubアカウントはすでに使われています。`);
          setAlreadyUse(true);
        } else {
          if (error.code == 'auth/email-already-in-use') {
            setErrorString(`このメールアドレスはすでに使われています。`);
            setAlreadyUse(true);
          } else {
            setErrorString(error.message);
          }
        }
      });
  };

  // 既に使われていた時用
  const signOutAndGitHub = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        firebase
          .auth()
          .signInWithPopup(provider)
          .then(() => {
            setHasGitHub(true);
          });
      });
  };

  // 紐付け解除
  const unlinkGitHub = () => {
    firebase
      .auth()
      .currentUser?.unlink('github.com')
      .then(() => {
        toast({
          title: '紐付けを解除しました',
          status: 'success',
        });
      });
    setHasGitHub(false);
  };

  return (
    <Layout meta={{ title: 'マイページ', desc: 'マイページ' }}>
      {user ? (
        <>
          <Stack>
            <Box>
              <Heading as="h1" mb={6} fontStyle="h1">
                マイページ
              </Heading>
              <Box bg="gray.100" rounded="lg" p={6} m={3}>
                <Box>{user.name}さん</Box>
                <Box>(お問い合わせID: {user.uid})</Box>
              </Box>
              <Box>
                <Heading as="h2" mb={6} fontStyle="h2">
                  GitHubでサインイン{hasGitHub && '済み'}
                </Heading>
                {hasGitHub ? (
                  <Stack bg="gray.100" rounded="lg" p={6} m={3}>
                    <Box>{user.name}さん</Box>
                    <Box>(お問い合わせID: {user.uid})</Box>

                    <Box>
                      <Button colorScheme="red" onClick={unlinkGitHub}>
                        GitHubの紐付けを解除
                      </Button>
                    </Box>
                  </Stack>
                ) : (
                  <Stack spacing={3}>
                    <Box fontSize="lg">あなたは現在、「仮ID」を使っています。</Box>
                    <Box>トラブルの対応がスムーズにできるので、サインインを推奨します。</Box>
                    <Box>
                      <Button onClick={onOpen}>GitHubでサインイン</Button>
                    </Box>
                  </Stack>
                )}
              </Box>
            </Box>
          </Stack>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>GitHubアカウントでサインイン</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {alreadyUse ? (
                  <Box>以下のボタンを押すと、既に使っていたアカウントでサインインし直します。</Box>
                ) : (
                  <Box>
                    <Box>
                      以下のボタンを押すと、新しいタブが開きます。アカウントをお持ちで無い方は、「Create
                      an account」を選んでください。
                    </Box>
                  </Box>
                )}
                {errorString.length > 0 && <Badge colorScheme="red">{errorString}</Badge>}
              </ModalBody>

              <ModalFooter>
                {alreadyUse ? (
                  <Button
                    colorScheme="blue"
                    onClick={() => {
                      onClose();
                      signOutAndGitHub();
                    }}
                  >
                    サインインしなおす
                  </Button>
                ) : (
                  <Button
                    colorScheme="gray"
                    onClick={() => {
                      onClose();
                      linkWithGitHub();
                    }}
                  >
                    新しいタブでサインイン
                  </Button>
                )}
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      ) : (
        <>
          <Box>ユーザー情報を読み取り中...</Box>
          <Loading />
        </>
      )}
    </Layout>
  );
}
