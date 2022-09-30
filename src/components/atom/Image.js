import React from "react";
import { Image } from "react-native";

class Images extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <Image style = {this.props.style}
                   source = {{uri:this.props.url}}/>
        )
    }
}

export default Images