import React from 'react';
import Constants from 'expo-constants';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

function Screen({ children, style }) {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.screen]}>
        <View style={[styles.view, style, { backgroundColor: theme.colors.primaryContainer }]}>
            {children}
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    // backgroundColor: "yellow"
  },
  view: {
    flex: 1
  }
});

export default Screen;