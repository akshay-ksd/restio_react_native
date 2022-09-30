import React from "react";
import {View,Text} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";

class RestaurentName extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loadData:false,
            name:null,
            schema:null
        }
    }

    componentDidMount(){
        setTimeout(()=>{this.setState({loadData:true})},50)
        this.getRestaurentDataLocally()
    }

    getRestaurentDataLocally=async()=>{
        let schema = {
            name:"rest_details",
            properties:{
               name:"string",
               image_url:"string"
            }
        };

        const realm = await Realm.open({
            path: "rest_details",
            schema: [schema]
        })
        this.setState({schema:realm})
        let data = realm.objects("rest_details")

        if(data.length == 0){
            this.get_rest_data()
        }else{
            this.setState({name:data[0].name})
        }
    }

    get_rest_data(){
        fetch(global.url+'api/getRestaurentDetails',{
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token:global.rtoken
            })
        }).then(res => res.json())
            .then(async(res) => {
                let task1;
                this.state.schema.write(() => {
                    task1 = this.state.schema.create("rest_details", {
                                name:res.name,
                                image_url:"null"
                            })
                })
                this.setState({name:res.name})
            })
    }

    render(){
        const {name,loadData} = this.state
        return(
            <>
            {
                loadData && (
                    <View style={style.container}>
                        <Text style={style.nameText}>{name}</Text>
                    </View>
                )
            }
            </>          
        )
    }
}

export default RestaurentName