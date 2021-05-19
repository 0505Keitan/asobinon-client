import { UserImage } from '@/models/firestore/user';
import { Button } from '@chakra-ui/button';
import { Badge, Box, Stack } from '@chakra-ui/layout';
import ImgToMarkdown from '../common/img-to-markdown';

function Image({ image, viewerUid }: { image: UserImage; viewerUid: string }) {
  return (
    <Box rounded="xl" borderWidth={2} borderColor="gray.200" p={6}>
      <Stack>
        {image.nsfw > 0 ? (
          <Box>
            <Box fontSize="2rem">NSFW判定なので表示できません。</Box>
            <Badge colorScheme="red">NSFWレベル: {image.nsfw}</Badge>
          </Box>
        ) : (
          <>
            <img src={image.src} />
            <Box>{image.alt && image.alt.length > 0 ? image.alt : '(タイトル無し)'}</Box>
            <ImgToMarkdown src={image.src} alt={image.alt ?? ''} />
          </>
        )}

        <Box>
          {image.src.includes(viewerUid) ? (
            <>削除機能は用意しておりません。お問い合わせください。</>
          ) : (
            <>あなたがアップロードした画像ではありません。</>
          )}
        </Box>
      </Stack>
    </Box>
  );
}

export default function UserImageList({
  images,
  viewerUid,
}: {
  images: UserImage[];
  viewerUid: string;
}) {
  return (
    <Stack spacing={6}>
      {images.map((image) => (
        <Image key={image.filename} image={image} viewerUid={viewerUid} />
      ))}
    </Stack>
  );
}
