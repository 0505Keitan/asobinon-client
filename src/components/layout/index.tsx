import { Box, useColorMode } from "@chakra-ui/react";
import Head from "next/head";
import { ReactNode } from "react";
interface Props {
  children: ReactNode;
  title: string;
}
const Layout = ({ children, title }: Props) => {
  const { colorMode } = useColorMode();

  const color = { light: "black", dark: "white" };
  return (
    <Box py={6}>
      <Head>
        <title>{title}</title>
      </Head>
      <Box
        maxW="container.lg"
        px={3}
        mx="auto"
        direction="column"
        alignItems="center"
        justifyContent="flex-start"
        color={color[colorMode]}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
