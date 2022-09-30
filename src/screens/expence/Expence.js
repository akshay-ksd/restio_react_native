import React from "react";
import {View,Text, TouchableOpacity,Dimensions, ActivityIndicator, Alert} from "react-native";
import color from "../../theme/colors";
import font from "../../theme/font";
import style from "./Style";
import Header from '../../components/molecules/expence_header/Header'
import ExpenceInput from "../../components/molecules/expence_input/ExpenceInput";
import Button from "../../components/atom/Button"
import Icons from "../../components/atom/Icon";
import Realm from "realm";
import {toast} from "../../global_functions/toast_message/Toast"
import {shatoken} from "../../global_functions/shaToken/shaToken"
import moment from "moment";
import NoInternet from "../../components/templates/no_internet_view/NoInternet";
import NetInfo from "@react-native-community/netinfo";

const {width,height} = Dimensions.get('window')
class Expence extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loadData:false,
            type:this.props.route.params.from == "edit"?this.props.route.params.paymentType.toString():0,
            amount:this.props.route.params.from == "edit"?this.props.route.params.amount.toString():"",
            category:this.props.route.params.from == "edit"?this.props.route.params.category.toString():"",
            channel:null,
            loader:false,
            isConnected:false,
            disable:false
        }
    }

    componentDidMount(){
        this.checkNetInfo()
        setTimeout(() => {
            this.setState({loadData:true})
        },100);
    }

    checkNetInfo =()=>{
        this.unsubscribe = NetInfo.addEventListener(state => {
            if(state.isConnected == true){
                this.setState({isConnected:true})
                this.socketConnect()
            }else{
                this.setState({isConnected:false})
            }
          });
    }

    changeType=(type)=>{
        this.setState({type:type})
    }

    onChange=(type,value)=>{
        if(type == "Amount"){
            this.setState({amount:value})
        }else if(type == "Category"){
            this.setState({category:value})
        }
    }

    addExpence=async()=>{
        if(this.state.isConnected){
            this.setState({loader:true,disable:true})
            var date = new Date().toISOString().slice(0, 10); 
            var month = new Date().getMonth() + 1;
            var year = new Date().getFullYear();
            let sha_data = global.utoken+global.rtoken+moment().format('MMMM Do YYYY, h:mm:ss a')
            let id = await shatoken(sha_data)
    
            let expence = {
                expenceId:id,
                restaurentId:global.rtoken,
                amount:parseInt(this.state.amount),
                category:this.state.category,
                paymentType:this.state.type,
                date:moment().format('MMMM Do YYYY'),
                month:month,
                year:year,
            }
    
            this.state.channel.push('addExpence', { expence: expence})
        }else{
            this.setState({isConnected:false})
        }
       
    }

    async socketConnect(){
        const phxChannel = global.socket.channel('expence:' + global.rtoken)

        phxChannel.join().receive('ok',response => {
            this.setState({channel:phxChannel})
        })

        phxChannel.on('addExpence',expence => {
            this.setState({type:0,amount:"",category:"",loader:false,disable:false})
            this.storeLocalDataBase(expence.expence)
        })

        phxChannel.on('updateExpence',expence => {
            this.setState({type:0,amount:"",category:"",loader:false,disable:false})
            this.updateLocalDataBase(expence.expence)
        })

        phxChannel.on('deleteExpence',expence => {
            this.setState({type:0,amount:"",category:"",loader:false,disable:false})
            this.deleteLocalDataBase(expence.expence)
        })
    }

    storeLocalDataBase=async(data)=>{
        toast("Expence Added")
        

        let schema = {
            name:"expence",
            properties:{
               id:"string",
               amount:"int",
               category:"string",
               paymentType:"int",
               date:"string",
               month:"int",
               year:"int",
            }
        };

        const realm = await Realm.open({
            path: "expence",
            schema: [schema]
        })

        let task1;
            realm.write(() => {
                task1 = realm.create("expence", {
                               id:data.expenceId,
                               amount:data.amount,
                               category:data.category,
                               paymentType:data.paymentType,
                               date:data.date,
                               month:data.month,
                               year:data.year
                        })
            let mdata = {
                uToken: global.utoken,
                rToken: global.rtoken,
                accessid: data.expenceId,
                task: "ADD"
            }
            this.state.channel.push("deleteQue", {data: mdata})
        })
    }

    deleteAlert=()=>{
        Alert.alert(
            "Delete Expence",
            "Are you sure want you delete expence",
            [
              {
                text: "Cancel",
                onPress: () => {},
                style: "cancel"
              },
              { text: "OK", onPress: () => this.delete() }
            ]
          );
    }

    delete=()=>{
        if(this.state.isConnected){
            this.setState({disable:true})
            let expence = {
                expenceId:this.props.route.params.id,
                restaurentId:global.rtoken
            }
    
            this.state.channel.push('deleteExpence', { expence: expence})
        }else{
            this.setState({isConnected:false})
        }
       
    }

    update=()=>{
        if(this.state.isConnected){
            this.setState({disable:true})
            let expence = {
                expenceId:this.props.route.params.id,
                restaurentId:global.rtoken,
                amount:parseInt(this.state.amount),
                category:this.state.category,
                paymentType:parseInt(this.state.type),
            }
    
            this.state.channel.push('updateExpence', { expence: expence})
        }else{
            this.setState({isConnected:false})
        }     
    }

    updateLocalDataBase=async(updateData)=>{
        toast("Expence Updated")

        // let schema = {
        //     name:"expence",
        //     properties:{
        //        id:"string",
        //        amount:"int",
        //        category:"string",
        //        paymentType:"int",
        //        date:"string",
        //        month:"int",
        //        year:"int",
        //     }
        // };

        // const realm = await Realm.open({
        //     path: "expence",
        //     schema: [schema]
        // })
        // const expence = realm.objects("expence");
        // const id = JSON.stringify(updateData.expenceId)
        // const data = expence.filtered(`id == ${id}`); 

        // realm.write(()=>{
        //     data[0].amount = updateData.amount
        //     data[0].category = updateData.category
        //     data[0].paymentType = updateData.paymentType
        //     let mdata = {
        //         uToken: global.utoken,
        //         rToken: global.rtoken,
        //         accessid: updateData.expenceId,
        //         task: "UPDATE"
        //     }
        //     this.state.channel.push("deleteQue", {data: mdata})
        // })
        this.props.navigation.pop(2)
    }

    deleteLocalDataBase=async(updateData)=>{
        toast("Expence Deleted")

        // let schema = {
        //     name:"expence",
        //     properties:{
        //        id:"string",
        //        amount:"int",
        //        category:"string",
        //        paymentType:"int",
        //        date:"string",
        //        month:"int",
        //        year:"int",
        //     }
        // };

        // const realm = await Realm.open({
        //     path: "expence",
        //     schema: [schema]
        // })

        // const expence = realm.objects("expence");
        // const id = JSON.stringify(updateData.expenceId)
        // const data = expence.filtered(`id == ${id}`)

        // realm.write(()=>{
        //     realm.delete(data)
        //     let mdata = {
        //         uToken: global.utoken,
        //         rToken: global.rtoken,
        //         accessid: updateData.expenceId,
        //         task: "DELETE"
        //     }
        //     this.state.channel.push("deleteQue", {data: mdata})
        // })

        this.props.navigation.pop(2)
    }

    render(){
        const {loadData,type,amount,category,loader,isConnected,disable} = this.state
        // const {from,id,category,amount,paymentType} = this.props.route.params
        return(
            <View style={style.container}>
                {
                  loadData == true ?
                  <>
                  {
                    isConnected?
                    <>
                        <Header/>
                        <ExpenceInput heading = {"Amount"}
                                    placeHolder = {"Enter Amount"}
                                    iconName = {"calculator"}
                                    onPress = {()=>this.openCalculator()}
                                    onChange = {this.onChange}
                                    type={"number-pad"}
                                    value={amount}/>

                        <ExpenceInput heading = {"Category"}
                                    placeHolder = {"Enter Category"}
                                    iconName = {"list-circle"}
                                    onChange = {this.onChange}
                                    value = {category}/>

                        <View style={style.paymentType}>
                            <TouchableOpacity style={style.typeBox} 
                                            onPress={()=>this.changeType(0)}>
                                <Icons iconName = {type == 0 ?"radio-button-on":"radio-button-off"}
                                    iconSize = {font.size.font16}
                                    iconColor = {type == 0 ? color.green:color.darkGray}
                                    iconStyle = {style.iconStyle}/>

                                <Text style={style.cashText}>CASH</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={style.typeBox}
                                            onPress={()=>this.changeType(1)}>
                                <Icons iconName = {type == 1 ?"radio-button-on":"radio-button-off"}
                                        iconSize = {font.size.font16}
                                        iconColor = {type == 1 ? color.green:color.darkGray}
                                        iconStyle = {style.iconStyle}/>

                                <Text style={style.cashText}>CARD</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={style.typeBox}
                                            onPress={()=>this.changeType(2)}>
                                <Icons iconName = {type == 2 ?"radio-button-on":"radio-button-off"}
                                        iconSize = {font.size.font16}
                                        iconColor = {type == 2 ? color.green:color.darkGray}
                                        iconStyle = {style.iconStyle}/>
                                <Text style={style.cashText}>UPI</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={style.addButtonView}>
                            {
                                loader && (
                                    <ActivityIndicator size={font.size.font16} color={color.secondary} style={style.loader}/>
                                )
                            }
                            {
                                this.props.route.params.from == "edit"?
                                <>
                                <View style={style.updateButtonView}>
                                    <Button 
                                        buttonStyle = {[style.addButton,{backgroundColor:color.secondary}]}
                                        onPress = {()=>this.deleteAlert()}
                                        disabled = {disable}
                                        textStyle = {style.addButtonText}
                                        text = {"Delete"}
                                    />
                                    <Button 
                                        buttonStyle = {[style.addButton,{backgroundColor:color.tertiary}]}
                                        onPress = {()=>this.update()}
                                        disabled = {disable}
                                        textStyle = {style.addButtonText}
                                        text = {"Update"}
                                    />
                                </View>
                                
                                </>
                                :
                                <>
                                    {
                                        amount.length !== 0 & category.length !== 0 ?
                                            <Button 
                                                buttonStyle = {style.addButton}
                                                onPress = {()=>this.addExpence()}
                                                disabled = {disable}
                                                textStyle = {style.addButtonText}
                                                text = {"Add"}
                                            />
                                            :null
                                    }
                                </>
                            }
                        
                            
                        </View>
                    </>
                      :<NoInternet/>
                  }
                  </>
                  :null  
                }
            </View>
        )
    }
}

export default Expence;