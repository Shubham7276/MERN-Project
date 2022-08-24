import axios from "axios";
import { useParams } from "react-router-dom";

const baseURL = "http://localhost:8080/api"


export const LoginUser = async (data) =>{
    return await axios.post(`${baseURL}/auth/login`,data)
}

export const SignUpUser = async (data)=>{
    return await axios.post(`${baseURL}/auth/signup`,data)
}


// Users

export const GetAllUsers = async ()=>{
    return await axios.get(`${baseURL}/user/users/all`)
}

export const GetUser = async (friendId)=>{
    return await axios.get(`${baseURL}/user/${friendId}`)
}

export const GetUserById = async(userId)=>{
    return await axios.get(`${baseURL}/user/${userId}`)
}

export const UpdateUser = async(userId,updateData)=>{
    return await axios.put(`${baseURL}/user/${userId}`,updateData)
}


//Conversation

export const GetAllConversation = async(id) =>{
    return await axios.get(`${baseURL}/conversation/${id}`)
}

export const AddNewConversation = async(members)=>{
    return await axios.post(`${baseURL}/conversation`,members)
}

export const DeleteConversation = async(conversationId) =>{
    return await axios.delete(`${baseURL}/conversation/${conversationId}`)
}

// Messages

export const GetAllMessage = async(currentChatId)=>{
    return await axios.get(`${baseURL}/message/${currentChatId}`)
}

export const AddNewMessage = async(message)=>{
    return await axios.post(`${baseURL}/message`,message)
}

export const DeleteMessage = async(currentChatId)=>{
    return await axios.delete(`${baseURL}/message/${currentChatId}`)
}