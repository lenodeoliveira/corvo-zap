import Feather from '@expo/vector-icons/Feather';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/theme';
import type { MessageTracking } from '@/types/api';
import {
  formatArrivalLabel,
  formatRemainingTime,
  getDistanceProgress,
} from '@/utils/format-message';

type TravelingCardProps = {
  tracking: MessageTracking;
  departureAt: string;
};

export function TravelingCard({ tracking, departureAt }: TravelingCardProps) {
  const { traveledKm, totalKm } = getDistanceProgress(tracking);

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <Text style={styles.title}>
          Você está prestes a receber um corvo, aguarde ele chegar
        </Text>

        <View style={styles.illustration}>
          <Feather
            name="feather"
            size={42}
            color={theme.colors.black}
            style={styles.ravenIcon}
          />
          <View style={styles.letter}>
            <Feather name="mail" size={14} color={theme.colors.error} />
          </View>
        </View>

        <View style={styles.progressHeader}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${tracking.progress}%` }]} />
          </View>
          <Text style={styles.progressValue}>{tracking.progress}%</Text>
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
            <Text style={styles.statValue}>{formatRemainingTime(tracking.remainingMinutes)}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Tempo estimado</Text>
            <Text style={styles.statValue}>{formatArrivalLabel(departureAt)}</Text>
          </View>

          <View style={styles.stat}>
            <Text style={styles.statLabel}>Chegada prevista</Text>
            <Text style={styles.statValue}>{formatArrivalLabel(tracking.arrivalAt)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  card: {
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.secondary,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  title: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.black,
    textAlign: 'center',
  },
  illustration: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 88,
  },
  ravenIcon: {
    transform: [{ rotate: '-20deg' }],
  },
  letter: {
    position: 'absolute',
    right: '36%',
    top: 28,
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primaryDark,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.success,
  },
  progressValue: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.black,
    minWidth: 40,
    textAlign: 'right',
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  stat: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  statLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xs,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  statValue: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.black,
  },
});
