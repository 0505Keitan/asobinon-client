import { join } from 'path';
import fs from 'fs';
import matter from 'gray-matter';
export interface PageProps {
  data: {
    title?: string;
    [key: string]: any;
  } | null;
  content: string | null;
}

const getMd = async (filename?: string | string[]) => {
  if (typeof filename !== 'string') {
    return { data: null, content: null };
  }
  const markdown = join(process.cwd(), 'src/markdown', filename + '.md');
  const fileContents = fs.readFileSync(markdown, 'utf8');
  const { data, content } = matter(fileContents);
  const result = {
    data: {
      ...data,
      title: data.title ?? '(タイトルなし)',
    },
    content: content,
  };
  return result;
};
export default getMd;
