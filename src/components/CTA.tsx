import { Link as ChakraLink, Button } from "@chakra-ui/react";

import { Container } from "./Container";

export const CTA = () => (
  <Container
    flexDirection="row"
    position="fixed"
    bottom="0"
    width="100%"
    maxWidth="48rem"
    py={3}
  >
    <ChakraLink
      isExternal
      href="https://github.com/imaicu/markdown-gaming"
      flexGrow={3}
      mx={2}
    >
      <Button width="100%" variant="solid" colorScheme="purple">
        View Repo
      </Button>
    </ChakraLink>
  </Container>
);
