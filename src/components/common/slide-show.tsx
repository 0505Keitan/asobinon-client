import { Box, Progress, Stack, Stat, StatHelpText, StatNumber } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const SlideShow = ({ initialCount, contents }: { initialCount: number; contents: string[] }) => {
  // progressがsplitになるまでカウントダウン
  const split = contents.length - 1;
  const [count, setCount] = useState(initialCount);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    count > 0 &&
      setTimeout(() => {
        setCount(count - 1);
      }, 1000);
    // あまりを使って進捗を分割
    // この計算がマジでわからない
    // 手探り
    if (count % ((initialCount + 1) / split) < 1) setProgress(progress + 1);
    count == 0 && setProgress(split);
  }, [count]);

  return (
    <Stack spacing={6}>
      <Box>変更の反映には{initialCount}秒ほど時間がかかります</Box>
      <Stat>
        <StatNumber>{count}</StatNumber>
        <StatHelpText>数字は目安です</StatHelpText>
      </Stat>
      <Progress
        size="lg"
        hasStripe={count > 0}
        isAnimated={count > 0}
        value={progress}
        max={split}
      />
      <Box>
        {contents.slice(0, progress + 1).map((c, n) => (
          <Box key={n}>{c}</Box>
        ))}
      </Box>
    </Stack>
  );
};

export default SlideShow;
