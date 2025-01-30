import React from 'react';
import { View, StyleSheet } from 'react-native';

const HorizontalLine = () => {
  return (
    <View style={styles.line}></View>
  );
};

const styles = StyleSheet.create({
  line: {
    borderBottomWidth: 0.8,  // Thickness of the line
    borderBottomColor: '#ddd',  // Color of the line
    marginTop: 20,  // Space above and below the line
    marginHorizontal: 4
  }
});

export default HorizontalLine;
