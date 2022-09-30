import React from "react";
import {View,Text,Dimensions} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Heder from "../../molecules/custom_heder/Heder";
import Button from "../../atom/Button";
import { RecyclerListView, DataProvider, LayoutProvider, AutoScroll } from 'recyclerlistview';
import StaffProfile from "../../molecules/staff_profile_display/StaffProfile";
import StaffRegister from "../staff_register/StaffRegister";
import Realm from "realm";
import { shatoken } from "../../../global_functions/shaToken/shaToken";
import {toast} from "../../../global_functions/toast_message/Toast";
import NetInfo from "@react-native-community/netinfo";
import NoInternet from "../no_internet_view/NoInternet";

class ManageStaff extends React.Component{
    constructor(props){
        super(props)
        this.state={
            list:new DataProvider((r1, r2) => {
                return r1 !== r2;
            }),
            staffList:[],
            loadData:false,
            task:"LIST",
            showRegisterView:false,
            staffSchema:"",
            channel:"",
            purpose:"ADD",
            selectedStaff:null,
            heading:"Add New Staff",
            updateData:{name:null,
                        token:null,
                        access:"ALL",
                        restaurent_token:null,
                        password:null,
                        number:null,
                        is_active:1},
            isConnected:false,
        };
        this.layoutProvider = new LayoutProvider((i) => {
            return this.state.list.getDataForIndex(i).type;
          },(type, dim) => {
            dim.width = Dimensions.get('window').width;
            dim.height = font.headerHeight*2; 
        })
    }

    componentDidMount(){
        setTimeout(()=>{this.setState({loadData:true})},100)
        this.checkNetInfo()
    }

