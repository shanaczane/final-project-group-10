import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { createStyles } from './signupscreen.style';

interface Props {
  onNavigateToLogin: () => void;
}

export function SignupScreen({ onNavigateToLogin }: Props) {
  const { signUp } = useAuth();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const passwordValid = hasMinLength && hasSpecialChar;
  const showHints = password.length > 0;

  async function handleSignup(): Promise<void> {
    if (!email.trim() || !password.trim() || !storeName.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (!passwordValid) {
      Alert.alert('Weak Password', 'Password must be at least 8 characters and include a special character (e.g. @, #, $).');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email.trim(), password, storeName.trim());
    setLoading(false);

    if (error) {
      Alert.alert('Signup Failed', error);
    } else {
      Alert.alert(
        'Account Created',
        'Your account has been created. You can now sign in.',
        [{ text: 'OK', onPress: onNavigateToLogin }]
      );
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.appTitle}>Imbentaryo</Text>
        <Text style={styles.subtitle}>Create your owner account</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Store Name</Text>
          <TextInput
            style={styles.input}
            placeholder="My Store"
            placeholderTextColor={colors.textMuted}
            value={storeName}
            onChangeText={setStoreName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <Pressable
              style={styles.eyeButton}
              onPress={() => setShowPassword((prev) => !prev)}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.textMuted}
              />
            </Pressable>
          </View>

          {showHints && (
            <View style={styles.hintsContainer}>
              <View style={styles.hintRow}>
                <Ionicons
                  name={hasMinLength ? 'checkmark-circle' : 'ellipse-outline'}
                  size={14}
                  color={hasMinLength ? colors.success : colors.textMuted}
                />
                <Text style={[styles.hintText, hasMinLength && styles.hintMet]}>
                  At least 8 characters
                </Text>
              </View>
              <View style={styles.hintRow}>
                <Ionicons
                  name={hasSpecialChar ? 'checkmark-circle' : 'ellipse-outline'}
                  size={14}
                  color={hasSpecialChar ? colors.success : colors.textMuted}
                />
                <Text style={[styles.hintText, hasSpecialChar && styles.hintMet]}>
                  At least 1 special character (e.g. @, #, $)
                </Text>
              </View>
            </View>
          )}

          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <Pressable
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword((prev) => !prev)}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.textMuted}
              />
            </Pressable>
          </View>

          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </Pressable>
        </View>

        <Pressable onPress={onNavigateToLogin} style={styles.linkRow}>
          <Text style={styles.linkText}>
            Already have an account?{' '}
            <Text style={styles.link}>Sign in</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
