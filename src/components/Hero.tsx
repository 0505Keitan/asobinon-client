import { Flex, Heading } from "@chakra-ui/react";

export const Hero = ({ title }: { title: string }) => (
  <Flex justifyContent="center" alignItems="center" my={8}>
    <Heading fontSize={64}>{title}</Heading>
  </Flex>
);
