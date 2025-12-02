import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants';


const FormField = ({title, value, placeHolder, handleChangeText, otherStyles, ...props }) => {
  const [showPassword, setshowPassword] = useState(false)

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-black-200 font-pmedium">{title}</Text>
      <View className="border-2 border-black-200 w-full h-16 px-4 bg-gray-50 rounded-2xl  items-center flex-row">
        <TextInput
        className="flex-1 text-black font-psemibold text-base focus:border-secondary"
        value={value}
        placeholder={placeHolder}
        placeholderTextColor='#7b7b8b'
        onChangeText={handleChangeText}
        secureTextEntry={title==='Password' && !showPassword}
        />
        {title ==='Password' &&(
          <TouchableOpacity onPress={() =>setshowPassword(!showPassword)}>
            <Image source={!showPassword ? icons.eye : icons.eyehide} className="w-6 h-6" resizeMode='contain'/>
          </TouchableOpacity>
        )}

       
        </View>

    </View>
  )
}

export default FormField