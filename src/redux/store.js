import { configureStore } from "@reduxjs/toolkit";
import  userReducer  from "./features/user.slice";
import  {videoReducer}  from "./features/video.slice";
import commentReducer from "./features/comments.slice"
const store = configureStore({
    reducer:{
        user:userReducer,
        video:videoReducer,
        comments:commentReducer
    }
})

export default store