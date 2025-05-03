import axios from "axios";
const api =  axios.create(
    {
        baseURL: "http://localhost:3000",
        timeout: 5000,
      }
)
api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );


  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        console.log("Unauthorized — redirecting to login...");
       
      }
      return Promise.reject(error);
    }
  )


  export const loginUser = async(data) =>
  {
    try {
        const result = await api.post("/auth/login",
            {
              email:data.email,
              password:data.password
          
            }
        )

        return result.data

    } catch (error) {
      throw error
    }
    
  }

    
  export const signup = async(data) =>
    {
      try {
          const result  = await  api.post("/auth/signup",
              
                {
                    email:data.email,
                    password:data.password
                
                }
              
              
          )
          return result.data
      } catch (error) {
          throw error
      }
    }



    export const verifyOtp = async(data) =>
        {
          try {
              const result  = await  api.post("/auth/verifyotp",
                  
                    {
                        email:data.email,
                        otp:data.otp
                    
                    }
                  
                  
              )

       
              return result.data
          } catch (error) {
      
              throw error
          }
        }



      