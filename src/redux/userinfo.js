import { createSlice } from "@reduxjs/toolkit";

const initialUser = localStorage.getItem('aladin')
? JSON.parse(atob(localStorage.getItem('aladin')))
: null

export const userinfoSlice = createSlice({
    name:"userInfo",
    initialState:{
        uInfo:
        {
            userId: initialUser?.uInfo.userId || null,
            userName: initialUser?.uInfo.userName || null,
            userEmail: initialUser?.uInfo.userEmail || null,
            userImageUrl:initialUser?.uInfo.userImageUrl || null,
            userAccess_Token:initialUser?.uInfo.userAccess_Token || null
        },
        userIsLoggedIn: initialUser?.userIsLoggedIn || false,
        userTotalEmail:initialUser?.userTotalEmail || 0,
        userEmailInDB:initialUser?.userEmailInDB || 0
    },
    reducers:{
        genieLogIn: (state,action) =>{
            console.log('In User Info Reducer',action.payload);
            state.userIsLoggedIn = true;
            state.uInfo.userId = action.payload.user.id;
            state.uInfo.userName = action.payload.user.fullName;
            state.uInfo.userEmail = action.payload.user.email;
            state.uInfo.userImageUrl = action.payload.user.profilepicture;
            state.uInfo.userAccess_Token = action.payload.token;
            localStorage.setItem('aladin', btoa(JSON.stringify(state)));
        },
        genieLogOut: (state)=>{
            state.userIsLoggedIn = false;
            state.uInfo.userId = null;
            state.uInfo.userName = null;
            state.uInfo.userEmail = null;
            state.uInfo.userImageUrl = null;
            state.uInfo.userAccess_Token = null;
            state.userTotalEmail = 0;
            state.userEmailInDB = 0;
            localStorage.removeItem('aladin')
        },
        genieEmailpulled: (state,action) => {
            state.userTotalEmail = action.payload;
            localStorage.setItem('aladin', btoa(JSON.stringify(state)));
        },
        genieEmailDB: (state,action) => {
            state.userEmailInDB = action.payload;
            localStorage.setItem('aladin', btoa(JSON.stringify(state)));
        }
    }
});

export const { genieLogIn, genieLogOut,genieEmailpulled, genieEmailDB } = userinfoSlice.actions;

export default userinfoSlice.reducer
