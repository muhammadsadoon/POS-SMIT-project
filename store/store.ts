import {configureStore} from "@reduxjs/toolkit"
import combineR from "./reducers/reducers"

const store = configureStore({
    reducer : combineR
})

export default store