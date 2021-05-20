import { nsfwColor } from '@/lib/nsfw-color';
import { UserImage } from '@/models/firestore/user';
import { Badge, Box, Stack, SimpleGrid, Center } from '@chakra-ui/react';
import ImgToMarkdown from '../common/img-to-markdown';
import useSWR from 'swr';
import { User } from '@/models/auth/user';
import { useState } from 'react';
import { useAuthentication } from '@/hooks/authentication';

function Image({ image }: { image: UserImage }) {
  return (
    <Box mx="auto" borderWidth={1} w="300px" borderColor="gray.200" p={6}>
      <Stack>
        <Badge colorScheme={nsfwColor(image.nsfw)}>NSFWレベル: {image.nsfw}</Badge>
        {image.nsfw > 1 ? (
          <Box>
            <Box>NSFW判定が2以上なので表示できません。</Box>
          </Box>
        ) : (
          <>
            <Center flexGrow={1} h="200px" overflow="hidden" objectFit="cover">
              <img src={image.src} />
            </Center>
            <Box bg="white" w="100%">
              <Box>{image.alt && image.alt.length > 0 ? image.alt : '(タイトル無し)'}</Box>
              <ImgToMarkdown src={image.src} alt={image.alt ?? ''} />
            </Box>
          </>
        )}
      </Stack>
    </Box>
  );
}

export default function UserImageList() {
  const { user } = useAuthentication();
  const [loading, setLoading] = useState(false);

  const fetcher = (uid: User['uid']) => {
    console.debug(`Triggering fetcher`);
    setLoading(true);

    let result: Promise<UserImage[]>;
    result = fetch(`${process.env.HTTPS_URL}/api/get-user-images?uid=${uid}&start=0&limit=10`, {
      headers: {
        authorization: process.env.FUNCTIONS_AUTH ?? '',
      },
    }).then((res) => {
      console.info(`%cImage loaded`, `font-weight:bold`);
      setLoading(false);
      return res.json();
    });
    return result;
  };

  const { data, error } = useSWR(`${user.uid}`, (uid) => fetcher(uid), {
    refreshInterval: 0,
    revalidateOnFocus: false,
  });

  return (
    <SimpleGrid minChildWidth="294px" gap={0}>
      {data && data.map((image) => <Image key={image.src} image={image} />)}
      {loading && <Badge>Loading...</Badge>}
      {error && <Badge>{error}</Badge>}
    </SimpleGrid>
  );
}
