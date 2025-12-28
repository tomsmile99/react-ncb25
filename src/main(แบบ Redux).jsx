import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/custom.css'
import App from './App'


import { legacy_createStore as createStore } from 'redux';
import { Provider } from 'react-redux'
//import { composeWithDevTools } from 'redux-devtools-extension' //ถ้าไม่ใช้ จะไม่เห็นข้อมูลใน Redux ปิดการเรียกใช้ตอนเอาขึ้น Production

import rootReducer from './reduxstore/index'

//สร้าง store
const store = createStore(rootReducer)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)

