import { NsfwResult } from '@/models/nsfw';
import { Stat, StatLabel, StatNumber, StatHelpText, Stack } from '@chakra-ui/react';

export default function NsfwDetailBox({ detail }: { detail: NsfwResult['detail'] }) {
  return (
    <>
      {detail && (
        <Stack>
          <Stat>
            <StatLabel>アダルト度</StatLabel>
            <StatNumber>{detail.adult}</StatNumber>
            <StatHelpText>Confidence: {detail.adultConfidence}</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>医療関係度</StatLabel>
            <StatNumber>{detail.medical}</StatNumber>
            <StatHelpText>Confidence: {detail.medicalConfidence}</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>淫らさ</StatLabel>
            <StatNumber>{detail.racy}</StatNumber>
            <StatHelpText>Confidence: {detail.racyConfidence}</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>ネタ度</StatLabel>
            <StatNumber>{detail.spoof}</StatNumber>
            <StatHelpText>Confidence: {detail.spoofConfidence}</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>暴力度</StatLabel>
            <StatNumber>{detail.violence}</StatNumber>
            <StatHelpText>Confidence: {detail.violenceConfidence}</StatHelpText>
          </Stat>
        </Stack>
      )}
    </>
  );
}
