import { Box } from "@chakra-ui/layout";
import { GetServerSidePropsContext } from "next";

interface PageProps {
  path?: string;
}

const EditDocsPage = ({ path }: PageProps) => {
  return <Box>{path ?? "パス指定がないよ!"}</Box>;
};

export default EditDocsPage;

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  const path = query.path;
  return {
    props: {
      path: path ?? null,
    },
  };
};
