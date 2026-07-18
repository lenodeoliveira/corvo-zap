import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/theme';
import {
  formatArrivalLabel,
  formatRemainingTime,
  getDistanceProgress,
} from '@/utils/format-message';
import type { LiveTracking } from '@/utils/message-tracking';

import { FLYING_CROW_HEIGHT, FLYING_CROW_WIDTH, FlyingCrow } from './flying-crow';

const parchmentBg = require('@/assets/images/parchment-bg.png');

const ink = {
  primary: '#3D2B1F',
  muted: 'rgba(61, 43, 31, 0.62)',
} as const;

type TravelingCardProps = {
  departureAt: string;
  arrivalAt: string;
  liveTracking: LiveTracking;
};

export function TravelingCard({ departureAt, arrivalAt, liveTracking }: TravelingCardProps) {
  const { traveledKm, totalKm } = getDistanceProgress(liveTracking);
  const [trackWidth, setTrackWidth] = useState(0);
  const progressRatio = Math.max(0, Math.min(liveTracking.progress, 100)) / 100;
  const crowLeft = Math.max(
    0,
    Math.min(trackWidth * progressRatio - FLYING_CROW_WIDTH / 2, trackWidth - FLYING_CROW_WIDTH),
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.parchment}>
        <Image source={parchmentBg} style={styles.parchmentImage} contentFit="fill" />

        <View style={styles.content}>
          <Text style={styles.title}>
            Você está prestes a receber um corvo, aguarde ele chegar
          </Text>

          <View style={styles.ornament} />

          <View style={styles.illustration}>
            <Feather name="feather" size={28} color={ink.primary} style={styles.ravenIcon} />
            <View style={styles.letter}>
              <Feather name="mail" size={10} color={theme.colors.error} />
            </View>
          </View>

          <View style={styles.progressHeader}>
            <View
              style={styles.progressTrackContainer}
              onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${liveTracking.progress}%` }]} />
              </View>

              {trackWidth > 0 ? (
                <FlyingCrow
                  style={[
                    styles.flyingCrow,
                    {
                      left: crowLeft,
                    },
                  ]}
                />
              ) : null}
            </View>
            <Text style={styles.progressValue}>{liveTracking.progress}%</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Distância percorrida</Text>
              <Text style={styles.statValue}>
                {traveledKm.toLocaleString('pt-BR')} km de {totalKm.toLocaleString('pt-BR')} km
              </Text>
            </View>

            <View style={styles.stat}>
              <Text style={styles.statLabel}>Tempo restante</Text>
              <Text style={styles.statValue}>
                {formatRemainingTime(liveTracking.remainingMinutes)}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Tempo estimado</Text>
              <Text style={styles.statValue}>{formatArrivalLabel(departureAt)}</Text>
            </View>

            <View style={styles.stat}>
              <Text style={styles.statLabel}>Chegada prevista</Text>
              <Text style={styles.statValue}>{formatArrivalLabel(arrivalAt)}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  parchment: {
    alignSelf: 'center',
    width: '90%',
    maxWidth: 300,
    position: 'relative',
    ...theme.shadow.sm,
  },
  parchmentImage: {
    ...StyleSheet.absoluteFill,
  },
  content: {
    paddingTop: 36,
    paddingBottom: 34,
    paddingHorizontal: 34,
    gap: theme.spacing.sm,
  },
  title: {
    fontFamily: theme.typography.fontFamily.title,
    fontSize: theme.typography.fontSize.sm,
    lineHeight: theme.typography.lineHeight.sm,
    color: ink.primary,
    textAlign: 'center',
  },
  ornament: {
    alignSelf: 'center',
    width: '68%',
    height: 1,
    backgroundColor: 'rgba(61, 43, 31, 0.28)',
  },
  illustration: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  ravenIcon: {
    transform: [{ rotate: '-20deg' }],
  },
  letter: {
    position: 'absolute',
    right: '38%',
    top: 12,
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(61, 43, 31, 0.25)',
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  progressTrackContainer: {
    flex: 1,
    justifyContent: 'center',
    minHeight: FLYING_CROW_HEIGHT,
  },
  progressTrack: {
    height: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(61, 43, 31, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(61, 43, 31, 0.22)',
    overflow: 'hidden',
  },
  flyingCrow: {
    position: 'absolute',
    top: (6 - FLYING_CROW_HEIGHT) / 2 - 1,
  },
  progressFill: {
    height: '100%',
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.success,
  },
  progressValue: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.xs,
    color: ink.primary,
    minWidth: 32,
    textAlign: 'right',
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  stat: {
    flex: 1,
    gap: 2,
  },
  statLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 11,
    color: ink.muted,
  },
  statValue: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.xs,
    color: ink.primary,
  },
});
