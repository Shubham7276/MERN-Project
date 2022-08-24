import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import pic from '../../images/defaultpic1.jpg'
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { SignUpUser } from "../../Services/Api";


const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
const validNumber = RegExp(/^([0-9]{10})$/)
const validPassword = RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,12}$/)

const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach(
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  }

const Signup = () => {
	const [data, setData] = useState({
		userName: "",
		mobileNo: "",
		email: "",
		password: "",
		profile:""
	});
	
    
    const [validation,setValidation] = useState({
        userName:"",
        mobileNo:"",
        email:"",
        password:"",
        validForm: true
    })
	const [error, setError] = useState("");
	const [msg, setMsg] = useState("");

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
        
		
        switch (input.name) {
            case 'userName':
            validation.userName = 
            input.value.length < 5
            ? 'Username must be 5 characters long!'
            : '';
            break;

            case 'mobileNo':
            validation.mobileNo = 
            validNumber.test(input.value)
                ? ''
                : 'Mobile is must be 10 Digit!';
            break;

            case 'email':
            validation.email = 
            validEmailRegex.test(input.value)
                ? ''
                : 'email is not valid!';
            break;

            case 'password':
            validation.password = 
            validPassword.test(input.value)
                ? ''
                : 'Password is not valid! Ex.Abcd@123';
            break;
        }
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
        const valid = validateForm(validation);
		console.log(valid)
        setValidation({validForm: valid});
		
        if(valid){
		try {
            setError("");
			const { data: res } = await SignUpUser(data);
			setMsg(res.message);
			window.location = "/login";
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
        }
	};

	return (
		<div className={styles.signup_container}>
			<div className={styles.signup_form_container}>
				<div className={styles.left}>
					<h1>Welcome Back</h1>
					<Link to="/login">
						<button type="button" className={styles.white_btn}>
							Sign in
						</button>
					</Link>
				</div>
				<div className={styles.right}>
				
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Create Account</h1>
						<div className={styles.upload}>
							<img src={data.profile===""?pic:data.profile} width='100px' height = '100px'></img>
						<div className={styles.round}>
						<input
							type="file"
							className="file"
							onChange={(e) => {
								const file = e.target.files[0];
								const reader = new FileReader();
								reader.readAsDataURL(file);
								reader.onload = function () {	
									data.profile=reader.result
							};
							reader.onerror = function (error) {
								console.log(error);
							};
							}}    
			  			/>

							<CameraAltIcon />
							
						</div>
							</div>
						<input
							type="text"
							placeholder="User Name"
							name="userName"
							autoComplete="off"
							onChange={handleChange}
							value={data.userName}
							required
							className={styles.input}
						/>
                         {
                        validation.userName && ( 
                      <span className={styles.error_msg}>
                        {validation.userName}
                      </span>
                    )
                    }
						<input
							type="text"
							placeholder="Mobile Number"
							name="mobileNo"
							maxLength={10}
							autoComplete="off"
							onChange={handleChange}
							value={data.mobileNo}
							required
							className={styles.input}
						/>
                        {
                            validation.mobileNo && ( 
                            <span className={styles.error_msg}>
                             {validation.mobileNo}
                            </span>
                            )
                        }

						<input
							type="email"
							placeholder="Email"
							name="email"
							onChange={handleChange}
							value={data.email}
							required
							className={styles.input}
						/>
                        {
                            validation.email && ( 
                            <span className={styles.error_msg}>
                             {validation.email}
                            </span>
                            )
                        }
						<input
							type="password"
							placeholder="Password"
							name="password"
							onChange={handleChange}
							value={data.password}
							required
							className={styles.input}
						/>
                        {
                            validation.password && ( 
                            <span className={styles.error_msg}>
                             {validation.password}
                            </span>
                            )
                        }


						{error && <div className={styles.error_msg}>{error}</div>}
						{msg && <div className={styles.success_msg}>{msg}</div>}
                        {!validation.validForm && (
                            <span className={styles.error_msg}>
                                Please check the inputs again!
                            </span>
                            )
                        }
						<button type="submit" className={styles.green_btn}>
							Sign Up
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Signup;
