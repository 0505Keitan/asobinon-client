// https://github.com/sasigume/asobinon/issues/new/choose

import { Button, ButtonProps } from '@chakra-ui/button';
import LinkChakra from './link-chakra';

export default function CreateIssue({
  text = 'イシューを立てる',
  colorScheme = 'red',
  issue,
}: {
  text?: string;
  colorScheme?: ButtonProps['colorScheme'];
  issue?: { title?: string; body?: string };
}) {
  let issueUrl = `${process.env.DOCS_REPOSITORY_URL}/issues/new`;

  if (issue) {
    issueUrl = issueUrl + `?title=${issue.title ?? 'タイトル'}&body=${issue.body ?? '本文'}`;
  }
  return (
    <Button isExternal area-label={text} colorScheme={colorScheme} as={LinkChakra} href={issueUrl}>
      {text}
    </Button>
  );
}
