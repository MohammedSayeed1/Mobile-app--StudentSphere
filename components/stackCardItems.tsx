import {ImageBackground, StyleSheet, Text, View} from "react-native";
import React from "react";
import card1 from "../assets/images/diarycover.jpg";

const StackCardItems = ()=>{
    return(
        <View style={style.animatedView}>
           <ImageBackground style= {style.imageStyle} source={card1}>
            <View style={style.imageView}>
                <View style= {style.imageTextView}>
                    <Text style={style.imageText}>
                        Hello
                    </Text>
                </View>
            </View>
           </ImageBackground>
        </View>
    );
};

export default StackCardItems;

 const style = StyleSheet.create({
    animatedView:{
        width:250,
        height:350
    },
    imageView:{
        flex:1,
        justifyContent:"flex-end",
    },
    imageTextView:{
        paddingHorizontal:12,
        paddingVertical:10
    },
    imageText:{
        color:"white",
        fontSize:20,
        fontWeight:700
    },
    imageStyle:{
        width:"100%",
        height:"100%",
        overflow:"hidden",
        borderRadius:12,
        objectFit:"contain"
    }
 })