import { createSlice } from "@reduxjs/toolkit";

const initialUser = localStorage.getItem('aladin')
? JSON.parse(atob(localStorage.getItem('aladin')))
: null

export const userinfoSlice = createSlice({
    name:"userInfo",
    initialState:{
        uInfo:
        {
            userName: initialUser?.uInfo.userName || null,
            userEmail: initialUser?.uInfo.userEmail || null,
            userImageUrl:initialUser?.uInfo.userImageUrl || null,
            userAccess_Token:initialUser?.uInfo.userAccess_Token || null
        },
        userIsLoggedIn: initialUser?.userIsLoggedIn || false,
        userTotalEmail:initialUser?.userEmailpulled || 0
    },
    reducers:{
        genieLogIn: (state,action) =>{
            // console.log(action.payload);
            state.userIsLoggedIn = true;
            state.uInfo.userName = action.payload.profileObj.name;
            state.uInfo.userEmail = action.payload.profileObj.email;
            state.uInfo.userImageUrl = action.payload.profileObj.imageUrl;
            state.uInfo.userAccess_Token = action.payload.accessToken;
            localStorage.setItem('aladin', btoa(JSON.stringify(state)));
        },
        genieLogOut: (state)=>{
            state.userIsLoggedIn = false;
            state.uInfo.userName = null;
            state.uInfo.userEmail = null;
            state.uInfo.userImageUrl = null;
            state.uInfo.userAccess_Token = null;
            state.userTotalEmail = 0;
            localStorage.removeItem('aladin')
        },
        genieEmailpulled: (state,action) => {
            state.userTotalEmail = action.payload;
            localStorage.setItem('aladin', btoa(JSON.stringify(state)));
        }
    }
});

export const { genieLogIn, genieLogOut,genieEmailpulled } = userinfoSlice.actions;

export default userinfoSlice.reducer
