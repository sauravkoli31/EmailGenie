import { configureStore } from "@reduxjs/toolkit"
import userinfoReducer from "./userinfo"
import emailIdReducer from "./emailId"

export default configureStore({
    reducer: {
        userInfo:userinfoReducer,
        emailId:emailIdReducer
    }
})