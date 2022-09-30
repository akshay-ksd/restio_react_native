import React from "react";
import {View,Text,Dimensions, TouchableOpacity} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Button from "../../atom/Button";
import { RecyclerListView, DataProvider, LayoutProvider, AutoScroll } from 'recyclerlistview';
import StaffProfile from "../attendence_staff_profile/StaffProfile"
import {toast} from "../../../global_functions/toast_message/Toast"
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";

class AddAttendece extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            showList:false,
            list:new DataProvider((r1, r2) => {
                return r1 !== r2;
            }),
            staffList:[],
            attendenceList:[],
            showUpdateButton:false,
            channel:null,
            loadingIndex:null,
            showPicker:false,
            date:new Date(Date.now()),
            mode:"date",
        };
        this.layoutProvider = new LayoutProvider((i) => {
            return this.state.list.getDataForIndex(i).type;
          },(type, dim) => {
            dim.width = Dimensions.get('window').width;
            dim.height = Dimensions.get('window').height; 
          })
    }

    componentDidMount(){
       this.getStaffDetails(this.state.date) 
       this.connectSocket()
    }

    connectSocket=()=>{
        const phxChannel = global.socket.channel('attendence:' + global.rtoken)
        phxChannel.join().receive('ok',response => {
            this.setState({channel:phxChannel})
        })

        phxChannel.on('add',data => {
            this.addAttendecedata(data.data)
        })
    }

    getStaffDetails=async(date)=>{
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
        let data = realm.objects("staff");
        let id = 1
        let staff = data.filtered(`is_active == ${id}`)
        this.getAttendenceDetails(staff,date)
    }

    getAttendenceDetails=async(staff,date)=>{
        let schema = {
            name:"attendence",
            properties:{
               id:"int",
               name:"string",
               staffId:"string",
               present:"int",
               date:"date"
            }
        };

        const realm = await Realm.open({
            path: "attendence",
            schema: [schema]
        })

        let atendence = realm.objects("attendence")
        this.loadStaffData(staff,atendence,date)
    }

    loadStaffData =(staff,attendence,date)=>{
        this.state.staffList.splice(0,this.state.staffList.length)
        this.setState({showList:false})
        for(let i = 0; i < staff.length; i ++){
            let staffId = JSON.stringify(staff[i].token)
            let data = attendence.filtered(`staffId == ${staffId}`)
            let filyear = data.filter(x=>x.date.getFullYear() == date.getFullYear())
            let filmonth = filyear.filter(x=>x.date.getMonth()+1 == date.getMonth()+1)
            let filData = filmonth.filter(x=>x.date.getDate() == date.getDate())

            this.state.staffList.unshift({
                type: 'NORMAL',
                item: {
                    token: staff[i].token,
                    name: staff[i].name,
                    access: staff[i].access,
                    restaurent_token: staff[i].restaurent_token,
                    password: staff[i].password,
                    number: staff[i].number,
                    is_active: staff[i].is_active,
                    isPresent: filData.length == 0?false:true
                } 
            })
            if(i == staff.length-1){
                let filterDdata = this.state.staffList.filter((thing, index, self) =>
                    index === self.findIndex((t) => (
                        t.item.token === thing.item.token
                    ))
                )
                this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(filterDdata),showList:true})
            }
        }
    }

    pressent=async(status,token,name,index)=>{
        this.setState({loadingIndex:index})
        let schema = {
            name:"attendence",
            properties:{
               id:"int",
               name:"string",
               staffId:"string",
               present:"int",
               date:"date"
            }
        };

        const realm = await Realm.open({
            path: "attendence",
            schema: [schema]
        })

        let attendence = realm.objects("attendence")
        let staffId = JSON.stringify(token)
        let data = attendence.filtered(`staffId == ${staffId}`)
        let filyear = data.filter(x=>x.date.getFullYear() == this.state.date.getFullYear())
        let filmonth = filyear.filter(x=>x.date.getMonth()+1 == this.state.date.getMonth()+1)
        let filData = filmonth.filter(x=>x.date.getDate() == this.state.date.getDate())

        this.state.attendenceList.push({
            attendenceId:filData.length == 0?0:filData[0].id,
            name:name,
            present:filData.length == 0 ?status:false,
            restaurentId:global.rtoken,
            staffId:token,
            year:this.state.date.getFullYear(),
            month:this.state.date.getMonth()+1,
            day:this.state.date.getDate() == 1 ? this.state.date.getDate()+1:this.state.date.getDate(),
            date:this.state.date,
            hour: this.state.date.getHours(),
            minute: this.state.date.getMinutes(), 
            second: this.state.date.getSeconds(),
            getMilliseconds:this.state.date.getMilliseconds()
        })
        this.update()
    }

    update=()=>{
        let data = {
            staffData:this.state.attendenceList
        }

        this.state.channel.push("add",{data:data})
    }
    
    addAttendecedata=async(data)=>{
        this.setState({loadingIndex:null})

        this.state.attendenceList.splice(0,this.state.attendenceList.length)
        let schema = {
            name:"attendence",
            properties:{
               id:"int",
               name:"string",
               staffId:"string",
               present:"int",
               date:"date"
            }
        };

        const realm = await Realm.open({
            path: "attendence",
            schema: [schema]
        })

        if(data.present == true){
            toast(data.name + " Present")
            let task1;
            realm.write(() => {
                task1 = realm.create("attendence", {
                    id:data.attendence_id,
                    name:data.name,
                    staffId:data.staffId,
                    present:data.present == true?1:0,
                    date:data.date
                })
            })
        }else{
            toast(data.name + " Absent")
            let attData = realm.objects("attendence")
            let id = data.attendence_id
            let attendence = attData.filtered(`id == ${id}`)
            realm.write(()=>{
                realm.delete(attendence)
            })
        }      
    }

    changeDate=()=>{
        setTimeout(()=>{this.setState({showPicker:true})},10)
    }

    onChange =(date)=>{
        if(date.type == "set"){
            this.setState({date:date.nativeEvent.timestamp})
            this.getStaffDetails(date.nativeEvent.timestamp) 
        }else{
            // toast("Date not selected !!!")
        }
        this.setState({showPicker:false})
    }

    rowRenderer = (type,data,index,extendedState)=>{
        const {token,name,access,restaurent_token,isPresent,is_load,is_active} = data.item
        return(
            <StaffProfile token = {token}
                          name = {name}
                          access = {access}
                          is_active = {is_active}
                          pressent = {this.pressent}
                          index = {index}
                          is_load = {is_load}
                          loadingIndex={extendedState.loadingIndex}
                          isPresent={isPresent}
            />   
        )
    }

    renderFooter = () =>{
        return(
            <View style={style.footer}/>
        )
    }


    render(){
        const {showList,showPicker,loadingIndex,date,mode} = this.state
        return(
            <View style={style.container}>
                <View style={style.dateButtonView}>
                    <Button 
                        buttonStyle = {style.datePicker}
                        onPress = {()=>this.changeDate(0)}
                        disabled = {false}
                        textStyle = {style.boxText}
                        text = {moment(this.state.date).format('MMM Do YYYY')}
                        iconShow = {true}
                        iconName = {"chevron-down"}
                        iconSize = {font.size.font18}
                        iconColor = {color.white}
                        iconStyle = {style.iconStyle}
                    />    
                </View>
                {showPicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            display="default"
                            onChange={(onchange)=>this.onChange(onchange)}
                        />
                )}
                <View style={style.staffList}>
                    {
                        showList && (
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
                                extendedState={{loadingIndex:loadingIndex}}
                            />
                        )
                    }
                </View>
            </View>
        )
    }
}

export default AddAttendece;