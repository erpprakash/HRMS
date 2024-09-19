// ColorPicker.js
import React from 'react';
import { View, TouchableOpacity } from 'react-native';

const colors = ['#FF5733', '#33FF57', '#3357FF', '#F4FF33', '#FF33F6', '#33FFF4'];

const ColorPicker = ({ onColorSelect }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 5 }}>
      {colors.map((color) => (
        <TouchableOpacity
          key={color}
          onPress={() => onColorSelect(color)}
          style={{ width: 20, height: 20, backgroundColor: color, borderRadius: 5, margin: 4 }}
        />
      ))}
    </View>
  );
};

export default ColorPicker;
