import axios from "axios";
import { BASE_URL_API_PATH, X_KEY_API } from "./Api_Url"


export default axios.create({
    baseURL : BASE_URL_API_PATH,
    headers : {
      'Content-Type': 'application/json',
      'x-api-key' : X_KEY_API,
    }
})

