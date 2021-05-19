import { NsfwLevel } from '@/models/nsfw';

export const nsfwColor = (level: NsfwLevel) => {
  if (level > 0) {
    return 'purple';
  }
  if (level > 1) {
    return 'pink';
  }
  if (level > 2) {
    return 'red';
  }

  return 'green';
};
