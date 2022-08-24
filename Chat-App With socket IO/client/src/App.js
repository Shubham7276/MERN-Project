import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main/Main";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import EmailVerify from "./components/EmailVerify";
import Emailtemp  from "./components/Emailtemp";
import 'react-toastify/dist/ReactToastify.css';




function App() {
	const user = localStorage.getItem("token");

	return (
		

		<Routes>
			{user && <Route path="/" exact element={<Main />} />}
			{user && <Route path="/signup" element={<Navigate replace to="/" />} />}
			{user && <Route path="/login" element={<Navigate replace to="/" />} />}
			{user && <Route path="/*" element={<Navigate replace to="/" />} />}
			<Route path="/signup" exact element={<Signup />} />
			<Route path="/login" exact element={<Login />} />
			<Route path="/" element={<Navigate replace to="/login" />} />
			<Route path="/api/auth/:id/verify/:token" element={<EmailVerify />} />
			<Route path="/temp" exact element={<Emailtemp />} />
			


			
		</Routes>
	);
}

export default App;
