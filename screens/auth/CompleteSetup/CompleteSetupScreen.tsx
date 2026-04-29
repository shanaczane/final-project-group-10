import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';

export function CompleteSetupScreen() {
  const { updateStoreName } = useAuth();
  const { colors } = useTheme();
  const [storeName, setStoreName] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleContinue(): Promise<void> {
    if (!storeName.trim()) {
      Alert.alert('Required', 'Please enter your store name.');
      return;
    }
    setLoading(true);
    const { error } = await updateStoreName(storeName.trim());
    setLoading(false);
    if (error) Alert.alert('Error', error);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
        <Text style={{
          fontSize: 32,
          fontFamily: 'Manrope_700Bold',
          color: colors.primary,
          textAlign: 'center',
          marginBottom: 8,
        }}>
          Tally
        </Text>
        <Text style={{
          fontSize: 16,
          color: colors.textSecondary,
          textAlign: 'center',
          marginBottom: 40,
        }}>
          One last step — name your store
        </Text>

        <View style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 24,
        }}>
          <Text style={{
            fontSize: 14,
            fontFamily: 'Manrope_600SemiBold',
            color: colors.labelText,
            marginBottom: 6,
          }}>
            Store Name
          </Text>
          <View style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
            backgroundColor: colors.inputBackground,
          }}>
            <TextInput
              style={{
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 15,
                color: colors.textPrimary,
              }}
              placeholder="My Store"
              placeholderTextColor={colors.textMuted}
              value={storeName}
              onChangeText={setStoreName}
              autoCapitalize="words"
              autoFocus
              onSubmitEditing={handleContinue}
            />
          </View>

          <Pressable
            style={{
              backgroundColor: colors.primary,
              borderRadius: 10,
              paddingVertical: 14,
              alignItems: 'center',
              marginTop: 24,
              opacity: loading ? 0.6 : 1,
            }}
            onPress={handleContinue}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'Manrope_600SemiBold' }}>Continue</Text>
            }
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
