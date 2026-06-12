import { useSignIn } from '@clerk/expo';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

/**
 * Renders the sign-in screen, collecting email and password and handling Clerk authentication and post-sign-in navigation.
 *
 * Uses Clerk's sign-in flow to submit credentials, trigger email-based MFA when required, verify MFA codes, and navigate to the app root on successful sign-in.
 *
 * @returns The React element for the sign-in UI.
 */
export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');

  const handleSubmit = async () => {
    const { error } = await signIn.password({
      emailAddress,
      password,
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }

          const url = decorateUrl('/');
          router.push(url);
        },
      });
    } else if (signIn.status === 'needs_client_trust') {
      await signIn.mfa.sendEmailCode();
    } else if (signIn.status === 'needs_second_factor') {
      // Add second-factor handling if needed.
    } else {
      console.error('Sign-in attempt not complete:', signIn);
    }
  };

  const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }

          const url = decorateUrl('/');
          router.push(url);
        },
      });
    } else {
      console.error('Sign-in attempt not complete:', signIn);
    }
  };

  const isDisabled = !emailAddress || !password || fetchStatus === 'fetching';

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoMark}>R</Text>
            </View>
            <View style={styles.brandInfo}>
              <Text style={styles.brandTitle}>Recurrly</Text>
              <Text style={styles.brandSubtitle}>SMART BILLING</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.heading}>Welcome back</Text>
            <Text style={styles.subheading}>Sign in to continue managing subscriptions.</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email</Text>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Enter your email"
                placeholderTextColor="#9A9A9A"
                onChangeText={setEmailAddress}
                keyboardType="email-address"
              />
              {errors.fields.identifier && <Text style={styles.error}>{errors.fields.identifier.message}</Text>}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                placeholder="Enter your password"
                placeholderTextColor="#9A9A9A"
                secureTextEntry
                onChangeText={setPassword}
              />
              {errors.fields.password && <Text style={styles.error}>{errors.fields.password.message}</Text>}
            </View>

            <Pressable
              style={({ pressed }) => [styles.button, isDisabled && styles.buttonDisabled, pressed && styles.buttonPressed]}
              onPress={handleSubmit}
              disabled={isDisabled}
            >
              <Text style={styles.buttonText}>Sign in</Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              New to Recurrly?{' '}
              <Text style={styles.footerLink} onPress={() => router.push('/(auth)/sign-up')}>
                Create an account
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: '#FBF5ED',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    height: 52,
    width: 52,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#F27A4C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  logoMark: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  brandInfo: {
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
  },
  brandSubtitle: {
    color: '#6B7280',
    letterSpacing: 1.2,
    marginTop: 4,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 36,
    padding: 34,
    borderWidth: 1,
    borderColor: '#F4F5F7',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  heading: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 15,
    lineHeight: 24,
    color: '#6B7280',
    marginBottom: 30,
    textAlign: 'center',
  },
  fieldGroup: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 18,
    paddingVertical: 18,
    fontSize: 16,
    color: '#111827',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  button: {
    marginTop: 28,
    borderRadius: 20,
    backgroundColor: '#F27A4C',
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
  },
  footerLink: {
    color: '#F27A4C',
    fontWeight: '800',
  },
  error: {
    marginTop: 8,
    color: '#DC2626',
    fontSize: 12,
    lineHeight: 18,
  },
  debug: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 14,
    lineHeight: 18,
  },
});