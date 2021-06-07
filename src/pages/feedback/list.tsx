import { SingleFeedback } from '@/components/feedback';
import { Feedback } from '@/models/firestore/feedback';
import { Box, Heading, Stack } from '@chakra-ui/react';
import Layout from '../../components/layout';

interface PageProps {
  feedbacks: Feedback[];
  error?: string;
}

const FeedbackListPage = ({ feedbacks, error }: PageProps) => {
  return (
    <Layout meta={{ title: '対応が必要なページ', desc: '' }}>
      <Stack spacing={6}>
        {error ? (
          <>
            <Box>エラー: {error}</Box>
          </>
        ) : (
          <>
            <Heading>対応が必要なページ</Heading>
            <Box>
              今までフィードバックをいただいたページの中で、低評価が多いもの上位10件数を表示しています。
            </Box>
            <Stack spacing={6}>
              {feedbacks.map((f, n) => (
                <SingleFeedback feedback={f} key={n} />
              ))}
            </Stack>
          </>
        )}
      </Stack>
    </Layout>
  );
};

export default FeedbackListPage;

export const getServerSideProps = async () => {
  /*
  https://github.com/sasigume/asobinon/blob/main/src/components/docpage/rating.tsx
  フィードバックボタンから、pathとvalueが渡される
  */

  let api = `${process.env.FUNCTIONS_URL}/feedback-getAllFeedback`;
  return await fetch(api, {
    headers: {
      Authorization: process.env.FUNCTIONS_AUTH ?? '',
    },
  })
    .then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        return {
          props: {
            feedbacks: data ?? [],
          },
        };
      } else {
        return {
          props: {
            feedbacks: [],
            error: `${res.statusText}`,
          },
        };
      }
    })
    .catch((e) => {
      return {
        error: e.message ?? JSON.stringify(e),
      };
    });
};
