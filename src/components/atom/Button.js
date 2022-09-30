import React from "react";
import { TouchableOpacity,Text, ActivityIndicator} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

class Button extends React.Component{
    constructor(props){
        super(props);
        this.state = {
         text:""
        }
    }

    onPress=()=>{
      this.props.onPress
    }

    render(){
        const {color1,color2,color3} = this.props
        return(
            <>
                {
                    this.props.gradient == true?
                    <TouchableOpacity onPress = {this.props.onPress}
                                      disabled = {this.props.disabled}>
                        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={[color1,color2,color3]} style={this.props.buttonStyle}>
                                {
                                this.props.iconShow == true ?
                                    <Icon name={this.props.iconName} 
                                    size={this.props.iconSize} 
                                    color={this.props.iconColor}
                                    style = {this.props.iconStyle}/>:null
                                }
                                {
                                this.props.text.length !== 0 ?
                                <Text style={this.props.textStyle}>{this.props.text}</Text>:null
                                }
                        </LinearGradient>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={this.props.buttonStyle} 
                    onPress = {this.props.onPress}
                    disabled = {this.props.disabled}>
                    {
                        this.props.iconShow == true ?
                            <Icon name={this.props.iconName} 
                            size={this.props.iconSize} 
                            color={this.props.iconColor}
                            style = {this.props.iconStyle}/>:null
                    }
                    {
                        this.props.loader == true ?
                        <ActivityIndicator size={this.props.loaderSize} color={this.props.loaderColor}/>
                        :null
                    }
                    {
                        this.props.text !== 0 ?
                        <Text style={this.props.textStyle}>{this.props.text}</Text>:null
                    }
                    
                    </TouchableOpacity>
                  
                }
               
            </>
           
        )
    }
}

export default Button