import { Dimensions } from "react-native";
import { Dimension } from "recyclerlistview";
const {height,width} = Dimensions.get('window')

const isPortrait =()=>{
    if(height > width){
        return true
    }else{
        return false
    }
}

export default isPortrait;