import React from "react";
import {View,Text}from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import moment from "moment";

class DayWish extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            wish:""
        }
    }

    componentDidMount(){
        this.loadDay()
    }

    loadDay =async()=>{
        let time = moment().format('h')
        let day = moment().format('a')
        if(day == "am"){
            this.setState({wish:"Good morning"})
        }else if(day == "pm"){
            if(1 <= time || 5 >= time){
                this.setState({wish:"Good afternoon"})
            }else if(5 <= time || 12 >= time){
                this.setState({wish:"Good evening"})
            }
        }
    }

    render(){
        const {wish} = this.state
        return(
            <View style={style.container}>
                <Text style={style.text1}>Hello {global.name} {wish} ..</Text>
                {/* <Text style={style.text}>{wish}</Text> */}
            </View>
        )
    }
}

export default DayWish