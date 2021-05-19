import React from 'react';
import FirebaseFileUploaderModifiedBySasigume from './uploader';

import type { Props as UploaderProps } from './uploader';
import { Button } from '@chakra-ui/button';

type Props = UploaderProps & {
  className?: string;
  htmlFor?: string;
  id?: string;
  children?: any;
};

const CustomUploadButton = (props: Props) => {
  const { className, children, htmlFor = props.id, ...inputProps } = props;

  return (
    <Button cursor="pointer" as="label" className={className} htmlFor={htmlFor}>
      {children}
      <FirebaseFileUploaderModifiedBySasigume hidden {...inputProps} />
    </Button>
  );
};

export default CustomUploadButton;
