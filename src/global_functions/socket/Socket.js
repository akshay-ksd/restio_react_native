import {Socket,Presence} from 'phoenix'

export const socket_connect = async()=>{
    let data = {
        app:"android",
        token:global.active_token
    }
    let socket = false
    socket = new Socket(global.url+'socket',{params: { data:data}});
    socket.connect()
    return  socket
}