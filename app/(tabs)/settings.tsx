import { useAuth } from '@clerk/expo';
import { useRouter } from 'expo-router';
import { styled } from "nativewind";
import React, { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.replace('/(auth)/sign-in');
  }, [router, signOut]);

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-2xl font-semibold mb-6">Settings</Text>
      <View className="mt-4">
        <Pressable
          onPress={handleSignOut}
          className="rounded-2xl bg-red-500 px-5 py-4"
        >
          <Text className="text-white text-base font-bold text-center">Log out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

export default Settings