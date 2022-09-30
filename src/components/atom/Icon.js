import React from "react";
import Icon from 'react-native-vector-icons/Ionicons';

function Icons(props){

    return(
        <Icon name={props.iconName} 
                size={props.iconSize} 
                color={props.iconColor}
                style = {props.iconStyle}/> 
    )
    
}

export default Icons;