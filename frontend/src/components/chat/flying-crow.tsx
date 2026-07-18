import { Image } from 'expo-image';
import { useEffect, useMemo, useState } from 'react';
import { Animated, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

const SPRITE_ASPECT_RATIO = 175 / 187;

export const FLYING_CROW_HEIGHT = 26;
export const FLYING_CROW_WIDTH = Math.round(FLYING_CROW_HEIGHT * SPRITE_ASPECT_RATIO);

const crowFrames = [
  require('@/assets/images/flying-crow-wing-up.png'),
  require('@/assets/images/flying-crow-wing-mid.png'),
  require('@/assets/images/flying-crow-wing-down.png'),
  require('@/assets/images/flying-crow-wing-mid.png'),
] as const;

const FRAME_DURATION_MS = 130;

type FlyingCrowProps = {
  style?: StyleProp<ViewStyle>;
};

export function FlyingCrow({ style }: FlyingCrowProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const bob = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    const wingTimer = setInterval(() => {
      setFrameIndex((current) => (current + 1) % crowFrames.length);
    }, FRAME_DURATION_MS);

    const bobLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: 1,
          duration: 520,
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: 520,
          useNativeDriver: true,
        }),
      ]),
    );

    bobLoop.start();

    return () => {
      clearInterval(wingTimer);
      bobLoop.stop();
    };
  }, [bob]);

  const animatedStyle = {
    transform: [
      {
        translateY: bob.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -3],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.container, style, animatedStyle]}>
      <Image source={crowFrames[frameIndex]} style={styles.sprite} contentFit="contain" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: FLYING_CROW_WIDTH,
    height: FLYING_CROW_HEIGHT,
  },
  sprite: {
    width: FLYING_CROW_WIDTH,
    height: FLYING_CROW_HEIGHT,
  },
});
