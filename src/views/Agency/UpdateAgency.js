import React from 'react';
import {Form, Modal, Input, Button, notification} from 'antd';
import InputCurrency from '../../components/form/InputCurrent';
import { errorNotify } from '../../utils/notifiactionCommon';
import { updateAgency } from '../../api/agency';

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
const UpdateAgency = (props) => {
    const [form] = Form.useForm();
    const onFinish = async (infoAgency) => {
        try {
            let body = {}
            if(infoAgency.name !== props.agency.name) body.name = infoAgency.name;
            if(infoAgency.commissionAgency !== props.agency.commissionAgency) body.commissionAgency = infoAgency.commissionAgency;
            const response = await updateAgency(props.agency.key, body);
            if (response.status === 200) {
                notification.success({
                    duration:2,
                    message: "Thành công",
                    description: 'Chỉnh sửa thông tin đại lí thành công'
                });
                props.setIsUpdateAgency(!props.isUpdateAgency);
                props.setVisibleModalUpdate(false);
                form.resetFields();
            }
        } catch (err) {
            if (err) {
                errorNotify("Không thành công", "Chỉnh sửa thông tin đại lí không thành công");   
            }
        }
    }
    const handleCancelUpdateAgency = () => {
        props.setVisibleModalUpdate(false);
        form.resetFields();
      }
    return (
        <>
          <Modal
            title="Chỉnh sửa thông tin đại lí"
            visible={props.visibleModalUpdate}
            onCancel={handleCancelUpdateAgency}
            scrollToFirstError
            footer={null}
          >
            <Form
                {...formItemLayout}
                form={form}
                name="Chỉnh sửa thông tin đại lí"
                initialValues={{
                    prefix: '84',
                }}
                onFinish={onFinish}
                scrollToFirstError
            >
                <Form.Item
                    label="Nhập tên đại lí:"
                    labelAlign="left"
                    name="name"
                    hasFeedback
                    rules={[{required: true, message: 'Vui lòng nhập tên đại lí'}]}
                    initialValue={props.agency.name}
                >
                    <Input
                        type="text"
                        placeholder="nhập tên đại lí"
                        allowClear
                    />
                </Form.Item>
                <InputCurrency 
                    placeholder="nhập hoa hồng của đại lí" 
                    label="Nhập hoa hồng của đại lí:"  
                    name="commissionAgency"  
                    className="form-item"   
                    rules={[{required: true, message: 'Vui lòng nhập hoa hồng của đại lí dưới dạng số'}]}
                    initialValue={props.agency.commissionAgency}
                />
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit"  >
                        Xác nhận
                    </Button>
                    <Button type="warning" onClick={handleCancelUpdateAgency} style={{ margin: '15px' }}>
                        Cancel
                    </Button>                   
                </Form.Item>
            </Form>
          </Modal>
        </>
      );
}
export default UpdateAgency