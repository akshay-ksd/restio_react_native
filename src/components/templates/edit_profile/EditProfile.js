import React from "react";
import {View,Text} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Heder from "../../molecules/custom_heder/Heder";
import Image from "../../atom/Image"
import Icons from "../../atom/Icon"
import Textinput from "../../atom/TextInput"
import Button from "../../atom/Button";

const EditProfile =()=>{
    const [loadData,setLoadData] = React.useState(false)

    React.useEffect(()=>{
        loadDatas()
    },[])
    
    const loadDatas =()=>{
        setTimeout(()=>{setLoadData(true)},100)
    }
    
    return(
        <View style={style.container}>
            {
                loadData == true ?
                <>
                    <Heder headerName = {"Edit Profile"} />

                    <View style={style.editSectionView}>
                        <View style={style.profilePictureView}>
                            <Image url={"https://i.pinimg.com/originals/19/d3/86/19d3863bbd78227301d25df00f43867f.jpg"}
                                style={style.profilePictureUrl}/>

                            <View style={style.profileEditButton}>
                                <Icons iconName = {"camera"}
                                    iconSize = {font.size.font25}
                                    iconColor = {color.white}
                                    iconStyle = {style.iconStyle}/>
                            </View>
                        </View>
                        
                        <View style={style.profileInputView}>
                            <View style={style.hotelHeadingView}>
                                <Text style={style.hotelText}>Hotel Name</Text>
                            </View>
                            <Textinput 
                                inputViewStyle = {style.inputView}
                                inputStyle = {style.inputStyle}
                                placeHolder = {"Enter Name"}
                                iconShow = {false}
                                keyboardType = {"default"}
                                secureTextEntry = {false}
                                maxLength = {100}
                                load_data = {"load_data"}
                                type = {"default"}
                            />
                        </View>
                        <View style={style.saveButtonView}>
                            <Button 
                                buttonStyle = {style.saveButton}
                                onPress = {()=>bill()}
                                disabled = {false}
                                textStyle = {style.icomeText}
                                text = {"Save"}
                                iconShow = {false}
                                iconName = {"radio-button-on"}
                                iconSize = {font.size.font20+2}
                                iconColor = {color.green}
                                style = {style.iconStyle}
                            />
                        </View>
                        

                    </View>
                </>
                :null
            }
           
        </View>
    )
}

export default EditProfile