export interface UpdateBody {
  path?: string;
  message?: string;
  content?: string;
  committer?: {
    name?: string;
    email?: string;
  };
}
