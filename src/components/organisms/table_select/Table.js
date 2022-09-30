import React from "react";
import {View,Text,FlatList, TouchableOpacity,ActivityIndicator} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Realm from "realm";

class Table extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loadData:false,
            tableList:[],
            channel:""
        }
    }

    componentDidMount(){
        if(this.props.edit == false){
            this.connectSocket()
        }else{
            this.setState({tableList:this.props.tableList,loadData:true})
        }
    }

    connectSocket=()=>{
        const phxChannel = global.socket.channel('table:' + global.rtoken)
        phxChannel.join().receive('ok',response => {
            this.setState({channel:phxChannel})
            let data = {
                restaurentId:global.rtoken,
            }   
            phxChannel.push("getTabledetails",{data: data})
        })

        phxChannel.on('getTabledetails',data => {
           this.setState({tableList:data.tableDetails,loadData:true})
        })
    }

    selectTable=(count,id)=>{
        this.props.loadCount(count,this.props.edit,id)
    }

    componentWillUnmount(){
        if(this.props.edit == false){
                this.state.channel.leave()
        }
    }

    renderItem = ({ item,index }) => (
        <TouchableOpacity style={style.box} disabled = {this.props.disabled}
                          onPress={()=>this.selectTable(item.name,item.id)}>
            <Text style={style.tableTextName}><Text style={style.tableText}>{item.name}</Text></Text>
        </TouchableOpacity>
    )


    render(){
        const {loadData} = this.state
        return(
            <View style={style.container}>
                {
                    loadData ?
                        <>
                            <FlatList
                                data={this.state.tableList}
                                renderItem={this.renderItem}
                                keyExtractor={item => item.id}
                                numColumns={3}
                            />
                        </>
                   :
                   <View style={style.loaderView}>
                       <ActivityIndicator size={font.size.font12} color={color.secondary}/>
                   </View>
                }
            </View>
        )
    }
}

export default Table