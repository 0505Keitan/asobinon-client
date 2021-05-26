export interface UpdateBody {
  path?: string;
  message?: string;
  content?: string;
  sha?: string;
  committer?: {
    name?: string;
    email?: string;
  };
}
