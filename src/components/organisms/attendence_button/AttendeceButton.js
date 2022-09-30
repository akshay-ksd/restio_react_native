import React from "react";
import {View,Text} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import Button from "../../atom/Button";
import style from "./Style"
class AttendanceButton extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            activeButton:0
        }
    }

    changeAction=(id)=>{
        setTimeout(()=>{this.setState({activeButton:id})},10)
        this.props.changeAction(id)
    }

    render(){
        const {activeButton} = this.state
        return(
            <View style={style.container}>
                 <Button 
                    buttonStyle = {[style.box,{borderColor:activeButton == 0?color.primary:color.white}]}
                    onPress = {()=>this.changeAction(0)}
                    disabled = {false}
                    textStyle = {style.boxText}
                    text = {"Attendance"}
                    iconShow = {false}
                />    
                <Button 
                    buttonStyle = {[style.box,{borderColor:activeButton == 1?color.primary:color.white}]}
                    onPress = {()=>this.changeAction(1)}
                    disabled = {false}
                    textStyle = {style.boxText}
                    text = {"Report"}
                    iconShow = {false}
                />    
            </View>
        )
    }
}

export default AttendanceButton;