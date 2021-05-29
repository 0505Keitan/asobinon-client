import { Badge, Box } from '@chakra-ui/react';
import firebase from 'firebase/app';
import { GetServerSidePropsContext } from 'next';
import Layout from '../../components/layout';

interface PageProps {
  path?: string;
  value?: 'good' | 'bad';
}

const FeedBackPage = ({ path, value }: PageProps) => {
  const SendFeedback = async () => {
    // pathはスラッシュがあるので、そのまま名前にするとサブコレクションとして解釈される
    if (path) {
      const docName = path.replace(/\//g, '_');
      const docRef = firebase.firestore().collection('feedbacks').doc(docName);
      if (value == 'good') {
        docRef
          .set(
            {
              good: firebase.firestore.FieldValue.increment(1),
            },
            { merge: true },
          )
          .then(() => console.debug('Added good'));
      }
      if (value == 'bad') {
        docRef
          .set(
            {
              bad: firebase.firestore.FieldValue.increment(1),
            },
            { merge: true },
          )
          .then(() => console.debug('Added bad'));
      }
    }
  };

  SendFeedback().catch((e) => console.error(e));

  return (
    <Layout meta={{ title: 'フィードバックありがとうございました', desc: '' }}>
      <Box mb={6}>フィードバックありがとうございました。</Box>

      <Badge>評価したページ: {path}</Badge>
    </Layout>
  );
};

export default FeedBackPage;

export const getServerSideProps = async ({ query }: GetServerSidePropsContext) => {
  /*
  https://github.com/sasigume/asobinon/blob/main/website/src/components/docpage/rating.tsx
  フィードバックボタンから、pathとvalueが渡される
  */
  const path = query.path;
  const value = query.value;
  return {
    props: {
      path: path ?? null,
      value: value ?? null,
    },
  };
};
