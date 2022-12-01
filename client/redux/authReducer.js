import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";



export const registerUser = createAsyncThunk("api/users/registerUser",async (data)=>{
    const {fullName, email, password} = data

    const mydata = await axios.post("http://172.20.10.5:3000/api/users/register",{
        fullName:fullName,
        email:email,
        password:password
    })
    .then((response)=>{
        return response.data

    })
    .catch((err)=>{
        console.log(err)
        return {
            data : {success:false}
        }
    })

    return mydata

});


export const loginUser = createAsyncThunk("api/users/loginUser", async (data)=>{
    const {email, password} = data
    const mydata = await axios.post("http://172.20.10.5:3000/api/users/login",{
        email:email,
        password:password
    })
    .then(response =>{
        return response.data
    })
    .catch(err=>console.log(err))
    return mydata
    
});
const authReducer = createSlice({
    name: "auth",
    initialState: {
      data: [],
      loading: false,
    },
    extraReducers:(builder)=>{
        builder.addCase(registerUser.pending,(state,action)=>{
            state.loading = true
        }),
        builder.addCase(registerUser.fulfilled,(state,action)=>{
            state.loading = false
            state.data = action.payload
        }),
        builder.addCase(registerUser.rejected,(state,action)=>{
            state.loading = false
        }),
        builder.addCase(loginUser.pending,(state,action)=>{
            state.loading = true
        }),
        builder.addCase(loginUser.fulfilled,(state,action)=>{
            state.loading = false
            state.data = action.payload
    
           
        }),
        builder.addCase(loginUser.rejected,(state,action)=>{
            state.loading = false
        })
    
    
    }

  });
export default authReducer.reducer;