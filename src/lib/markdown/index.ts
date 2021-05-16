// https://nextjs.org/learn/basics/dynamic-routes

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Markdown, Post } from '@/models/markdown';
import remark from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'src/markdown');

export function getSortedPostsData(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData: Post[] = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');

    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    // matterのデータが欠けている場合も想定
    const md = matterResult.data as Markdown;

    return {
      id,
      title: md.title ?? '(No title)',
      date: md.date ?? '(No date)',
    };
  });

  const sorted = allPostsData.sort((a, b) => {
    return b.date.localeCompare(a.date);
  });

  return sorted;
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(id: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark().use(html).process(matterResult.content);
  const contentHtml = processedContent.toString();

  // matterのデータが欠けている場合も想定
  const md = matterResult.data as Markdown;
  return {
    id,
    title: md.title ?? '(No ',
    date: md.date ?? '(No date)',
    contentHtml,
  };
}
