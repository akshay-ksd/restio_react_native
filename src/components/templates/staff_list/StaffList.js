import React from "react";
import {View,Dimensions,Keyboard} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Header from "../../molecules/custom_heder/Heder"
import { RecyclerListView, DataProvider, LayoutProvider, AutoScroll } from 'recyclerlistview';
import StaffProfile from "../../molecules/staff_profile_display/StaffProfile"
import Realm from "realm";
import OrderConform from "../order_conform/OrderConform";
import NoInternet from "../no_internet_view/NoInternet";
import NetInfo from "@react-native-community/netinfo";
const {width,height} = Dimensions.get('window')

class StaffList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loadData:false,
            list:new DataProvider((r1, r2) => {
                return r1 !== r2;
            }),
            staffList:[],
            staffSchema:"",
            selectedStaff:null,
            orderData:{},
            userToken:null,
            isConnected:false,
            isKeyboardVisible:false
        };
        this.layoutProvider = new LayoutProvider((i) => {
            return this.state.list.getDataForIndex(i).type;
          },(type, dim) => {
            dim.width = Dimensions.get('window').width;
            dim.height = Dimensions.get('window').height/5; 
        })
    }

    componentDidMount(){
        setTimeout(()=>{this.setState({loadData:true})},100)
        this.checkNetInfo()
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
              this.setState({isKeyboardVisible:true}); // or some other action
            }
          );
          this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
              this.setState({isKeyboardVisible:false}); // or some other action
            }
          );
    }

    checkNetInfo =()=>{
        this.unsubscribe = NetInfo.addEventListener(state => {
            if(state.isConnected == true){
                this.loadSchema()
                this.setState({isConnected:true})
               
            }else{
                this.setState({isConnected:false})
            }
          });
    }

    componentWillUnmount(){
        this.unsubscribe()
    }

    async loadSchema(){
        let schema = {
            name:"staff",
            properties:{
                name:"string",
                access:"string",
                number:"string",
                password:"string",
                restaurent_token:"string",
                token:"string",
                is_active:"int"
            }
        };

        const realm = await Realm.open({
            path: "staff",
            schema: [schema]
        })

        this.setState({staffSchema:realm})
        this.loadData()
    }

    loadData(){

        const staffData = this.state.staffSchema.objects("staff");
        const id = JSON.stringify("DELIVERY")
        const staff = staffData.filtered(`access == ${id} && is_active == 1`)
        for(let i = 0; i < staff.length; i ++){
            this.state.staffList.unshift({
                type: 'NORMAL',
                item: {
                    token: staff[i].token,
                    name: staff[i].name,
                    access: staff[i].access,
                    restaurent_token: staff[i].restaurent_token,
                    password: staff[i].password,
                    number: staff[i].number
                } 
            })

            if(i == staff.length-1){
                let filterDdata = this.state.staffList.filter((thing, index, self) =>
                index === self.findIndex((t) => (
                    t.item.token === thing.item.token
                ))
                )
                this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(filterDdata)})
            }
        }
    }

    rowRenderer = (type,data,index,extendedState)=>{
        const {token,name,access,restaurent_token,password,number} = data.item
        return(
            <StaffProfile token = {token}
                          name = {name}
                          access = {access}
                          editProfile = {()=>this.selectStaff(token,name,access,restaurent_token,password,number,index)}
                          index = {index}
                          selectedIndex = {extendedState.index}/>   
        )
    }

    goOrderConformScreen=(token,name,access,restaurent_token,password,number)=>{
        let oredrData = {orderDetails:this.props.route.params.oredrData,
                         userToken:token}
        this.props.navigation.navigate("OrderConform",{oredrData:oredrData})
    }

    renderFooter=()=>{
        return(
            <View style={style.footer}/>
        )
    }

    selectStaff=(token,name,access,restaurent_token,password,number,index)=>{
        this.setState({selectedStaff:null})
        let oredrData = {orderDetails:this.props.route.params.oredrData,
            userToken:token}
        setTimeout(()=>{this.setState({selectedStaff:index,oredrData:oredrData})},100)
    }

    render(){
        const {loadData,selectedStaff,oredrData,isConnected,isKeyboardVisible} = this.state
        return(
            <View style={style.container}>
                {
                    loadData == true?
                    <>
                    {
                        isConnected?
                        <>
                            <Header headerName = {"Select Staff"}/>

                            <View style={style.staffList}>
                                <RecyclerListView
                                    style={style.staffList}
                                    rowRenderer={this.rowRenderer}
                                    dataProvider={this.state.list}
                                    layoutProvider={this.layoutProvider}
                                    forceNonDeterministicRendering={true}
                                    canChangeSize={true}
                                    disableRecycling={true}
                                    renderFooter={this.renderFooter}
                                    initialOffset={3}
                                    onEndReachedThreshold={2}
                                    extendedState={{index:this.state.selectedStaff}}
                                />
                                {
                                    selectedStaff !== null ?
                                    <View style={{bottom:isKeyboardVisible?(height/2)-100:0}}>
                                    <OrderConform oredrData = {oredrData}/>
                                    </View>
                                    :null
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

export default StaffList