    checkNetInfo =()=>{
        this.unsubscribe = NetInfo.addEventListener(state => {
            if(state.isConnected == true){
                this.setState({isConnected:true})
                this.socketConnect()
                this.loadSchema()
            }else{
                this.setState({isConnected:false})
            }
          });
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
        let access = JSON.stringify("ALL") 
        const staff = this.state.staffSchema.objects("staff");

        for(let i = 0; i < staff.length; i ++){
            if(staff[i].access !== "ALL"){
                this.state.staffList.unshift({
                    type: 'NORMAL',
                    item: {
                        token: staff[i].token,
                        name: staff[i].name,
                        access: staff[i].access,
                        restaurent_token: staff[i].restaurent_token,
                        password: staff[i].password,
                        number: staff[i].number,
                        is_active: staff[i].is_active
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
    }

    addStaff(){
        this.setState({task:"ADD"})
        setTimeout(()=>{this.setState({showRegisterView:true})},50)
    }

    addStaffDetails=async(name,number,password,access,isEnabled)=>{
        if(this.state.isConnected){
            const staff = this.state.staffSchema.objects("staff");
            const id = JSON.stringify(number)
            const staffData = staff.filtered(`number == ${id}`)
            if(staffData.length == 0){
                let data = global.rtoken+number
                let utoken = await shatoken(data)
                if(this.Number_validation(number) == true){
                   this.props.navigation.navigate("StaffVarify",{number:number,name:name,access:access,isEnabled:isEnabled,utoken:utoken})
                }else{
                    alert("Mobile number is not valid")
                }
                // this.storeInServerDatabase(name,number,password,access,utoken,isEnabled)
            }else{
                toast("This Staff IS Already Registerd")
            }
        }else{
            this.setState({isConnected:false})
        }
    }

    Number_validation = (number)=>{
        var regexp = /^([0|+[0-9]{1,5})?([6-9][0-9]{9})$/
        return regexp.test(number)
    }

    storeInServerDatabase=(name,number,password,access,utoken,isEnabled)=>{
        if(name !== null & number !== null & access !== null){
        let staff = {
                    name:name,
                    number:number,
                    password:"password",
                    access:access,
                    restaurent_token:global.rtoken,
                    token:utoken,
                    is_active:isEnabled
                }
                this.state.channel.push('addStaff', { staff: staff})
        }else{
            toast("Please fill all staff details")
        }
      
    }

    storeLocalDatabse=async(name,access,number,password,restaurent_token,token,is_active)=>{
        let task1;
                this.state.staffSchema.write(() => {
                    task1 =  this.state.staffSchema.create("staff", {
                                name:name,
                                access:access,
                                number:number,
                                password:password,
                                restaurent_token:global.rtoken,
                                token:token,
                                is_active:is_active == true ? 1 : 0  
                            })
                    this.setState({staffList:[]})
                    toast(`${name} Registerd`)
                    this.setState({task:"LIST"})
                    setTimeout(()=>{this.loadData()},200)
                    let mdata = {
                        uToken: global.utoken,
                        rToken: global.rtoken,
                        accessid: token,
                        task: "DELETE"
                    }
                    this.state.channel.push("deleteQue", {data: mdata})
                })
    }

    async socketConnect(){
        const phxChannel = global.socket.channel('staff:' + global.rtoken)

        phxChannel.join().receive('ok',response => {
            this.setState({channel:phxChannel})
        })

        phxChannel.on('addStaff',staff => {
            let name = staff.staff.name
            let access = staff.staff.access
            let number = staff.staff.number
            let password = staff.staff.password
            let restaurent_token = staff.staff.restaurent_token
            let token = staff.staff.token
            let is_active = staff.staff.is_active
           this.storeLocalDatabse(name,access,number,password,restaurent_token,token,is_active)
        })

        phxChannel.on('updateStaff',staff => {
           let staff_data = staff.staff
           this.updateLocalDatabase(staff_data)
        })
    }

    editProfile(token,name,access,restaurent_token,password,number,is_active){
        if(this.state.isConnected){
            this.setState({updateData:{name:name,
                token:token,
                access:access,
                restaurent_token:restaurent_token,
                password:password,
                number:number,
                is_active:is_active},heading:"Update Profile"})

            this.setState({purpose:"UPDATE",
                task:"ADD"})
            setTimeout(()=>{this.setState({showRegisterView:true})},50)
        }else{
            this.setState({isConnected:false})
        }     
    }

    update=(name,number,password,access,isEnabled)=>{
        if(this.state.isConnected){
            let staff = {
                name:name,
                number:number,
                password:password,
                access:access,
                restaurent_token:global.rtoken,
                token:this.state.updateData.token,
                is_active:isEnabled
            }
    
            this.state.channel.push('updateStaff', { staff: staff})
        }else{
            this.setState({isConnected:false})
        }      
    }

    updateLocalDatabase=(staff_data)=>{
        const staff = this.state.staffSchema.objects("staff");
        let id = JSON.stringify(staff_data.token)
        const staffData = staff.filtered(`token == ${id}`)
        for(let i = 0; i < staffData.length; i ++){
            this.state.staffSchema.write(() => {
                staffData[i].name = staff_data.name
                staffData[i].number = staff_data.number
                staffData[i].password = staff_data.password
                staffData[i].access = staff_data.access
                staffData[i].is_active = staff_data.is_active == true ? 1 : 0
            })
        }
        

        let mdata = {
            uToken: global.utoken,
            rToken: global.rtoken,
            accessid: staff_data.token,
            task: "DELETE"
        }
        this.state.channel.push("deleteQue", {data: mdata})

        this.setState({updateData:{name:null,
                        token:null,
                        access:"MENU",
                        restaurent_token:null,
                        password:null,
                        number:null}})

        this.setState({staffList:[],purpose:"ADD"})
        toast(`${staff_data.name} Details Updated`)
        this.setState({task:"LIST"})
        setTimeout(()=>{this.loadData()},200)
    }

    rowRenderer = (type,data,index,extendedState)=>{
        const {token,name,access,restaurent_token,password,number,is_active} = data.item
        return(
            <StaffProfile token = {token}
                          name = {name}
                          access = {access}
                          is_active = {is_active}
                          editProfile = {()=>this.editProfile(token,name,access,restaurent_token,password,number,is_active)}
                          index = {index}
                          selectedIndex = {extendedState.index}/>   
        )
    }

    renderFooter = () =>{
        return(
            <View style={style.footer}>

            </View>
        )
    }

    render(){
        const {loadData,task,showRegisterView,purpose,updateData,heading,isConnected} = this.state
        return(
            <View style={style.container}>
                {
                    loadData == true ?
                    <>
                    {
                        isConnected?
                        <>
                         <Heder headerName = {task == "ADD"?heading:"Manage Staff"}/>
                        {
                            task == "LIST" ?
                            <>
                                <View style={style.addStaffButtonView}>
                                    <Button 
                                        buttonStyle = {style.addStaffButton}
                                        onPress = {()=>this.addStaff()}
                                        disabled = {false}
                                        textStyle = {style.addStaffText}
                                        text = {"ADD NEW STAFF"}
                                        iconShow = {true}
                                        iconName = {"add-circle"}
                                        iconSize = {font.size.font18}
                                        iconColor = {color.white}
                                        style = {style.iconStyle}
                                    />
                                </View>

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
                                </View>
                                </>
                                :
                                <>
                                {
                                    showRegisterView == true ?
                                    <View style={style.staffList}>
                                        <StaffRegister addStaffDetails={this.addStaffDetails}
                                                    purpose={purpose}
                                                    updateData={updateData}
                                                    update={this.update}/>
                                    </View>:null
                                }
                            
                                </>
                        }
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

export default ManageStaff;