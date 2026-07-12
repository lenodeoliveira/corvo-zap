import { Link, router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';
import { authService } from '@/services/auth.service';
import { Spacing } from '@/theme';

export default function RegisterScreen() {
  const theme = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cityId, setCityId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      await authService.register({ name, email, password, confirmPassword, cityId });
      router.replace('/(auth)/login');
    } catch {
      setError('Não foi possível criar a conta. Verifique os dados informados.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={[styles.title, { color: theme.text }]}>Criar conta</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Escolha sua cidade de origem para o corvo partir de lá.
          </Text>

          <View style={styles.form}>
            {(['name', 'email', 'password', 'confirmPassword', 'cityId'] as const).map((field) => {
              const labels: Record<typeof field, string> = {
                name: 'Nome',
                email: 'Email',
                password: 'Senha',
                confirmPassword: 'Confirmar senha',
                cityId: 'ID da cidade',
              };

              const values = { name, email, password, confirmPassword, cityId };
              const setters = { name: setName, email: setEmail, password: setPassword, confirmPassword: setConfirmPassword, cityId: setCityId };

              return (
                <TextInput
                  key={field}
                  autoCapitalize={field === 'email' ? 'none' : 'sentences'}
                  keyboardType={field === 'email' ? 'email-address' : 'default'}
                  placeholder={labels[field]}
                  placeholderTextColor={theme.textSecondary}
                  secureTextEntry={field === 'password' || field === 'confirmPassword'}
                  style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundElement }]}
                  value={values[field]}
                  onChangeText={setters[field]}
                />
              );
            })}

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              disabled={loading}
              onPress={handleRegister}
              style={[styles.button, { backgroundColor: theme.primary }]}>
              {loading ? (
                <ActivityIndicator color={theme.background} />
              ) : (
                <Text style={[styles.buttonText, { color: theme.background }]}>Cadastrar</Text>
              )}
            </Pressable>
          </View>

          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text style={[styles.link, { color: theme.textSecondary }]}>
                Já tem conta? <Text style={{ color: theme.primary }}>Entrar</Text>
              </Text>
            </Pressable>
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  form: {
    gap: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    fontSize: 16,
  },
  button: {
    borderRadius: 12,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#c0392b',
    textAlign: 'center',
  },
  link: {
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
