import React from "react";
import {View,Text,Dimensions,ActivityIndicator,Keyboard} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Heder from "../../molecules/custom_heder/Heder";
import Textinput from "../../atom/TextInput";
import Button from "../../atom/Button";
import Realm from "realm";
import {shatoken} from "../../../global_functions/shaToken/shaToken"
import { toast } from "../../../global_functions/toast_message/Toast";
import TableList from "../../organisms/table_select/Table";


const {width,height} = Dimensions.get("window")

class Table extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loadData:false,
            count:0,
            loader:false,
            channel:null,
            loadTable:false,
            tableText:'',
            tableList:[],
            isEdit:false,
            selectedId:"",
            textInputFocus:true
        }
        
    }

    componentDidMount(){
        setTimeout(()=>{this.setState({loadData:true})},50)
        this.connectSocket()
        this.getTableCount()
    }

    getTableCount=async()=>{
        let schema = {
            name: "table",
            properties: {
                tableCount:"int"
            }
        };

        const realm = await Realm.open({
            path: "table",
            schema: [schema],
        });

        let tableData = realm.objects("table")

        if(tableData.length == 0){
            this.setState({count:0})
        }else{
            this.setState({count:tableData[0].tableCount})
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
            this.setState({tableList:data.tableDetails,loadTable:false,loader:false})
            setTimeout(()=>{this.setState({loadTable:true})},10)
         })
    }

    loadText=(tableText)=>{
        this.setState({tableText:tableText})
    }

    addtableDetails=()=>{
        this.setState({loader:true})

        let data = {
            restaurentId:global.rtoken,
            name:this.state.tableText
        }

        this.state.channel.push("addTable",{data: data})
        .receive("ok", (msg) =>  this.updateCount(data))
        .receive("error", (reasons) => toast("Check your internet connection"))
        .receive("timeout", () => toast("Check your internet connection"))
    }

    updateCount=async()=>{
            let data = {
                restaurentId:global.rtoken,
            }   
            this.state.channel.push("getTabledetails",{data: data})
            toast("Table Details added")
            this.setState({tableText:""})
            Keyboard.dismiss()
    }

    edit=(details,edit,id)=>{
        if(edit == true){
                this.setState({textInputFocus:false,tableText:details,isEdit:true,selectedId:id})
                setTimeout(()=>{this.setState({textInputFocus:true})},100)
        }
    }

    updateDetails=()=>{
        let data = {
            restaurentId:global.rtoken,
            id:this.state.selectedId,
            name:this.state.tableText
        }  
        
        this.state.channel.push("updateDetails",{data: data})
        .receive("ok", (msg) =>  this.updateTableDetails(data))
        .receive("error", (reasons) => toast("Check your internet connection"))
        .receive("timeout", () => toast("Check your internet connection"))
    }

    updateTableDetails=(data)=>{
        Keyboard.dismiss()
        let index = this.state.tableList.findIndex(x=>x.id == data.id)
        toast(`${this.state.tableList[index].name} updated to ${data.name}`)
        this.state.tableList[index].name = data.name
        this.setState({tableList:this.state.tableList,tableText:"",isEdit:false})
    }

    deleteDetails=()=>{
        let data = {
            restaurentId:global.rtoken,
            id:this.state.selectedId,
        }  
        
        this.state.channel.push("deleteDetails",{data: data})
        .receive("ok", (msg) =>  this.deleteDetailsUpdate(data))
        .receive("error", (reasons) => toast("Check your internet connection"))
        .receive("timeout", () => toast("Check your internet connection"))
    }

    deleteDetailsUpdate=(data)=>{
        Keyboard.dismiss()
        let index = this.state.tableList.findIndex(x=>x.id == data.id)
        toast(`${this.state.tableList[index].name} deleted`)
        this.state.tableList.splice(index,1)
        this.setState({tableList:this.state.tableList,tableText:"",isEdit:false})
    }

    componentWillUnmount(){
        this.state.channel.leave()
    }



    render(){
        const {loadData,count,loader,tableText,loadTable,tableList,isEdit,textInputFocus} = this.state
        return(
            <View style={style.container}>
                <Heder headerName={"Add Table Details"}/>
                {
                    loadData && (
                        <>

                            <View style={style.inputView}>
                                {
                                    textInputFocus && (
                                        <Textinput inputViewStyle={style.inputViewStyle}
                                            ref={this.inputRef}
                                           inputStyle={style.inputStyle}
                                           value={tableText}
                                           placeholder={"Enter table details"}
                                           autoFocus={true}
                                           load_data={this.loadText}/>
                                    )
                                }
                                
                            </View>

                            <View style={style.updateButtonView}>
                                {
                                    isEdit ? 
                                    <View style={style.editView}>
                                        <Button 
                                            buttonStyle = {[style.updateButton,{width:loader ? font.headerHeight-5:width-font.headerHeight*6,backgroundColor:color.white}]}
                                            onPress = {()=>this.deleteDetails()}
                                            disabled = {false}
                                            textStyle = {[style.buttonText,{color:color.secondary}]}
                                            text = {loader?0:"DELETE"}
                                            iconShow = {loader}
                                            iconName = {"reload"}
                                            iconSize = {font.size.font16}
                                            iconColor = {color.white}
                                            style = {style.iconStyle}
                                        />
                                         <Button 
                                            buttonStyle = {[style.updateButton,{width:loader ? font.headerHeight-5:width-font.headerHeight*4}]}
                                            onPress = {()=>this.updateDetails()}
                                            disabled = {false}
                                            textStyle = {style.buttonText}
                                            text = {loader?0:"UPDATE"}
                                            iconShow = {loader}
                                            iconName = {"reload"}
                                            iconSize = {font.size.font16}
                                            iconColor = {color.white}
                                            style = {style.iconStyle}
                                        />
                                    </View>
                                   
                                    :
                                    <Button 
                                        buttonStyle = {[style.updateButton,{width:loader ? font.headerHeight-5:width-font.headerHeight*4}]}
                                        onPress = {()=>this.addtableDetails()}
                                        disabled = {false}
                                        textStyle = {style.buttonText}
                                        text = {loader?0:"ADD"}
                                        iconShow = {loader}
                                        iconName = {"reload"}
                                        iconSize = {font.size.font16}
                                        iconColor = {color.white}
                                        style = {style.iconStyle}
                                    />
                                }
                                {/* {
                                    count !== 0?
                                    <Button 
                                        buttonStyle = {[style.updateButton,{width:loader ? font.headerHeight-5:width-font.headerHeight*4}]}
                                        onPress = {()=>this.addtableDetails()}
                                        disabled = {false}
                                        textStyle = {style.buttonText}
                                        text = {loader?0:"ADD"}
                                        iconShow = {loader}
                                        iconName = {"reload"}
                                        iconSize = {font.size.font16}
                                        iconColor = {color.white}
                                        style = {style.iconStyle}
                                    />
                                    :null
                                } */}
                                 
                            </View>
                            {
                                loadTable ?
                                    <TableList disabled = {false}
                                               tableList = {tableList}
                                               edit={true}
                                               loadCount={this.edit}/>
                                :
                                <View style={style.indicatorView}>
                                    <ActivityIndicator size={font.size.font12} color={color.secondary}/>
                                </View>
                            }
                        </>
                    )
                }
            </View>
        )
    }
}

export default Table;