import { SITE_URL } from '@/lib/constants';
import { Box, Flex } from '@chakra-ui/react';
import { Formik } from 'formik';
import { InputControl, SubmitButton } from 'formik-chakra-ui';
import FaiconDiv from './faicon-div';

export default function SearchBox() {
  return (
    <>
      {/* バリデーションエラーでレイアウト崩れるのでhidden */}
      <Formik
        onSubmit={(values) => {
          location.href = `https://google.com/search?q=site%3A${SITE_URL}+${values.word}`;
        }}
        initialValues={{ word: '' }}
      >
        {({ handleSubmit, values }) => (
          <Flex as="form" onSubmit={handleSubmit as any}>
            <Box mr={1}>
              <InputControl placeholder="aa" name="word" />
            </Box>
            <SubmitButton colorScheme="purple" aria-label={`${values.word}でGoogleを検索`}>
              <FaiconDiv icon={['fas', 'search']} />
            </SubmitButton>
          </Flex>
        )}
      </Formik>
    </>
  );
}
