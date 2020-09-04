import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import {login} from "./../../api/auth"
import { errorNotify } from '../../utils/notifiactionCommon';
import {useDispatch} from 'react-redux'
import actions from '../../redux/actions'
import { useHistory } from 'react-router-dom';
import "./LoginPage.css";
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch()
  const onFinish = async formData => {
    try {
        var response = await login(formData);
        if(response.data.status.status === 200){
            if (response.data.data.token) {
                localStorage.setItem('accessToken', response.data.data.token)
                dispatch(actions.userActions.setUser(response.data.data.user))
                history.push('/cart');
              }
        }
    } catch (error) {
        errorNotify("Đăng nhập thất bại")   
    }
  };

  return (
    <div className="login-page">
      <div className="title-login">
        ĐĂNG NHẬP
      </div>
      <Form
        {...layout}
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập email',
            },{
              type: "email",
              message: 'Email không đúng định dạng vui lòng nhập lại',
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Login