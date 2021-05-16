import { Post } from '@/models/contentful/Post';
import { OGP_W, OGP_H } from '@/theme/index';

interface ReviewSchema {
  '@context': string;
  '@type': string;
  itemReviewed: ItemReviewed;
  ratingValue: number;
  bestRating: string;
  worstRating: string;
  ratingCount: number;
}

interface ItemReviewed {
  '@type': string;
  name: string;
  description: string;
  image: Image;
  supply: Supply[];
  tool: Tool[];
  totalTime: string;
  step: Step[];
}

interface Image {
  '@type': string;
  url: string;
  height: string;
  width: string;
}

interface Step {
  name: string;
  text: string;
  url: string;
  image: string;
  '@type': 'HowToStep';
}

interface Supply {
  '@type': string;
  name: string;
}

interface Tool {
  '@type': string;
  name: string;
}

// https://dev.to/aviaryan/rendering-json-ld-data-in-nextjs-and-reactjs-29op
const generateReviewSchema = (post: Post): ReviewSchema => {
  let sum = post.like + post.dislike;
  let ratio: number;
  // 擬似的に五段階評価っぽくする
  ratio = (post.like / sum) * 5;

  const defaultOgp = process.env.HTTPS_URL + '/api/ogpgen?text=' + encodeURIComponent(post.title);

  const supplies = post.platformsCollection?.items.map((pl) => {
    return {
      '@type': 'HowToSupply',
      name: pl.displayName,
    };
  });

  // ISO8601
  const totalTime = (body: string) => `PT${Math.round(body.length / 400)}M`;

  /* HowToのステップを定義する
  https://developers.google.com/search/docs/data-types/how-to
  APIから見出しが送られてくるのでそれを解析
  */
  let steps: Step[] = [];
  if (post.headings.length > 0) {
    steps = post.headings.map((h, n) => {
      return {
        name: h.name,
        // noParagraphがtrueなら文章が生成できていないので、適当に誤魔化す
        text: post.noParagraph
          ? `ステップ${n}は、${h.text}。記事に詳しい手順を掲載していますので、ご確認ください。`
          : h.text,
        // 一応アンカーリンク
        url: `${process.env.HTTPS_URL}/${post.slug}#${encodeURIComponent(
          h.name.replace(` `, `-`),
        )}`,
        image:
          h.image ??
          `${process.env.HTTPS_URL}/api/ogpgen?size=square&text=${encodeURIComponent(h.name)}`,
        '@type': 'HowToStep',
      };
    });
  }

  let tools: Tool[] = [];
  if (post.game && post.game.slug) {
    tools = [
      {
        '@type': 'HowToTool',
        name: post.game?.displayName,
      },
    ];
  }

  return {
    // schema truncated for brevity
    '@context': 'http://schema.org',
    '@type': 'AggregateRating',
    itemReviewed: {
      '@type': 'HowTo',
      name: post.title,
      description: post.description ?? post.title,
      image: {
        '@type': 'ImageObject',
        url: post.heroImage != undefined ? post.heroImage.url : defaultOgp,
        height: `${OGP_W}`,
        width: `${OGP_H}`,
      },
      supply: supplies ?? [],
      tool: tools ?? [],
      totalTime: totalTime(post.body),
      step: steps,
    },
    ratingValue: ratio ?? 0,
    bestRating: '5',
    worstRating: '0',
    ratingCount: sum ?? 1,
  };
};

export default generateReviewSchema;
