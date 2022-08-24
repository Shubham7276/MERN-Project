import * as React from 'react';
import { useState } from "react";
import { createTicket } from '../store/actions/ticketAction';
import {  useDispatch } from "react-redux";
import { Button,TextField, Dialog, DialogActions, DialogContent , DialogTitle} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';


// Add ticket popup box

export default function FormDialog(props) {
  const [open, setOpen] = useState(false);
  const {firstname,lastname,email}=props.user;
  const [desc,setDesc]= useState("")
  

  const name=firstname+" "+lastname;
  const Email=email;

  const date=new Date();
  const D=date.getDate();
  const M=1+date.getMonth();
  const Y=date.getFullYear();
  const time=date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  const Day=D.toString()+"/"+M.toString()+"/"+Y.toString()+"  "+time.toString();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const dispatch=useDispatch()

  const handleSubmit = () => {

    // create ticket
    if(!desc=="")
    {
        dispatch(createTicket(name,Day,Email,desc.desc))
        setOpen(false)
    }
    else{
      alert("plese type something")
    }
 
}; 

  return (
    <div>
      <Button sx={{marginBottom:'15px'}} variant="contained" color="success" onClick={handleClickOpen}>
        <AddIcon/>Add New Ticket
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
        <div style={{ display: 'flex' , justifyContent:'space-between'}}>
                    
                    <h4>Add Ticket</h4>
                    <Button
                      variant="contained" color="error"
                        
                        onClick={()=>{setOpen(false)}}>
                        X
                    </Button>
                </div>
        </DialogTitle>
        <DialogContent dividers>
          
        <TextField sx={{marginBottom:'10px'}}
          disabled
          fullWidth={true}
          id="outlined-disabled"
          label="Creator Name"
          defaultValue={name}
        />
          <TextField sx={{marginBottom:'10px'}}
            disabled
            fullWidth={true}
            id="outlined-disabled"
            label="Date"
            defaultValue={Day}
          />
      <TextField
          id="decs"
          label="Discription"
          fullWidth={true}
          onChange={(e)=>setDesc({desc:e.target.value})}
          multiline
          helperText="50/100"
          rows={4}     
        />  
        
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}