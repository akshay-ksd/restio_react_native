import React from "react";
import {View,Text} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Heder from "../../molecules/custom_heder/Heder";
import AttendanceButton from "../../organisms/attendence_button/AttendeceButton";
import AddAttendece from "../../organisms/add_attendence/AddAttendence";
import Report from "../../organisms/attendence_report/Report";

class Atendence extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            action:0,
            loadData:false
        }
    }

    componentDidMount(){
        setTimeout(()=>{this.setState({loadData:true})},50)
    }

    changeAction=(id)=>{
        this.setState({action:id})
    }

    render(){
        const {action,loadData} = this.state
        return(
            <View style={style.container}>
                {
                    loadData && (
                        <>
                            <Heder headerName={"Manage Attendance"}/>
                            <AttendanceButton changeAction={this.changeAction}/>
                            {
                                action == 0?
                                <AddAttendece/>
                                :                            
                                <Report/>
                            }
                        </>
                    )
                }
            </View>
        )
    }
}

export default Atendence;