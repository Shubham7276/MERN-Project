import axios from "axios"


class AuthenticationService {
	API = "http://localhost:8080"

	signin = async (username, password) => {
		try {
			return axios
			.post(`${this.API}/api/auth/signin`, { username, password })
			.then((response) => {
				if (!response.error) {
					if (response.data) {
						
						localStorage.setItem("user", JSON.stringify(response.data))
						
						}
						return response.data
					} else {
						return response.error
					}
				})
				.catch((err) => {
					console.log(err)
					throw err
				})
		} catch (err) {
			console.log(err)
		}
	}

	signOut() {
		localStorage.removeItem("user")
	}

	register = async (firstname, lastname, username, email, password) => {
		return axios.post(`${this.API}/api/auth/signup`, {
			firstname,
			lastname,
			username,
			email,
			password,
		})
	} 

	getCurrentUser() {
		try {
			return JSON.parse(localStorage.getItem('user') || '');
		} catch (error) {
			return null;
		}
		
	}

	//ticket

	addticket=async(Uname,CreatedDate,Email,desc)=>{
		console.log(Uname,CreatedDate,Email,desc)
		return axios.post(`${this.API}/api/ticket/addticket`,{
			Uname,
			CreatedDate,
			Email,
			desc
		})

	}

	getticket = async() => {
		
	 return await axios.get(`${this.API}/api/ticket/getticket`);
	}

	updateTicket = async(id,UpdateDate,desc)=>{
		return axios.put(`${this.API}/api/ticket/${id}`,{UpdateDate,desc})
	}

	delTicket=async(id,DeleteDate,isDelete)=>{
		
		return axios.put(`${this.API}/api/ticket/del/${id}`,{DeleteDate,isDelete})
	}

	getTicketbyId=(id)=>{
		return axios.get(`${this.API}/api/ticket/${id}`)
	}

}




export default new AuthenticationService()
