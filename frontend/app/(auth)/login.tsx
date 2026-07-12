import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthButton } from '@/components/auth/auth-button';
import { AuthHeader } from '@/components/auth/auth-header';
import { AuthInput } from '@/components/auth/auth-input';
import { AuthScreenLayout } from '@/components/auth/auth-screen-layout';
import { DividerWithText } from '@/components/auth/divider-with-text';
import { SocialAuthButton } from '@/components/auth/social-auth-button';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth-store';
import { theme } from '@/theme';

export default function LoginScreen() {
  const setSession = useAuthStore((state) => state.setSession);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError(null);
    setLoading(true);

    try {
      const response = await authService.login({ email, password });

      if (!response) {
        setError('Credenciais inválidas');
        return;
      }

      setSession(response);
      router.replace('/(tabs)/chats');
    } catch {
      setError('Não foi possível entrar. Verifique email e senha.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <StatusBar style="light" />
      <AuthScreenLayout>
        <AuthHeader />

        <View style={styles.form}>
          <AuthInput
            autoCapitalize="none"
            icon="mail"
            keyboardType="email-address"
            label="E-mail"
            placeholder="Digite seu e-mail"
            value={email}
            onChangeText={setEmail}
          />

          <AuthInput
            icon="lock"
            label="Senha"
            placeholder="Digite sua senha"
            showPasswordToggle
            isPasswordVisible={isPasswordVisible}
            value={password}
            onChangeText={setPassword}
            onTogglePassword={() => setIsPasswordVisible((current) => !current)}
          />

          <Pressable style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
          </Pressable>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <AuthButton icon="feather" label="Entrar" loading={loading} onPress={handleLogin} />

          <DividerWithText label="ou continue com" />

          <View style={styles.socialRow}>
            <SocialAuthButton provider="google" />
            <SocialAuthButton provider="apple" />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Ainda não tem conta? </Text>
          <Link href="/(auth)/register" asChild>
            <Pressable>
              <Text style={styles.footerLink}>Criar conta</Text>
            </Pressable>
          </Link>
        </View>
      </AuthScreenLayout>
    </>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: theme.spacing.md,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -theme.spacing.xs,
  },
  forgotPasswordText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
  },
  error: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.error,
    textAlign: 'center',
  },
  socialRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  footerLink: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
  },
});
