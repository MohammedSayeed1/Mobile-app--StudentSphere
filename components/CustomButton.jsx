import { TouchableOpacity, Text } from 'react-native';
import React from 'react';

const CustomButton = ({ title, handlePress, containerStyles }) => {
  return (
    <TouchableOpacity 
      onPress={handlePress}
      className={`bg-secondary rounded-xl min-h-[60px] justify-center items-center mt-4 ${containerStyles}`}
    >
      <Text className="text-white font-psemibold text-lg">{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
