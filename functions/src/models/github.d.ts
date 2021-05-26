type Error = {
  message: string;
  documentation_url: string;
};

type GetResOk = {
  name: string;
  path: string;
  sha: string;
  size: 38;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content: string;
  encoding: string;
  _links: {
    self: string;
    git: string;
    html: string;
  };
};

export type GetResponse = GetResOk & Error;

type PostResOk = {
  content: {
    name: string;
    path: string;
    sha: string;
    size: 38;
    url: string;
    html_url: string;
    git_url: string;
    download_url: string;
    type: string;
    _links: {
      self: string;
      git: string;
      html: string;
    };
  };
  commit: {
    sha: string;
    node_id: string;
    url: string;
    html_url: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    tree: {
      sha: string;
      url: string;
    };
    message: string;
    parents: [
      {
        sha: string;
        url: string;
        html_url: string;
      },
    ];
    verification: {
      verified: boolean;
      reason: string;
      signature: any;
      payload: any;
    };
  };
};
export type PostResponse = PostResOk & Error;
