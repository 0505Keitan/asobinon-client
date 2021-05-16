import firebase from 'firebase/app';
import { useAuthentication } from '@/hooks/authentication';
import firebaseApi from '@/lib/firebase';
import { Box, Button, Menu, MenuButton, MenuList, MenuItem, Flex } from '@chakra-ui/react';
import Image from 'next/image';
import FaiconDiv from '@/components/common/faicon-div';
import { useRouter } from 'next/router';

const SignInComponent = () => {
  const orgName = process.env.GITHUB_ORG_NAME;

  const { user } = useAuthentication();
  const router = useRouter();

  const logout = () => {
    firebaseApi.auth().signOut();
  };
  const login = () => {
    //read:orgでorganization参加を判定
    const provider = new firebase.auth.GithubAuthProvider();
    provider.addScope('read:org');
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(async (result) => {
        const credential = result.credential as firebase.auth.OAuthCredential;
        const token = credential.accessToken;
        user.isMemberOfOrg = await fetch(
          `https://api.github.com/orgs/${orgName}/members/74000913`,
          {
            headers: {
              Authorization: `token ${token}`,
            },
          },
        ).then((res) => res.ok);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const gotomypage = () => {
    router.push('/users/me');
  };
  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton
            as={Button}
            href="/users/me/"
            leftIcon={
              <Box w={6} rounded="full" overflow="hidden">
                <Image src={user ? user.photoURL : '/icon-180x.png'} width={32} height={32} />
              </Box>
            }
            rightIcon={
              isOpen ? (
                <FaiconDiv icon={['fas', 'chevron-up']} />
              ) : (
                <FaiconDiv icon={['fas', 'chevron-down']} />
              )
            }
          >
            <Box textAlign="left" isTruncated minW={16} maxW={24} overflow="hidden">
              {user ? user.name : 'ログイン'}
            </Box>
          </MenuButton>
          {isOpen && (
            <MenuList p={3}>
              <Flex mb={3}>
                {user ? (
                  <>
                    <Box maxW={40} isTruncated overflow="hidden">
                      {user.name}
                    </Box>
                    {`さん`}
                  </>
                ) : (
                  <>{`未ログイン`}</>
                )}
              </Flex>
              {user && (
                <>
                  {user.isMemberOfOrg ? (
                    <MenuItem mb={2} as={Button} colorScheme="cyan" onClick={gotomypage}>
                      マイページ
                    </MenuItem>
                  ) : (
                    <MenuItem>あなたは組織に所属していません</MenuItem>
                  )}
                </>
              )}
              {user ? (
                <MenuItem as={Button} colorScheme="red" onClick={logout}>
                  ログアウト
                </MenuItem>
              ) : (
                <MenuItem
                  as={Button}
                  colorScheme="twitter"
                  leftIcon={<FaiconDiv icon={['fab', 'user']} />}
                  onClick={login}
                >
                  ログイン
                </MenuItem>
              )}
            </MenuList>
          )}
        </>
      )}
    </Menu>
  );
};

export default SignInComponent;
