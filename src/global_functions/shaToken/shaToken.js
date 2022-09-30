import { sha256 } from 'react-native-sha256';

export const shatoken =async(data)=>{
    let token = false
    token = await sha256(data)
    return token
}
