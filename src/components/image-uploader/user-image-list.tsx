import { nsfwColor } from '@/lib/nsfw-color';
import { UserImage } from '@/models/firestore/user';
import { Badge, Box, Stack } from '@chakra-ui/react';
import ImgToMarkdown from '../common/img-to-markdown';
import useSWR from 'swr';
import { User } from '@/models/auth/user';
import { useState } from 'react';
import { useAuthentication } from '@/hooks/authentication';

function Image({ image }: { image: UserImage }) {
  return (
    <Box rounded="xl" borderWidth={2} borderColor="gray.200" p={6}>
      <Stack>
        {image.nsfw > 1 ? (
          <Box>
            <Box fontSize="2rem">NSFW判定が2以上なので表示できません。</Box>
          </Box>
        ) : (
          <>
            <img src={image.src} />
            <Box>{image.alt && image.alt.length > 0 ? image.alt : '(タイトル無し)'}</Box>
            <ImgToMarkdown src={image.src} alt={image.alt ?? ''} />
          </>
        )}

        <Badge colorScheme={nsfwColor(image.nsfw)}>NSFWレベル: {image.nsfw}</Badge>
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
    <Stack spacing={6}>
      {data && data.map((image) => <Image key={image.src} image={image} />)}
      {loading && <Badge>Loading...</Badge>}
      {error && <Badge>{error}</Badge>}
    </Stack>
  );
}
