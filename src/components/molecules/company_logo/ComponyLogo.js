import React from "react";
import {View,Text} from 'react-native';
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";

const CompanyLogo =()=>{
    return(
        <View style={style.container}>
            <Text style={style.headingText}>Powered By</Text>
            <Text style={style.logoText}>TYZO TECHNOLOGIES</Text>
        </View>
    )
}

export default CompanyLogo