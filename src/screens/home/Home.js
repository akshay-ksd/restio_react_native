import React from "react";
import {View,Text, TouchableOpacity,Linking,Platform} from "react-native"
import Style from "./Style"
import Images from "../../components/atom/Image";
import HomeButtons from "../../components/organisms/home_buttons/HomeButtons";
import Realm from "realm";
import Loader from "../../components/atom/Loader";
import font from "../../theme/font";
import color from "../../theme/colors";
import {socket_connect} from "../../global_functions/socket/Socket"
import NoInternet from "../../components/templates/no_internet_view/NoInternet";
import NetInfo from "@react-native-community/netinfo";
import { connect } from 'react-redux'
import Splash from "../../components/organisms/splash_screen/Splash";

class Home extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loadData:false,
            imageUrl:"",
            access:"",
            loading:true,
            is_valid:false,
            staffChannel:null,
            socket:null,
            is_connected:false,
            restChannel:null
        }
    }

    componentDidMount(){
        setTimeout(() => {
            this.setState({loadData:true})
        }, 100);
        this.checkNetInfo()
    }

    checkNetInfo =()=>{
        this.unsubscribe = NetInfo.addEventListener(state => {
            if(state.isConnected == true){
                this.setState({isConnected:true})

                this.get_rest_charges()
                this.socket_connect()

               
            }else{
                this.setState({isConnected:false})
            }
          });
    }

    componentWillUnmount(){
        this.unsubscribe()
        this.state.staffChannel.leave()
    }


    socket_connect=async()=>{
        global.socket = await socket_connect()
        this.setState({socket:await socket_connect()})
        this.checkIsValid()
        this.staffSocket()
    }

    checkIsValid=async()=>{
        let data = {
            restaurentId:global.rtoken,
            active_token:global.active_token,
            utoken:global.utoken
        }

        const phxChannel = this.state.socket.channel('plan:' + global.rtoken)

        phxChannel.join().receive('ok',response => {
            phxChannel.push("currentPlan", { data: data})
        })

        phxChannel.on('currentPlan',data => {
            if(data.data.length == 0){
                this.setState({is_valid:false})
            }else{
               this.setState({is_valid:true})
            }
            if(data.token == global.utoken){
                if(data.active_token !== global.active_token ){
                    this.logout_user()
                }
            }
        })
    }

    async logout_user(){
        let schema = {
            name: "user",
            properties: {
            name: "string",
            utoken: "string",
            rtoken: "string",
            access: "string",
            is_loged: "int",
            active_token: "string"
            },
        };

        const realm = await Realm.open({
            path: "myrealm",
            schema: [schema],
        });
        const user = realm.objects("user");

        realm.write(()=>{
            for(let u = 0; u < user.length; u ++){
                user[u].is_loged = 0
            }
        })
        this.props.logout()
    }

    async get_restaurent_details(){
        let schema = {
            name: "restaurent",
            properties: {
            name: "string",
            rtoken: "string",
            imageUrl: "string",
            },
        };

        const realm = await Realm.open({
                                // path: "myrealm",
                                schema: [schema],
                            });
        const tasks = realm.objects("restaurent");

        if(tasks.length == 0){
           this.get_rest_data()
        }else{
            this.setState({imageUrl:tasks[0].imageUrl,loading:false})
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
                this.store_restaurent_details(res.image_url,res.name)
                this.setState({imageUrl:res.image_url,loading:false})
            })
    }

    get_rest_charges(){
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
                this.storeCharges(res.charge,res.gst,res.sgst)
                // this.storeTableCharges(res.tableCount)
            }) 
    }

    storeCharges =async(charge,gst,sgst)=>{
        // console.log("sgst",sgst)
        let schema = {
            name: "restaurent",
            properties: {
                gst:"int",
                charge:"int",
                sgst:"int",
            },
        };

        const realm = await Realm.open({
            path: "restaurent",
            schema: [schema],
        });

        const datas = realm.objects("restaurent");
        if(datas.length !== 0){
            realm.write(()=>{
                for(let i = 0; i < datas.length; i ++){
                    datas[i].gst = gst == null?0:gst
                    datas[i].charge = charge == null?0:charge
                    datas[i].sgst = 0
                }
            })
        }else{
            let task1;
            realm.write(() => {
                task1 = realm.create("restaurent", {
                             gst:gst == null?0:gst,
                             charge:charge == null?0:charge,
                             sgst:0
                        })
            })
        }
    }

    storeTableCharges =async(count)=>{
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
            let task1;
            realm.write(() => {
                task1 = realm.create("table", {
                            tableCount:count
                        })
            })
        }else{
            realm.write(()=>{
                realm.delete(tableData)
            })

            let task1;
            realm.write(() => {
                task1 = realm.create("table", {
                            tableCount:count
                        })
            })
        }
    }

    async store_restaurent_details(imageUrl,name){
        let schema = {
            name: "restaurent",
            properties: {
            name: "string",
            rtoken: "string",
            imageUrl: "string",
            },
        };

        const realm = await Realm.open({
                                schema: [schema],
                        });
                        
        let task1;
        realm.write(() => {
            task1 = realm.create("restaurent", {
                name: name,
                rtoken: global.rtoken,
                imageUrl: imageUrl,
            });
            global.resName = name
        })
    }

    callNumber = phone => {
       setTimeout(()=>{
        let phoneNumber = phone;
        if (Platform.OS !== 'android') {
          phoneNumber = `telprompt:${phone}`;
        }
        else  {
          phoneNumber = `tel:${phone}`;
        }
        Linking.canOpenURL(phoneNumber)
        .then(supported => {
          if (!supported) {
            Alert.alert('Phone number is not available');
          } else {
            return Linking.openURL(phoneNumber);
          }
        })
        .catch(err => console.log(err));
        },100)
      };

      async staffSocket(){
        const phxChannel = this.state.socket.channel('staff:' + global.rtoken)

        phxChannel.join().receive('ok',response => {
            this.setState({staffChannel:phxChannel})
            this.getRestaurentData()
            this.checknewStaffAddQue()
        })

        phxChannel.on('getRestDetails',data => {
            let name = data.data[0].name
            let image_url = data.data[0].image_url
            this.store_restaurent_details(image_url,name)
            this.setState({imageUrl:image_url,loading:false})
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

        phxChannel.on('checkQueue',data => {
            if(data.data.staffId == global.utoken){
                if(data.data.task == "ADD"){
                    if(data.data.staff_data !== false){
                        this.storeQueStaffDataLocally(data.data.staff_data)
                    }else if(data.data.staff_data == false){
                        this.checkStaffUpdateQue()
                    }
                }else if(data.data.task == "UPDATE"){
                    if(data.data.staff_data !== false){
                        this.updateStaffQueData(data.data.staff_data)
                    }else if(data.data.staff_data == false){
                        // this.checkStaffUpdateQue()
                    }
                }
            }
        })
    }


    storeLocalDatabse=async(name,access,number,password,restaurent_token,token,is_active)=>{
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
        let task1;
                realm.write(() => {
                    task1 =  realm.create("staff", {
                                name:name,
                                access:access,
                                number:number,
                                password:password,
                                restaurent_token:global.rtoken,
                                token:token,
                                is_active:is_active == true ? 1 : 0  
                            })
                })
        let mdata = {
            uToken: global.utoken,
            rToken: global.rtoken,
            accessid: token,
            task: "DELETE"
        }
        this.state.staffChannel.push("deleteQue", {data: mdata})
    }

    updateLocalDatabase=async(staff_data)=>{
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

        const staff = realm.objects("staff");
        let id = JSON.stringify(staff_data.token)
        const staffData = staff.filtered(`token == ${id}`)
        if(staffData.length !== 0){
            for(let i = 0; i < staffData.length; i ++){
                realm.write(() => {
                    staffData[i].name = staff_data.name
                    staffData[i].number = staff_data.number
                    staffData[i].password = staff_data.password
                    staffData[i].access = staff_data.access
                })
            }
        }
       
        let mdata = {
            uToken: global.utoken,
            rToken: global.rtoken,
            accessid: staff_data.token,
            task: "DELETE"
        }
        this.state.staffChannel.push("deleteQue", {data: mdata})
    }

    checknewStaffAddQue =()=>{
        let data = {
            utoken:global.utoken,
            rtoken:global.rtoken,
            section:"Staff",
            task:"ADD"
        }

        this.state.staffChannel.push("checkQueue", {data: data})
    }

    storeQueStaffDataLocally =(staff_data)=>{
        for(let i = 0; i < staff_data.length; i ++){
            let name = staff_data[i].name
            let access = staff_data[i].access
            let number = staff_data[i].number
            let password = staff_data[i].password
            let restaurent_token = staff_data[i].restaurent_token
            let token = staff_data[i].token

           this.storeLocalDatabse(name,access,number,password,restaurent_token,token)
        }
    }

    checkStaffUpdateQue =()=>{
        let data = {
            utoken:global.utoken,
            rtoken:global.rtoken,
            section:"Staff",
            task:"UPDATE"
        }
        this.state.staffChannel.push("checkQueue", {data: data})
    }

    updateStaffQueData =(staff)=>{
        for(let i = 0; i < staff.length; i ++){
            let staff_data = {
                    name:staff[i].name,
                    number:staff[i].number,
                    password:staff[i].password,
                    access:staff[i].access,
                    token:staff[i].token
            }
            this.updateLocalDatabase(staff_data)
        }  
    }

    getRestaurentData =()=>{
        let data = {
            rtoken:global.rtoken
        }
        this.state.staffChannel.push("getRestDetails", {data: data})
    }

    render(){
        const {loadData,loading,isConnected} = this.state
        if(loading == true){
            return(
               <Splash/>
            )
        }else{
            return(
                <View style={Style.container}>
                    {
                        loadData == true ?
                        <>
                        {
                            isConnected == true?
                            <>
                                {/* <View style={Style.imageView}>
                                    <Images style = {Style.imageView}
                                            url = {"https://mixingbowlhub.com/wp-content/uploads/2016/01/bigstock-Food-background-food-bloggin-76527608.jpg"}/>
                                </View> */}
                                <View style={Style.HomeButtonsView}>
                                    {
                                        this.state.is_valid == true ?
                                            <HomeButtons/>
                                        :
                                        <View style={Style.expairedView}> 
                                            <Text style={Style.expairedText}>Plan expaired. Recharge immediately</Text>
                                            <TouchableOpacity onPress={()=>this.callNumber(8157896995)}>
                                                <Text style={Style.contactus}>Contact Us ?</Text>
                                            </TouchableOpacity>
                                        </View>
                                    }                              
                                </View>
                            </>
                            :
                            <NoInternet/>
                        }
                            
                        </>
                        :null
                    }
                
                </View>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
      login_status: state.login_status
    }
  }
  
  function mapDispatchToProps(dispatch) {
    return {
        login: () => dispatch({ type: 'LOGIN' }),
        logout: () => dispatch({ type: 'LOGOUT' }),
    }
  }
  
export default connect(mapStateToProps,mapDispatchToProps)(Home)
