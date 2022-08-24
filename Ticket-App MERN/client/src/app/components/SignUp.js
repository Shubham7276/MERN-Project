import React, { Component } from 'react';
import AppNavbar from './AppNavbar';
import { Container } from 'reactstrap';
import {  Form, FormGroup, Row, Col } from "reactstrap";
import { Alert } from "react-bootstrap"
import {TextField, Button} from '@mui/material';
import img6 from '../photos/img6.jpg'
import Authentication from '../services/AuthenticationService'

const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
const validName = RegExp('^[a-zA-Z ]+$')

const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach(
    (val) => val.length > 0 && (valid = false)
  );
  return valid;
}

class SignUp extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
      message: "",
      successful: false,
      validForm: true,
      errors: {
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: ''
      }
    };
  }

  changeHandler = (event) => {
    const { name, value } = event.target;
  
    let errors = this.state.errors;

    switch (name) {
      case 'firstname':
        errors.firstname = 
        validName.test(value)
            ? ''
            : 'FirstName must be use only characters!';
        break;
      case 'lastname':
        errors.lastname = 
        validName.test(value)
            ? ''
            : 'Last Name must be use only characters!';
        break;
      case 'username':
        errors.username = 
          value.length < 5
            ? 'Username must be 5 characters long!'
            : '';
        break;
      case 'email': 
        errors.email = 
          validEmailRegex.test(value)
            ? ''
            : 'Email is not valid!';
        break;
      case 'password': 
        errors.password = 
          value.length < 8
            ? 'Password must be 8 characters long!'
            : '';
        break;
      default:
        break;
    }
  
    this.setState({errors, [name]: value}, ()=> {
        console.log(errors)
    })  
  }

  signUp = (e) => {
    e.preventDefault();
    const valid = validateForm(this.state.errors);
    this.setState({validForm: valid});
    if(valid){
      Authentication.register(
        this.state.firstname,
        this.state.lastname,
        this.state.username,
        this.state.email,
        this.state.password
      ).then(
        response => {
          this.setState({
            message: response.data.message,
            successful: true
          });
          this.props.history.push('/signin');
        },
        error => {
          console.log("Already Exist user Email!");
          
          this.setState({
            successful: false,
            message: "Already Exist user Email!"
          });
        }
      );  
    }
  }

  render() {
    const title = <h2 style={{textAlign:"center"}}>Register User</h2>;
    const errors = this.state.errors;

    let alert = "";

    if(this.state.message){
      if(this.state.successful){
        alert = (
                  <Alert variant="success">
                    {this.state.message}
                  </Alert>
                );
      }else{
        alert = (
                  <Alert variant="danger">
                    {this.state.message}
                  </Alert>
                );
      }
    }
    

    return ( 
      <div>
        <AppNavbar/>
        <Container fluid>
          <Row>
          <Col style={{marginTop:"95px"}} sm="6" md={{ size: 3, offset: 2 }}>
          {title}
            <Form onSubmit={this.signUp}>
              <FormGroup controlId="forFirstname">
                <TextField 
                      required
                      fullWidth={true}
                      id="fullWidth"
                      
                      label="FirstName"
                      name="firstname"
                      value={this.state.firstname}
                      onChange={this.changeHandler}
                      type="text"
                      variant="standard"
                />
                {
                  errors.firstname && ( 
                      <Alert variant="danger">
                        {errors.firstname}
                      </Alert>
                    )
                }
              </FormGroup>

              <FormGroup controlId="forLastname">
              <TextField required
                      fullWidth={true}
                      id="fullWidth"
                      label="LastName"
                      name="lastname"
                      value={this.state.lastname}
                      onChange={this.changeHandler}
                      type="text"
                      variant="standard"
                />
                {
                  errors.lastname && ( 
                      <Alert variant="danger">
                        {errors.lastname}
                      </Alert>
                    )
                }
              </FormGroup>

              <FormGroup controlId="forUsername">
                <TextField required
                      fullWidth={true} 
                      id="fullWidth"
                      label="UserName"
                      name="username"
                      value={this.state.username}
                      onChange={this.changeHandler}
                      type="text"
                      variant="standard"
                />
                 
                {
                  errors.username && ( 
                      <Alert variant="danger">
                        {errors.username}
                      </Alert>
                    )
                }
              </FormGroup>

              <FormGroup controlId="formEmail">

                <TextField required
                      fullWidth={true}
                      id="fullWidth"
                      label="Email"
                      name="email"
                      value={this.state.email}
                      onChange={this.changeHandler}
                      type="text"
                      variant="standard"
                />
                {
                  errors.email && ( 
                      <Alert variant="danger">
                        {errors.email}
                      </Alert>
                    )
                }
              </FormGroup>

              <FormGroup controlId="formPassword">
            
                <TextField required
                      fullWidth={true}
                      id="fullWidth"
                      label="Password"
                      name="password"
                      value={this.state.password}
                      onChange={this.changeHandler}
                      type="password"
                      variant="standard"
                />
                {
                  errors.password && ( 
                      <Alert key="errorspassword" variant="danger">
                        {errors.password}
                      </Alert>
                    )
                }
              </FormGroup>
              <Button sx={{ mt: 3, mb: 2 }} fullWidth={true} variant="contained" type="submit" size="lg">Register</Button>
              {
                !this.state.validForm && (
                  <Alert key="validForm" variant="danger">
                    Please check the inputs again!
                  </Alert>
                )
              }

              {alert}
              
            </Form>
            </Col >

            <Col style={{marginTop:"95px"}} sm='6' md={{size:4,offset:1}}>

              <img className='signin' src={img6} alt="Logo" />
              
              </Col>

          </Row>
          
        </Container>
      </div>);
  }
}

export default SignUp;