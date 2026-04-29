import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/auth/Login/LoginScreen';
import { SignupScreen } from '../screens/auth/Signup/SignupScreen';
import { OwnerNavigator } from './OwnerNavigator';
import { HelperNavigator } from './HelperNavigator';
import { CompleteSetupScreen } from '../screens/auth/CompleteSetup/CompleteSetupScreen';

export function RootNavigator() {
  const { session, user, loading } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!session) {
    if (showSignup) {
      return <SignupScreen onNavigateToLogin={() => setShowSignup(false)} />;
    }
    return <LoginScreen onNavigateToSignup={() => setShowSignup(true)} />;
  }

  if (user?.role === 'helper') {
    return <HelperNavigator />;
  }

  if (!user?.store_name) {
    return <CompleteSetupScreen />;
  }

  return <OwnerNavigator />;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
});
