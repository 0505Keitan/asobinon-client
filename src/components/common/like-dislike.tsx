import { Box, Flex, Button, useColorMode } from '@chakra-ui/react';
import FaiconDiv from './faicon-div';
import { useRef, useState } from 'react';
import firebase from '@/lib/firebase/index';
import { User } from '@/models/auth/user';
import { useToast } from '@chakra-ui/react';
import * as gtag from '@/lib/gtag';
interface Props {
  likeCount?: number;
  dislikeCount?: number;
  slug: string;
  uid?: User['uid'];
}

const addJewel = async (uid: User['uid']) => {
  firebase
    .firestore()
    .collection('users')
    .doc(uid)
    .set(
      {
        jewel: firebase.firestore.FieldValue.increment(100),
      },
      { merge: true },
    );
};

const LikeDislike = ({ likeCount, dislikeCount, slug, uid }: Props) => {
  const alertRef = useRef(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const pressed = liked || disliked;

  const { colorMode } = useColorMode();

  // カウントは最初の値で、バリューが表示用の変化する値

  let [likeValue, setLikeValue] = useState(likeCount ?? 0);
  let [dislikeValue, setDislikeValue] = useState(dislikeCount ?? 0);

  const ratio = (likeValue / (likeValue + dislikeValue)) * 100;
  let noRatio = false;
  if (likeValue + dislikeValue == 0) {
    noRatio = true;
  }

  const toast = useToast();

  const Like = async () => {
    if (!liked && !disliked) {
      await firebase
        .firestore()
        .collection('blogPosts')
        .doc(slug)
        .set(
          {
            like: firebase.firestore.FieldValue.increment(1),
          },
          { merge: true },
        )
        .then(() => {
          if (uid) {
            addJewel(uid).catch((e) => {
              console.error(e);
            });
          }

          setLikeValue((prevValue) => prevValue + 1);
          setLiked(true);

          toast({
            title: '記事を高評価しました',
            description: 'エンティティガチャ用のジュエルを100個贈呈します。\n(低評価でも同様です)',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });

          if (typeof window !== 'undefined') {
            gtag.event({
              action: 'like',
              category: 'blogPost',
              label: '記事を高評価',
            });
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };

  const Dislike = async () => {
    if (!liked && !disliked) {
      await firebase
        .firestore()
        .collection('blogPosts')
        .doc(slug)
        .set(
          {
            dislike: firebase.firestore.FieldValue.increment(1),
          },
          { merge: true },
        )
        .then(() => {
          if (uid) {
            addJewel(uid).catch((e) => {
              console.error(e);
            });
          }

          setDislikeValue((prevValue) => prevValue + 1);

          setDisliked(true);

          toast({
            title: '記事を低評価しました',
            description: 'エンティティガチャ用のジュエルを100個贈呈します。\n(高評価でも同様です)',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });

          if (typeof window !== 'undefined') {
            gtag.event({
              action: 'dislike',
              category: 'blogPost',
              label: '記事を低評価',
            });
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };

  return (
    <Box w="full">
      <Flex
        alignContent="center"
        justifyContent="space-between"
        fontWeight="bold"
        w="full"
        position="relative"
      >
        <Box>
          <Button
            ref={alertRef}
            cursor="pointer"
            isActive={!pressed}
            disabled={pressed}
            aria-label="高評価する"
            onClick={Like}
            color={
              liked
                ? colorMode == 'light'
                  ? 'blue'
                  : 'cyan' // ダークで押した
                : colorMode == 'light'
                ? 'gray.500'
                : 'gray.100' //ダークで押してない
            }
            sx={{ background: 'transparent!important' }}
          >
            <FaiconDiv w={'22px'} icon={['fas', 'thumbs-up']} />
          </Button>
          Like {likeValue}
        </Box>
        <Box>
          Dis {dislikeValue}
          <Button
            ref={alertRef}
            cursor="pointer"
            isActive={!pressed}
            disabled={pressed}
            aria-label="低評価する"
            as="a"
            onClick={Dislike}
            color={
              disliked
                ? colorMode == 'light'
                  ? 'red'
                  : 'brown' // ダークで押した
                : colorMode == 'light'
                ? 'gray.500'
                : 'gray.100' //ダークで押してない
            }
            sx={{ background: 'transparent!important' }}
          >
            <FaiconDiv w={'22px'} icon={['fas', 'thumbs-down']} />
          </Button>
        </Box>
      </Flex>

      <Flex w="full" h={3}>
        {noRatio ? (
          <>
            <Box w="50%" h="full" bg="gray.300"></Box>
            <Box w="50%" h="full" bg="gray.300"></Box>
          </>
        ) : (
          <>
            <Box w={noRatio ? 50 : `${ratio}%`} h="full" bg="blue.500"></Box>
            <Box w={`${100 - ratio}%`} h="full" bg="red.500"></Box>
          </>
        )}
      </Flex>
    </Box>
  );
};

export default LikeDislike;
