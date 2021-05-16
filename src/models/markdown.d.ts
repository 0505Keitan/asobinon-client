// gray-matter用
export interface Markdown {
  id: string;
  title?: string;
  date?: string;
}

// remark-htmlで変換後
export interface Post {
  id: string;
  title: string;
  date: string;
  contentHtml?: string;
}
