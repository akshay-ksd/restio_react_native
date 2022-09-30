import React from "react";
import {View,Text} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import Button from "../../atom/Button";
import style from "./Style";

class PressentButton extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            pressent:this.props.isPresent
        }
    }

    changeAction=(status)=>{
        this.setState({pressent:status})
        this.props.pressent(status)
    }

    render(){
        const {pressent} = this.state
        return(
            <>
            {
                pressent ?
                <Button 
                    buttonStyle = {style.pressent}
                    onPress = {()=>this.changeAction(false)}
                    disabled = {this.props.index == this.props.loadingIndex?true:false}
                    textStyle = {style.presentText}
                    text = {0}
                    iconShow = {true}
                    iconName = {this.props.index == this.props.loadingIndex?"reload":"checkmark"}
                    iconSize = {font.size.font16}
                    iconColor = {color.green}
                    iconStyle = {style.iconStyle}
                />    
                :
                <Button 
                    buttonStyle = {style.pContainer}
                    onPress = {()=>this.changeAction(true)}
                    disabled = {this.props.index == this.props.loadingIndex?true:false}
                    textStyle = {style.pText}
                    text = {this.props.index == this.props.loadingIndex?0:"Pressent"}
                    iconShow = {this.props.index == this.props.loadingIndex?true:false}
                    iconName = {"reload"}
                    iconSize = {font.size.font16}
                    iconColor = {color.white}
                    iconStyle = {style.iconStyle}
                />    
            }
                
            </>          
        )
    }
}

export default PressentButton