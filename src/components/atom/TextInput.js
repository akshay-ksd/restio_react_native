import React from "react";
import { TextInput,View} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
 
class Textinput extends React.Component{
    constructor(props){
        super(props);
        this.state = {
         text:this.props.value
        }
    }

    onChangeText=(text)=>{
      this.setState({text:text})
      this.props.load_data(text,this.props.type)
    }

    render(){
        return(
            <View style = {this.props.inputViewStyle}>
                {
                    this.props.iconShow == true ?
                        <Icon name={this.props.iconName} 
                        size={this.props.iconSize} 
                        color={this.props.iconColor}
                        style = {this.props.iconStyle}/>:null
                }
                
                <TextInput 
                    style = {this.props.inputStyle}
                    value = {this.props.value}
                    onChangeText = {(text)=>this.onChangeText(text)}
                    placeholder = {this.props.placeHolder}
                    keyboardType = {this.props.keyboardType}
                    secureTextEntry = {this.props.secureTextEntry}
                    maxLength = {this.props.maxLength}
                    autoFocus = {this.props.autoFocus}
                    multiline = {this.props.multiline}
                />
            </View>
        )
    }
}

export default Textinput