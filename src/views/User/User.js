
import React, { useState, useEffect } from 'react';
import { Table, Space, Popconfirm, Button, Form, Modal, Input, notification} from 'antd';
import { signup, getAllUser, deleteUser } from '../../api/user';
import BaseLayout from '../../components/BaseLayout/BaseLayout';
import { errorNotify } from '../../utils/notifiactionCommon';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import DetailCartUser from '../Cart/DetailCartUser';
import {    
    convertNumberToCurrency
} from "../../utils/currencyData";
import UpdateUser from './UpdateUser';
import  './user.css';
import InputCurrency from '../../components/form/InputCurrent';
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
const UserProfile = (props) => {
  const [form] = Form.useForm();
  const [visibleModal, setVisibleModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [dataSourceUser, setDataSourceUser] = useState([]);
  const [detailUser, setDetailUser] = useState({});
  const [isVisibleDetailUser, setIsVisibleDetailUser] = useState(false);
  const [isUpdateUser, setIsUpdateUser] = useState(false);
  const [visibleModalUpdate, setVisibleModalUpdate] = useState(false);
  const handleDataSourceUserAdmin= data => {
    return data.map((user, index) => {
      return {
          key: user._id,
          name: user.name,
          salary: user.salary,
          commissionUser: convertNumberToCurrency(user.commissionUser),   
          quantity: user.quantity,
          email: user.email
      }
    })
  }
  useEffect(()=>{
    const _initDataUser = async () => {
      try {
        setLoading(true);
        const response = await getAllUser();
        if(response.data.status.status === 200){
            setDataSourceUser(handleDataSourceUserAdmin(response.data.data));
        }
      }catch (error) {
          errorNotify("Lỗi", "Không thể lấy danh sách nhân viên");
      }finally{
        setLoading(false);
      }
    }
    _initDataUser();
  },[visibleModal, isUpdateUser]);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex)
  };
  const handleReset = clearFilters => {
    clearFilters();
    setSearchText("")
  };
  const getColumnSearch = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : "" }} />,
    onFilter: (value, record) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleDeleteAgency = async (idUser) => {
    try {
        let res = await deleteUser(idUser);
        if(res.status===200){
            const dataSourceUserCurrent = [...dataSourceUser];
            let dataSourceUserNew = dataSourceUserCurrent.filter((user) => user.key !== idUser)
            setDataSourceUser(dataSourceUserNew);
            notification.success({
                duration:2,
                message: "Thành công",
                description: 'Xoá người dùng thành công'
            });
        }
    } catch (error) {
        errorNotify("Lỗi", "Xóa người dùng không thành công");   
    }

  }
  const columns = [
      {
        title: 'Tên nhân viên',
        dataIndex: 'name',
        key: 'name',
        ...getColumnSearch("name"),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Hoa hồng',
        dataIndex: 'commissionUser',
        key: 'commissionUser',
      },
      {
        title: 'Lương',
        dataIndex: 'salary',
        key: 'salary',
      },
      {
        title: 'Số lượng',
        key: 'quantity',
        dataIndex: 'quantity',
      },
      {
        title: 'Hành động',
        key: 'action',
        render: (text, record) => (
          <>
            <Button onClick={()=>{
                setDetailUser(record);
                setIsVisibleDetailUser(!isVisibleDetailUser);
            }}>Xem thông tin</Button>
            <Button style={{marginLeft: 30}} onClick={()=>{
                setVisibleModalUpdate(true);
                setDetailUser(record);
            }}>Chỉnh sửa thông tin</Button>
            <Popconfirm  title="Bạn có chắc chắn muốn xóa" onConfirm={() => handleDeleteAgency(record.key)}>
              <Button style={{marginLeft: 30}}>Xóa người dùng</Button>
            </Popconfirm>
          </>
        ),
      },
  ];
  const handleAdd = () => {
    setVisibleModal(!visibleModal)
  };
  const handleCancelCreateUser = () => {
    setVisibleModal(!visibleModal);
    form.resetFields();
  }
  const onFinish = async (infoUser) => {
    try {
      const response = await signup(infoUser);
      if (response.status === 200) {
        notification.success({
          duration:2,
          message: "Thành công",
          description: 'Thêm mới nhân viên thành công'
        });
        setVisibleModal(!visibleModal);
        form.resetFields();
      }
    } catch (err) {
      if (err) {
        errorNotify("Lỗi", "Thêm mới nhân viên không thành công");   
      }
    }
  }
  const modalCreateUser = (
    <Modal
        title="Thêm nhân viên mới"
        visible={visibleModal}
        onCancel={handleCancelCreateUser}
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
            rules={[{
            required: true, 
            message: 'Vui lòng nhập mật khẩu'
            }]}
            className="form-item"
        >
          <Input
            type="password"
            placeholder="nhập mật khẩu của nhân viên"
            allowClear
            autoComplete="on"
          />
        </Form.Item>
        <InputCurrency placeholder="nhập hoa hồng của nhân viên"  label="Nhập hoa hồng của nhân viên:"  name="commissionUser"  className="form-item"  rules={[{required: true, message: 'Vui lòng nhập hoa hồng của nhân viên'}]}/>
        <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit"  style={{ margin: '15px' }}>
                Thêm nhân viên mới
            </Button>
            <Button type="warning" onClick={handleCancelCreateUser} >
                Cancel
            </Button>
        </Form.Item>
    </Form>
    </Modal>
  )

  return (
    <BaseLayout>
        <UpdateUser setIsUpdateUser={setIsUpdateUser} visibleModalUpdate={visibleModalUpdate} setVisibleModalUpdate={setVisibleModalUpdate} user={detailUser} isUpdateUser={isUpdateUser}/>
        { isVisibleDetailUser ?
            <DetailCartUser user={detailUser} isVisibleDetailUser={isVisibleDetailUser} setIsVisibleDetailUser={setIsVisibleDetailUser}/> :
            <div>
                {modalCreateUser}
                <div style={{width: "90%", margin: '30px auto'}}>
                    <Button
                    onClick={handleAdd}
                    type="primary"
                    >
                        Thêm mới nhân viên
                    </Button>
                    <Table
                        className="table"
                        bordered
                        dataSource={dataSourceUser}
                        columns={columns}
                        loading={loading}
                        pagination={{ pageSize: 10 }}
                    />
                </div>
            </div>
        }
    </BaseLayout>
  )
}
export default UserProfile;