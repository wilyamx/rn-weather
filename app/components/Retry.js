import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

function Retry({ message, onRetry }) {
    const [visible, setVisible] = useState(true);

    const hideDialog = () => setVisible(false);
    const onRetryHandler = () => {
        setVisible(false);
        onRetry();
    };

    return (
        <View style={styles.container}>
          <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
              <Dialog.Title>Error</Dialog.Title>
              <Dialog.Content>
                <Text variant="bodyMedium">{message}</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={hideDialog}>Cancel</Button>
                <Button onPress={onRetryHandler}>Retry</Button>
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

export default Retry;