
import React, { useState, useEffect } from 'react';
import { Table, Space, Popconfirm, Button, Form, Modal, Input, notification} from 'antd';
import { createAgency, getAllAgency, deleteAgency } from '../../api/agency';
import BaseLayout from '../../components/BaseLayout/BaseLayout';
import { errorNotify } from '../../utils/notifiactionCommon';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import {    
    convertNumberToCurrency 
} from "../../utils/currencyData"
import InputCurrency from '../../components/form/InputCurrent';
import UpdateAgency from './UpdateAgency';
import DetailCartAgency from './DetailCartAgency';
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
const Agency = (props) => {
  const [form] = Form.useForm();
  const [visibleModal, setVisibleModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [dataSourceAgency, setDataSourceAgency] = useState([]);
  const [isUpdateAgency, setIsUpdateAgency] = useState(false);
  const [visibleModalUpdate, setVisibleModalUpdate] = useState(false);
  const [detailAgency, setDetailAgency] = useState({});
  const [isVisibleDetailAgency, setIsVisibleDetailAgency] = useState(false);
  const handleDataSourceAgencyAdmin= data => {
    return data.map((agency, index) => {
      return {
          key: agency._id,
          name: agency.name,
          commissionAgency: convertNumberToCurrency(agency.commissionAgency),   
          credit: agency.credit,
          debit: agency.debit,
      }
    })
  }
  useEffect(()=>{
    const _initDataAgency = async () => {
      try {
        setLoading(true);
        const response = await getAllAgency();
        if(response.data.status.status === 200){
            setDataSourceAgency(handleDataSourceAgencyAdmin(response.data.data));
        }
      }catch (error) {
          errorNotify("Không thành công", "Không thể lấy danh sách đại lí");
      }finally{
        setLoading(false);
      }
    }
    _initDataAgency();
  },[visibleModal, isUpdateAgency]);
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

  const handleDeleteAgency = async (idAgency) => {
    try {
        let res = await deleteAgency(idAgency);
        if(res.status===200){
            const dataSourceAgencyCurrent = [...dataSourceAgency];
            let dataSourceAgencyNew = dataSourceAgencyCurrent.filter((agency) => agency.key !== idAgency)
            setDataSourceAgency(dataSourceAgencyNew);
            notification.success({
                duration:2,
                message: "Thành công",
                description: 'Xoá đại lí thành công'
            });
        }
    } catch (error) {
        errorNotify("Không thành công", "Xóa đại lí không thành công");   
    }

  }
  const columns = [
      {
        title: 'Tên đại lí',
        dataIndex: 'name',
        key: 'name',
        ...getColumnSearch("name"),
      },
      {
        title: 'Hoa hồng',
        dataIndex: 'commissionAgency',
        key: 'commissionAgency',
      },
      {
        title: 'Nợ',
        dataIndex: 'credit',
        key: 'credit',
      },
      {
        title: 'Công',
        key: 'debit',
        dataIndex: 'debit',
      },
      {
        title: 'Hành động',
        key: 'action',
        render: (text, record) => (
          <>
            <Button onClick={()=>{
              setVisibleModalUpdate(true);
              setDetailAgency(record)
            }}>Chỉnh sửa thông tin đại lí</Button>
            <Button onClick={()=>{
              setDetailAgency(record)
              setIsVisibleDetailAgency(true);
            }} style={{marginLeft: "15px"}}>Xem thông tin đại lí</Button>
            <Popconfirm title="Bạn có chắc chắn muốn xóa" onConfirm={() => handleDeleteAgency(record.key)}>
              <Button style={{marginLeft: "15px"}}>Xóa đại lí</Button>
            </Popconfirm>
          </>
        ),
      },
  ];
  const handleAdd = () => {
    setVisibleModel(!visibleModal)
  };
  const handleCancelCreateUser = () => {
    setVisibleModel(!visibleModal);
    form.resetFields();
  }
  const onFinish = async (infoAgency) => {
    try {
      const response = await createAgency(infoAgency);
      if (response.status === 200) {
        notification.success({
          duration:2,
          message: "Thành công",
          description: 'Tạo đại lí thành công'
        });
        setVisibleModel(!visibleModal);
        form.resetFields();
      }
    } catch (err) {
      if (err) {
        errorNotify("Không thành công", "Tạo đại lí không thành công");   
      }
    }
  }

  const templateAddAgency = (
    <Modal
            title="Thêm đại lí"
            visible={visibleModal}
            onCancel={handleCancelCreateUser}
            scrollToFirstError
            footer={null}
            >
            <Form
                {...formItemLayout}
                form={form}
                name="normal_login"
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
                />
                <Form.Item {...tailFormItemLayout}>
                    <Button type="warning" onClick={handleCancelCreateUser} style={{ marginRight: '10px' }}>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit"  >
                        Tạo đại lí
                    </Button>
                </Form.Item>
            </Form>
          </Modal>
  )


  return (
    <BaseLayout>
        <UpdateAgency setIsUpdateAgency={setIsUpdateAgency} visibleModalUpdate={visibleModalUpdate} setVisibleModalUpdate={setVisibleModalUpdate} agency={detailAgency} isUpdateAgency={isUpdateAgency}/>
        {templateAddAgency}
       
        {
          isVisibleDetailAgency ?  <DetailCartAgency agency={detailAgency} isVisibleDetailAgency={isVisibleDetailAgency} setIsVisibleDetailAgency={setIsVisibleDetailAgency}/> : 
          <div style={{width: "90%", margin: '30px auto'}}>
                <Button
                onClick={handleAdd}
                type="primary"
                style={{margin: '0 auto'}}
                >
                    Thêm đại lí
                </Button>
                <Table
                    className="table"
                    bordered
                    dataSource={dataSourceAgency}
                    columns={columns}
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </div>
        }
           
    </BaseLayout>
  )
}
export default Agency;