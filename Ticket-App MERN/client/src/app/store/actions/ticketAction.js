import { FETCH, CREATE, UPDATE, DELETE } from "./actionType";

import AuthenticationService from "../../services/AuthenticationService";

export const createTicket=(name,Day,Email,desc)=>async (dispatch) => {

    try{
        const {data}=await AuthenticationService.addticket(name,Day,Email,desc);
        console.log(data)
        dispatch({type:CREATE,payload:{data}})
    }catch(error){
        console.log(error);
    }
};

export const getTicket=()=>async (dispatch) => {

    try{
        const {data}=await AuthenticationService.getticket();
        console.log(data)
        dispatch({type:FETCH,payload:{data}})
    }catch(error){
        console.log(error);
    }
};

export const updateTicket = (_id,UpdateDate,desc) => async (dispatch) => {
    
    try {
      const { data } = await AuthenticationService.updateTicket(_id,UpdateDate,desc);
  
      dispatch({ type: UPDATE, payload: data });
    } catch (error) {
      console.log(error);
    }
};

export const deletTicket = (_id,DeleteDate,isDelete) => async (dispatch) => {
    
    try {
        
      const { data } = await AuthenticationService.delTicket(_id,DeleteDate,isDelete);
  
      dispatch({ type: DELETE, payload: data });
    } catch (error) {
      console.log(error);
    }
};
