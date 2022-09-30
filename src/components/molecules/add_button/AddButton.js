import React from "react";
import {View,Text, TouchableOpacity} from "react-native";
import style from "./Style";
import Button from "../../atom/Button";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import Icons from "../../atom/Icon";
import NumericInput from 'react-native-numeric-input'

const AddButton =(props)=>{

    const [count,setcount] = React.useState(props.count)

    const addProduct =()=>{
        setcount(1)
        props.value(1)
    }

    const increment =()=>{
        setcount(count+1)
        props.value(count+1)
    }

    const decrement =()=>{
        setcount(count-1)
        props.value(count-1)
    }

    const decrementToZero =()=>{
        setcount(0)
        props.value(0)
    }

    const onChange=(value)=>{
        setcount(value)
        props.value(value)
    }

    return(
        <View style={style.container}>
           
              <NumericInput 
                value={count} 
                onChange={value => onChange(value)} 
                totalWidth={font.headerHeight*1.5} 
                totalHeight={font.headerHeight/1.5} 
                iconSize={25}
                step={1}
                valueType='integer'
                rounded 
                textColor={count == 0 ?color.borderColor:color.white}
                iconStyle={{ color: color.secondary }} 
                type={"up-down"}
                minValue={0}
                containerStyle={{backgroundColor:count == 0 ? color.white:color.secondary}}
            />
        </View>
    )

};

export default AddButton;