import React from 'react';
import {Form, Modal, Input, Button, notification} from 'antd';
import InputCurrency from '../../components/form/InputCurrent';
import { errorNotify } from '../../utils/notifiactionCommon';
import { updateUser } from '../../api/user';

const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      }
    },
    wrapperCol: {
      xs: {
        span: 24,
      }
    }
}; 
const tailFormItemLayout = {
wrapperCol: {
    xs: {
    span: 24,
    offset: 0,
    },
    sm: {
    span: 16,
    offset: 8,
    },
},
};
const EditUser = (props) => {
    const [form] = Form.useForm();
    const onFinish = async (infoUser) => {
        try {
            let body = {}
            if(infoUser.name !== props.user.name) body.name = infoUser.name;
            if(infoUser.email !== props.user.email) body.email = infoUser.email;
            if(infoUser.password !== props.user.password) body.password = infoUser.password;
            if(infoUser.commissionUser !== props.user.commissionUser) body.commissionUser = infoUser.commissionUser;
            const response = await updateUser(props.user.key, body);
            if (response.status === 200) {
                notification.success({
                    duration:2,
                    message: "Thành công",
                    description: 'Chỉnh sửa thông tin nhân viên thành công'
                });
                props.setIsUpdateUser(!props.isUpdateUser);
                props.setVisibleModalUpdate(false);
                form.resetFields();
            }
        } catch (err) {
            if (err) {
                errorNotify("Không thành công", "Chỉnh sửa thông tin nhân viên không thành công");   
            }
        }
    }
    const handleCancelEditUser = () => {
        props.setVisibleModalUpdate(false);
        form.resetFields();
      }
    return (
        <>
          <Modal
            title="Chỉnh sửa thông tin nhân viên"
            visible={props.visibleModalUpdate}
            onCancel={handleCancelEditUser}
            scrollToFirstError
            footer={null}
          >
            <Form
                {...formItemLayout}
                form={form}
                name="create_user"
                initialValues={{
                    prefix: '84',
                }}
                onFinish={onFinish}
                scrollToFirstError
            >
                <Form.Item
                    label="Nhập tên nhân viên"
                    labelAlign="left"
                    name="name"
                    hasFeedback
                    rules={[{
                    required: true,
                    message: 'Vui lòng nhập tên nhân viên'
                    }]}
                    className="form-item"
                    initialValue={props.user.name}
                >
                    <Input
                        type="text"
                        placeholder="nhập tên nhân viên"
                        allowClear
                    />
                </Form.Item>
                <Form.Item
                    label="Nhập email của nhân viên:"
                    labelAlign="left"
                    name="email"
                    hasFeedback
                    rules={[{
                        required: true, 
                        message: 'Vui lòng nhập email của nhân viên'
                    },{
                        type: 'email',
                        message: 'email không đúng định dạng'
                    }]}
                    className="form-item"
                    initialValue={props.user.email}
                >
                <Input
                    type="text"
                    placeholder="nhập email của nhân viên"
                    allowClear
                />
                </Form.Item>

                <Form.Item
                    label="Nhập mật khẩu:"
                    labelAlign="left"
                    name="password"
                    hasFeedback
                    className="form-item"
                >
                <Input
                    type="password"
                    placeholder="nhập mật khẩu của nhân viên"
                    allowClear
                    autoComplete="on"
                />
                </Form.Item>
                <InputCurrency placeholder="nhập hoa hồng của nhân viên" initialValue={props.user.commissionUser} label="Nhập hoa hồng của nhân viên:"  name="commissionUser"  className="form-item"  rules={[{required: true, message: 'Vui lòng nhập hoa hồng của nhân viên'}]}/>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit"  >
                        Xác nhận
                    </Button>
                    <Button type="warning" onClick={handleCancelEditUser} style={{ margin: '15px' }}>
                        Cancel
                    </Button>                   
                </Form.Item>
            </Form>
          </Modal>
        </>
      );
}
export default EditUser