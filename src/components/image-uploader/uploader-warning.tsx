import { Box } from '@chakra-ui/layout';

export default function UploaderWarning() {
  const message = `ファイルを選択すると、即座にアップロードが始まります。Google Cloud Vision
APIによる審査により、「NSFWレベル」が決定され、場合によっては貼り付けを許可しません。濫用は運営が厳正に対処します。${process.env.STORAGE_SIZE_LIMIT}より大きなファイルはアップロードできません。`;
  return (
    <Box p={6} rounded="xl" borderColor="gray.400" borderWidth={2}>
      {message}
    </Box>
  );
}
