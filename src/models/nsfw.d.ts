export type NsfwType =
  | 'UNKNOWN'
  | 'VERY_UNLIKELY'
  | 'UNLIKELY'
  | 'POSSIBLE'
  | 'LIKELY'
  | 'VERY_LIKELY';
export type NsfwLevel = 0 | 1 | 2 | 3;
export type NsfwResult = {
  detail: {
    adult: NsfwType;
    spoof: NsfwType;
    medical: NsfwType;
    violence: NsfwType;
    racy: NsfwType;
    adultConfidence: number;
    spoofConfidence: number;
    medicalConfidence: number;
    violenceConfidence: number;
    racyConfidence: number;
    nsfwConfidence: number;
  } | null;
  level: NsfwLevel;
};

export interface NsfwFunctionResult {
  messages: string[];
  level: NsfwLevel;
  searched: string;
}
