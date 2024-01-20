import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

function AppAlert({ message }) {
    const [visible, setVisible] = useState(true);

    const hideDialog = () => setVisible(false);
    
    return (
        <View style={styles.container}>
          <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
              <Dialog.Title>Alert</Dialog.Title>
              <Dialog.Content>
                <Text variant="bodyMedium">{message}</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={hideDialog}>Ok</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        zIndex: 1,
        flex: 1
    }
});

export default AppAlert;