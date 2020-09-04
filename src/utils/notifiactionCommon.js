import React from 'react';
import {notification} from 'antd';

export const errorNotify =  (err, message, duration = 1)=>{
  notification.error({
    duration:duration,
    message: message || "Không thành công",
    description: (err.response && err.response.data && err.response.data.message) || "Không thể kết nối server"
  }) 
}


export const errorNotifyWithArrayDes =  (message, arrayDes = [], duration = 1)=>{
  notification.error({
    duration:duration,
    message: message || "Không thành công",
    description: <div>{arrayDes.map((info, index)=>{
      return <div key={'error' + index}>{info}</div>
    })}</div>
  }) 
}

export const successNotifyWithArrayDes =  (message, arrayDes = [], duration = 1)=>{
  notification.success({
    duration:duration,
    message: message || "Không thành công",
    description: <div>{arrayDes.map((info, index)=>{
      return <div key={'error' + index}>{info}</div>
    })}</div>
  }) 
}