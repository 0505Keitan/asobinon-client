import { Box, Flex, Button, useColorMode } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import FaiconDiv from './faicon-div';
import LinkChakra from './link-chakra';

interface TocProps {
  tweetCount?: number;
  tweetText?: string;
}

const FukidashiShare = ({ tweetCount, tweetText }: TocProps) => {
  const { colorMode } = useColorMode();
  const { asPath } = useRouter();
  const shareUrl = (process.env.HTTPS_URL + asPath) as string;

  const fukidashiStyle = {
    '.fukidashiBox': {
      position: 'relative',
      color: '',
      background: colorMode == 'light' ? '#fff' : '#000',
      padding: '7px 14px 7px',
      borderRadius: '10px',
      border: 'solid 2px #ddd',
    },
    '.fukidashiBox::before': {
      content: "''",
      display: 'block',
      position: 'absolute',
      top: '15px',
      left: '-10px',
      width: '0px',
      height: '0px',
      borderWidth: '5px',
      borderColor: `transparent ${colorMode == 'light' ? '#ddd' : '#000'} transparent transparent`,
    },
  };

  const tweetUrl = `https://twitter.com/share?url=${encodeURIComponent(
    shareUrl,
  )}&text=${encodeURIComponent(tweetText ?? '')}&hashtags=ナポクラ`;

  return (
    <Flex sx={fukidashiStyle} alignItems="center">
      <Box>
        <Button
          aria-label="ツイートする"
          target="_blank"
          as={LinkChakra}
          href={tweetUrl}
          colorScheme={colorMode == 'light' ? 'twitter' : 'teal'}
        >
          <FaiconDiv icon={['fab', 'twitter']} />
        </Button>
      </Box>

      <Box
        ml={2}
        className="fukidashiBox"
        bg={colorMode == 'dark' ? 'black' : 'white'}
        fontSize="lg"
      >
        {tweetCount ?? 0} Tweets
      </Box>
    </Flex>
  );
};

export default FukidashiShare;
