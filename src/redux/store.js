import { configureStore } from "@reduxjs/toolkit";
import  userReducer  from "./features/user.slice";
import  {videoReducer}  from "./features/video.slice";
import commentReducer from "./features/comments.slice"
import recommendationReducer from './features/recommendation.slice';
import notificationReducer from './features/notification.slice'
const store = configureStore({
    reducer:{
        user:userReducer,
        video:videoReducer,
        comments:commentReducer,
        recommendations: recommendationReducer,
        notifications: notificationReducer
    }
})

export default store