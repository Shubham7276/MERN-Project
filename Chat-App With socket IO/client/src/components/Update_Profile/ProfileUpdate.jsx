import {useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Avatar } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { ToastContainer, toast } from 'react-toastify';
import styles from "./styles.module.css";
import axios from 'axios';
import { GetUserById, UpdateUser } from '../../Services/Api';

export default function ProfileUpdateDaialog({profile,userId}) {

    const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
    const validNumber = RegExp(/^([0-9]{10})$/)

  const [open, setOpen] = useState(false);
  
  const [update, setUpdate] = useState({
    profile:"",
    userName: "",
    mobileNo: "",
    email: ""
});

const [error,setError] = useState({
    userName:"",
    mobileNo:"",
    email:"",
    validForm: true
})

const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach(
      (val) => val.length > 0 && (valid = false)
    );
   
    return valid;
  }

const handleChange = ({ currentTarget: input })=>{
    setUpdate({...update,[input.name]:input.value})
    switch (input.name) {
        case 'userName':
        error.userName = 
        input.value.length < 5
        ? 'Username must be 5 characters long!'
        : '';
        break;

        case 'mobileNo':
        error.mobileNo = 
        validNumber.test(input.value)
            ? ''
            : 'Mobile is must be 10 Digit!';
        break;

        case 'email':
        error.email = 
        validEmailRegex.test(input.value)
            ? ''
            : 'email is not valid!';
        break;

        
    }
}
  const handleClickOpen = async() => {
    setOpen(true);
    try {
        const res = await GetUserById(userId);
        console.log(res);
        setUpdate(res.data);
        
    } catch (err) {
        console.log(err);
    }
};

  const handleUpdate = async(e) =>{
    e.preventDefault();
    const valid = validateForm(error);
    setError({validForm: valid});
    if(valid){
        try {
            const res = await UpdateUser( userId,update);
            console.log(res);
            setUpdate("");
            handleClose();
            toast.success("Update your profile please login again",{position: "top-center"})  
          } catch (err) {
            console.log(err);
          }
    }else{
        toast.error("Something Wrong")
        setOpen(false);
    }

  }

  const handleClose = () => {
    setOpen(false);
    setUpdate("");
  };

  return (
    <div>
      
      <Avatar  onClick={handleClickOpen} src={profile}/>
      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Profile</DialogTitle>
        <DialogContent sx={{width:'400px'}}>
         
                    <div className={styles.upload}>
							<img src={update.profile} width='100px' height = '100px'></img>
						<div className={styles.round}>
                          <input
							type="file"
							className="file"
							onChange={(e) => {
								const file = e.target.files[0];
								const reader = new FileReader();
								reader.readAsDataURL(file);
								reader.onload = function () {	
									update.profile=reader.result
							};
							reader.onerror = function (error) {
								console.log(error);
							};
							}}    
			  			/>

							<CameraAltIcon />
							
						</div>
							</div>
          <TextField
            
            margin="dense"
            name='userName'
            label="User Name"
            type="text"
            onChange={handleChange}
            value={update.userName}
            fullWidth
            variant="filled"
          />
                    {
                        error.userName && ( 
                      <span className={styles.error_msg}>
                        {error.userName}
                      </span>
                      )}
          <TextField
            
            margin="dense"
            name='mobileNo'
            label="Mobile Number"
            type="text"
            onChange={handleChange}
            value={update.mobileNo}
            fullWidth
            variant="filled"
          />
                    {
                    error.mobileNo && ( 
                    <span className={styles.error_msg}>
                    {error.mobileNo}
                    </span>
                     )}
          <TextField
            
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            name='email'
            onChange={handleChange}
            value={update.email}
            fullWidth
            variant="filled"
          />
                        {
                        error.email && ( 
                      <span className={styles.error_msg}>
                        {error.email}
                      </span>
                      )}
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUpdate}>Save</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer/>
    </div>
  );
}