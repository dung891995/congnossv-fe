
import React, { useState, useEffect } from 'react';
import {useSelector} from 'react-redux'
import { 
  Button, 
  Form, 
  Modal, 
  Input, 
  notification, 
  Select, 
  Spin, 
  Row, 
  Col, 
  Divider,
  Popconfirm,
  Space, 
  DatePicker,
  Typography,
  Table
} from 'antd';
import { getAllAgency } from '../../api/agency';
import { createCartDirect, createCartAgencyDelivery,  getAllCartOfUser, updateNoteCartOfUser, updateStatusSuccessCart, updateStatusFailCart, paySalaryUser, searchCartOfUserFollowTime} from '../../api/cart';
import BaseLayout from '../../components/BaseLayout/BaseLayout';
import { errorNotify } from '../../utils/notifiactionCommon';
import InputCurrency from '../../components/form/InputCurrent';
import "./Cart.css"
import {CheckCircleOutlined, CloseCircleOutlined, SearchOutlined  } from "@ant-design/icons" 
import moment from 'moment';
import {    
    convertNumberToCurrency,
    convertCurrencyToNumber
} from "../../utils/currencyData";
import Highlighter from 'react-highlight-words';
import {handleDate} from "../../utils/handleDate";
const { Paragraph } = Typography;
const { Option } = Select;
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
const Cart = (props) => {
  const [form] = Form.useForm();
  const [visibleModal, setVisibleModel] = useState(false);
  const [visibleModalCartAgencyDelivery, setVisibleModelAgencyDelivery] = useState(false);
  const [listAgency, setListAgency] = useState([]);
  const [idAgency, setIdAgency] = useState("");
  let [dataTableCartUser, setDataTableCartUser] = useState([]);
  let [loading, setLoading] = useState(false);
  let [isNoteOfUser, setIsNoteOfUser] = useState(false);
  let [isUpdateStatusCart, setIsUpdateStatusCart] = useState(false);
  let [timeSearchStart, setTimeSearchStart] = useState(0);
  let [timeSearchEnd, setTimeSearchEnd] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [resetSearch, setResetSearch] = useState(false);
  const userData = useSelector(state => state.userReducer);
  const [cartUser, setCartUser] = useState([]);
  let [isCreatedCart, setIsCreatedCart] = useState(false)

//hiển thị thông tin đơn hàng
useEffect(() => {
  const _getCartUser = async () => {
      try {
          let response = await getAllCartOfUser(userData._id);
          if(response.data.status.status === 200){
              setDataTableCartUser(DataSourceCart(response.data.data));
              setCartUser(response.data.data)
          }
      } catch (error) {
          errorNotify("Không thành công", "Hiển thị đơn hàng không thành công")
      }
  }
  _getCartUser();
}, [isNoteOfUser, isUpdateStatusCart, resetSearch, userData._id, isCreatedCart])
  const DataSourceCart = data => {
    return data.map((cart, index) => {
      return {
          key: cart._id,
          stt: index + 1,
          timeFrom: moment(cart.createdAt).format("DD/MM/YYYY")+" "+ moment(cart.createdAt).format("hh:mm a"),
          timeTo: cart.updatedAt ? moment(cart.updatedAt).format("DD/MM/YYYY")+" "+ moment(cart.updatedAt).format("hh:mm a") : null,
          agency: cart.idAgency.name,
          sim: cart.sim,
          entryPrice: convertNumberToCurrency(cart.entryPrice),
          price: convertNumberToCurrency(cart.price),
          fee: convertNumberToCurrency(cart.fee),
          agencySupport: convertNumberToCurrency(cart.agencySupport),
          khachHoTro: convertNumberToCurrency(cart.khachHoTro),
          feeIfFalse: convertNumberToCurrency(cart.feeIfFalse),
          salaryThisCart: convertNumberToCurrency(cart.salaryThisCart),
          note: cart.note,
          status: cart.status,
          typeTrade: cart.typeTrade
      }
    })
  }
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
  const columnsAdmin = [
      {
        title: 'STT',
        dataIndex: 'stt',
        key: 'stt',
      },
      {
        title: 'Tên đại lí',
        dataIndex: 'agency',
        key: 'agency',
        ...getColumnSearch("agency"),
      },
      {
        title: 'Số sim',
        dataIndex: 'sim',
        key: 'sim',
        ...getColumnSearch("sim"),
      },
      {
        title: 'Giá nhập',
        key: 'entryPrice',
        dataIndex: 'entryPrice',
      },
      {
          title: 'Giá bán',
          key: 'price',
          dataIndex: 'price',
      },
      {
          title: 'Phí giao hàng',
          key: 'fee',
          dataIndex: 'fee',
      },
      {
          title: 'Đại lí hỗ trợ',
          key: 'agencySupport',
          dataIndex: 'agencySupport',
      },
      {
          title: 'Khách hỗ trợ',
          key: 'khachHoTro',
          dataIndex: 'khachHoTro',
      },
      {
          title: 'Chi phí nếu thất bại',
          key: 'feeIfFalse',
          dataIndex: 'feeIfFalse',
      },
      {
          title: 'Lương nhân viên',
          key: 'salaryThisCart',
          dataIndex: 'salaryThisCart',
      },
      {
          title: 'Loại đơn hàng',
          key: 'typeTrade',
          dataIndex: 'typeTrade',
          render: (text, record) => (
              <p>
                  {record.typeTrade === "giaotructiep" ? 'giao trực tiếp' : "đại lí giao"}
              </p>
          )
      },
      {
          title: 'Thời gian tạo đơn hàng',
          key: 'timeFrom',
          dataIndex: 'timeFrom',
      },
      {
          title: 'Thời gian đơn hàng hoàn thành',
          key: 'timeTo',
          dataIndex: 'timeTo',
      },
      {
        title: 'Ghi chú',
        key: 'note',
        dataIndex: 'note',
        render: (text, record) => (
          <>
            <Paragraph editable={{ onChange: (note)=>{
              let body = {}
              body.note = note
              setLoading(true)
              updateNoteCartOfUser(record.key, body).then(function(result){
                  if(result.data.status.status === 200){
                      setLoading(false);
                      setIsNoteOfUser(!isNoteOfUser);
                      notification.success({
                          duration:2,
                          message: "Thành công",
                          description: 'Thêm ghi chú thành công'
                      });
                  }
              }).catch(function(data){
                  setLoading(false);
                  errorNotify("Không thành công", "Thêm ghi chú không thành công");   
              })
            } }}>{record.note}</Paragraph>
          </>
        ),
      },
      {
          title: 'Trạng thái',
          key: 'note',
          render: (text, record) => (
            <>
            {
              templateStatusCart(record)
            }
            </>
          ),
        },
  ];
  const columnsUser = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
    },
    {
      title: 'Tên đại lí',
      dataIndex: 'agency',
      key: 'agency',
      ...getColumnSearch("agency"),
    },
    {
      title: 'Số sim',
      dataIndex: 'sim',
      key: 'sim',
      ...getColumnSearch("sim"),
    },
    {
        title: 'Giá bán',
        key: 'price',
        dataIndex: 'price',
    },
    {
        title: 'Phí giao hàng',
        key: 'fee',
        dataIndex: 'fee',
    },
    {
        title: 'Đại lí hỗ trợ',
        key: 'agencySupport',
        dataIndex: 'agencySupport',
    },
    {
        title: 'Khách hỗ trợ',
        key: 'khachHoTro',
        dataIndex: 'khachHoTro',
    },
    {
        title: 'Chi phí nếu thất bại',
        key: 'feeIfFalse',
        dataIndex: 'feeIfFalse',
    },
    {
        title: 'Lương nhân viên',
        key: 'salaryThisCart',
        dataIndex: 'salaryThisCart',
    },
    {
        title: 'Loại đơn hàng',
        key: 'typeTrade',
        dataIndex: 'typeTrade',
        render: (text, record) => (
            <p>
                {record.typeTrade === "giaotructiep" ? 'giao trực tiếp' : "đại lí giao"}
            </p>
        )
    },
    {
        title: 'Thời gian tạo đơn hàng',
        key: 'timeFrom',
        dataIndex: 'timeFrom',
    },
    {
        title: 'Thời gian đơn hàng hoàn thành',
        key: 'timeTo',
        dataIndex: 'timeTo',
    },
    {
      title: 'Ghi chú',
      key: 'note',
      dataIndex: 'note',
      render: (text, record) => (
        <>
          <Paragraph editable={{ onChange: (note)=>{
            let body = {}
            body.note = note
            setLoading(true)
            updateNoteCartOfUser(record.key, body).then(function(result){
                if(result.data.status.status === 200){
                    setLoading(false);
                    setIsNoteOfUser(!isNoteOfUser);
                    notification.success({
                        duration:2,
                        message: "Thành công",
                        description: 'Thêm ghi chú thành công'
                    });
                }
            }).catch(function(data){
                setLoading(false);
                errorNotify("Không thành công", "Thêm ghi chú không thành công");   
            })
          } }}>{record.note}</Paragraph>
        </>
      ),
    },
    {
        title: 'Trạng thái',
        key: 'note',
        render: (text, record) => (
          <>
          {
            templateStatusCart(record)
          }
          </>
        ),
      },
  ];
  const templateStatusCart = (record) => {
    switch(record.status){
        case "pending": 
            return  <>
                        <Popconfirm title="Bạn có đồng ý xác nhận đơn hàng" onConfirm={() => handleUpdateSuccessCart(record.key)}>
                            <Button>Thành công</Button>
                        </Popconfirm>
                        <Popconfirm title="Bạn có đồng ý xác nhận đơn hàng" onConfirm={() => handleUpdateFailCart(record.key)}>
                            <Button style={{marginLeft: 20}}>Thất bại</Button>
                        </Popconfirm>
                    </>
        case "success":
            return <CheckCircleOutlined style={{color : "green", fontSize: "20px"}}/>
        case "fail": 
            return <CloseCircleOutlined style={{color : "red", fontSize: "20px"}}/>
    }
  }
  const handleUpdateSuccessCart = async (idCart) => {
    setLoading(true);
    try {
        let res = await  updateStatusSuccessCart(idCart);
        if(res.data.status.status===200){
            notification.success({
                duration:2,
                message: "Thành công",
                description: 'Cập nhật trạng thái đơn hàng thành công'
            });
            setIsUpdateStatusCart(!isUpdateStatusCart)
        }
        setLoading(false);
    } catch (error) {
        errorNotify("Không thành công", "Cập nhật trạng thái đơn hàng không thành công");
        setLoading(false);
    }
}
const handleUpdateFailCart = async (idCart) =>{
    setLoading(true);
    try {
        let res = await  updateStatusFailCart(idCart);
        if(res.data.status.status===200){
            notification.success({
                duration:2,
                message: "Thành công",
                description: 'Cập nhật trạng thái đơn hàng thành công'
            });
            setIsUpdateStatusCart(!isUpdateStatusCart)
        }
        setLoading(false);
    } catch (error) {
        errorNotify("Không thành công", "Cập nhật trạng thái đơn hàng không thành công");
        setLoading(false);
    }
}
const searchCartFollowTime = async () => {
  try {
      let condition = {};
      if(timeSearchStart ){
          let date = handleDate(timeSearchStart);
          condition.timeSearchStart = new Date(date.year, (Number(date.month)-1), date.day).getTime();
      }else{
          let dateStart = new Date("2000","01","01");
          condition.timeSearchStart = dateStart.getTime();
      }
      if(timeSearchEnd){
          let date = handleDate(timeSearchEnd);
          condition.timeSearchEnd = new Date(date.year, (Number(date.month)-1), date.day).getTime();
      }else{
          let dateEnd = new Date("2100", "01", "01");
          condition.timeSearchEnd = dateEnd.getTime();
      }
      condition.idUser = userData._id;
      let res = await searchCartOfUserFollowTime(condition);
      if(res.data.status.status === 200){
          setDataTableCartUser(DataSourceCart(res.data.data));
      }
  } catch (error) {
      errorNotify("Không thành công", "Tìm kiếm đơn hàng không thành công")
  }
}
const resetSearchCartFollowTime = () => {
  setTimeSearchStart(0)
  setTimeSearchEnd(0);
  setResetSearch(!resetSearch)
}

const totalSalaryUser = (salary) => {
  let total = salary.reduce((totalSalary, salaryItem)=>{
      return totalSalary + convertCurrencyToNumber(salaryItem.salaryThisCart)
  }, 0);
  return total
}

//tạo đơn hàng
  //hiển thị danh sách đại lí
  useEffect(() => {
    let _initListAgency = async () => {
      try {
        setLoading(true)
        let res = await getAllAgency();
        if(res.data.status.status === 200){
          setListAgency(res.data.data);
        }
      } catch (error) {
        errorNotify("Không thành công", "Lấy danh sách đại lí không thành công")
      }finally{
        setLoading(false)
      }
    }
    _initListAgency();
  },[])

  const handleAdd = () => {
    setVisibleModel(true)
  };
  const handleCancelCreateCart = () => {
    setVisibleModel(false);
    setVisibleModelAgencyDelivery(false)
    form.resetFields();
  }
  const onFinishCreateCartDirect = async (infoAgency) => {
    try {
      setLoading(true);
      infoAgency.idAgency = idAgency;
      const response = await createCartDirect(infoAgency);
      if (response.status === 200) {
        notification.success({
          duration:2,
          message: "Thành công",
          description: 'Tạo đơn hàng thành công'
        });
        setVisibleModel(false);
        setIsCreatedCart(!isCreatedCart)
        form.resetFields();
      }
    } catch (err) {
      if (err) {
        errorNotify("Không thành công", "Tạo đại lí không thành công");   
      }
    }finally{
      setLoading(false)
    }
  }

  const onFinishCreateCartDelivery = async (infoAgency) => {
    try {
      setLoading(true)
      infoAgency.idAgency = idAgency;
      const response = await createCartAgencyDelivery(infoAgency);
      if (response.status === 200) {
        notification.success({
          duration:2,
          message: "Thành công",
          description: 'Tạo đơn hàng thành công'
        });
        setVisibleModelAgencyDelivery(false);
        setIsCreatedCart(!isCreatedCart)
        form.resetFields();
      }
    } catch (err) {
      if (err) {
        errorNotify("Không thành công", "Tạo đại lí không thành công");   
      }
    }finally{
      setLoading(false)
    }
  }

  const onChangeCreateAgency = (agency) => {
    setIdAgency(agency);
  }


  const modalCreateAgencyDirect = (
    <Modal
      title="Tạo đơn hàng giao trực tiếp"
      visible={visibleModal}
      onCancel={handleCancelCreateCart}
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
          onFinish={onFinishCreateCartDirect}
          scrollToFirstError
      >
        <Form.Item
            label="Tên đại lí:"
            labelAlign="left"
            name="name"
            hasFeedback
            rules={[{required: true, message: 'Vui lòng nhập tên đại lí'}]}
            className="form-item"
        >
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Chọn đại lí"
            optionFilterProp="children"
            onChange={onChangeCreateAgency}
          >
            {listAgency.map((agencyItem) => {
              return  <Option value={agencyItem._id} key={agencyItem._id}>{agencyItem.name}</Option>
            })}
            
          </Select>
        </Form.Item>
        <Form.Item
            label="Số sim:"
            labelAlign="left"
            name="sim"
            hasFeedback
            rules={[{
              required: true, 
              message: 'Vui lòng nhập số sim'
            },{
              min: 10,
              message: "Số điện thoại không đúng định dạng"
            }]}
            className="form-item"
        >
            <Input
                type="text"
                placeholder="Nhập số sim"
            />
        </Form.Item>
        
        <InputCurrency placeholder="Nhập giá nhập"  label="Giá nhập:"  name="entryPrice"  className="form-item"  rules={[{required: true, message: 'Vui lòng nhập giá nhập'}]}/>
        <InputCurrency placeholder="Nhập giá bán"  label="Giá bán:" name="price" className="form-item" rules={[{required: true, message: 'Vui lòng nhập giá bán'}]}/>
        <InputCurrency placeholder="Nhập chi phí giao sim" label="Chi phí giao sim:" name="fee" className="form-item"  rules={[{required: true, message: 'Vui lòng nhập chi phí giao sim'}]}/>
        <InputCurrency  placeholder="Nhập chi phí đại lí hỗ trợ" label="Đại lí hỗ trợ:"  name="agencySupport" className="form-item" rules={[{required: true, message: 'Vui lòng nhập chi phí đại lí hỗ trợ'}]}/>
        <InputCurrency  placeholder="Chi phí khách hỗ trợ"  label="Chi phí khách hỗ trợ:" name="khachHoTro" className="form-item" rules={[{required: true, message: 'Vui lòng nhập chi phí khách hỗ trợ'}]}/>
        <InputCurrency  placeholder="Nhập chi phí nếu thất bại" label="Chi phí nếu thất bại:" name="feeIfFalse" className="form-item" rules={[{required: true, message: 'Vui lòng nhập chi phí nếu thất bại'}]}/>
        <Form.Item {...tailFormItemLayout} style={{marginTop: "50px"}}>
            <Button type="warning" onClick={handleCancelCreateCart} style={{ marginRight: '10px' }}>
                Cancel
            </Button>
            <Button type="primary" htmlType="submit"  >
                Tạo đơn hàng
            </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
  
  const modalCreateAgencyDelivery = (
    <Modal
      title="Tạo đơn hàng đại lí giao"
      visible={visibleModalCartAgencyDelivery}
      onCancel={handleCancelCreateCart}
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
          onFinish={onFinishCreateCartDelivery}
          scrollToFirstError
      >
        <Form.Item
            label="Tên đại lí:"
            labelAlign="left"
            name="name"
            hasFeedback
            rules={[{required: true, message: 'Vui lòng nhập tên đại lí'}]}
            className="form-item"
        >
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Chọn đại lí"
            optionFilterProp="children"
            onChange={onChangeCreateAgency}
          >
            {listAgency.map((agencyItem) => {
              return  <Option value={agencyItem._id} key={agencyItem._id}>{agencyItem.name}</Option>
            })}
            
          </Select>
        </Form.Item>
        <Form.Item
            label="Số sim:"
            labelAlign="left"
            name="sim"
            hasFeedback
            rules={[{
              required: true, 
              message: 'Vui lòng nhập số sim'
            },{
              min: 10,
              message: "Số điện thoại không đúng định dạng"
            }]}
            className="form-item"
        >
            <Input
                type="text"
                placeholder="Nhập số sim"
            />
        </Form.Item>
        
        <InputCurrency placeholder="Nhập giá nhập"  label="Giá nhập:"  name="entryPrice"  className="form-item"  rules={[{required: true, message: 'Vui lòng nhập giá nhập'}]}/>
        <InputCurrency placeholder="Nhập giá bán"  label="Giá bán:" name="price" className="form-item" rules={[{required: true, message: 'Vui lòng nhập giá bán'}]}/>
        <InputCurrency placeholder="Nhập chi phí giao sim" label="Chi phí giao sim:" name="fee" className="form-item"  rules={[{required: true, message: 'Vui lòng nhập chi phí giao sim'}]}/>
        <InputCurrency  placeholder="Nhập chi phí đại lí hỗ trợ" label="Đại lí hỗ trợ:"  name="agencySupport" className="form-item" rules={[{required: true, message: 'Vui lòng nhập chi phí đại lí hỗ trợ'}]}/>
        <InputCurrency  placeholder="Chi phí khách hỗ trợ"  label="Chi phí khách hỗ trợ:" name="khachHoTro" className="form-item" rules={[{required: true, message: 'Vui lòng nhập chi phí khách hỗ trợ'}]}/>
        <InputCurrency  placeholder="Nhập chi phí nếu thất bại" label="Chi phí nếu thất bại:" name="feeIfFalse" className="form-item" rules={[{required: true, message: 'Vui lòng nhập chi phí nếu thất bại'}]}/>
        <Form.Item {...tailFormItemLayout} style={{marginTop: "50px"}}>
            <Button type="warning" onClick={handleCancelCreateCart} style={{ marginRight: '10px' }}>
                Cancel
            </Button>
            <Button type="primary" htmlType="submit"  >
                Tạo đơn hàng
            </Button>
        </Form.Item>
      </Form>
    </Modal>
  )

  const handleAddAgencyDelivery  = () =>{
    setVisibleModelAgencyDelivery(true)
  }

  return (
    <BaseLayout>
      <Spin spinning={loading}>
        {modalCreateAgencyDirect}
        {modalCreateAgencyDelivery}
        <div style={{width: "90%", margin: '30px auto'}}>
          <Button
            onClick={handleAdd}
            type="primary"
            style={{margin: '0 auto'}}
            >
                Thêm đơn hàng giao trực tiếp
          </Button>
          <Button
            onClick={handleAddAgencyDelivery}
            type="primary"
            style={{marginLeft: '30px'}}
            >
                Thêm đơn hàng đại lí giao
          </Button>
      </div>
      <Row style={{width: "90%", margin: "0 auto"}}  gutter={[8, 16]}>
          <Col span={4}>
              Tìm kiếm đơn hàng
          </Col>
          <Col span={20}>
          <span style={{margin: "0 10px"}}>Từ</span>
            <DatePicker 
              allowClear={false}
              format="DD/MM/YYYY"
              onChange={value=>{setTimeSearchStart(value._d);}} 
              placeholder="Thời gian bắt đầu"
              value={timeSearchStart !== 0 ? moment(timeSearchStart, "DD/MM/YYYY") : ""}    
          />
           <span style={{margin: "0 10px"}}>đến</span>
            <DatePicker 
                allowClear={false}  
                format="DD/MM/YYYY"    
                onChange={value=>{setTimeSearchEnd(value._d);}} 
                placeholder="Thời gian kết thúc" 
                value={timeSearchEnd !== 0 ? moment(timeSearchEnd, "DD/MM/YYYY") : ""}    
            />
              <Button style={{marginLeft : 30}} onClick={searchCartFollowTime}>Tìm kiếm</Button>
              <Button style={{marginLeft : 30}} onClick={resetSearchCartFollowTime}>Xoá khoảng tìm kiếm</Button>
          </Col>
      </Row>
      {userData.role === "admin" ? null : <Row style={{width: "90%", margin: "0 auto"}}  gutter={[16, 16]}>
          Tổng lương của nhân viên theo tìm kiếm : {convertNumberToCurrency(totalSalaryUser(dataTableCartUser))}
      </Row>}
      <Table
          className="table"
          bordered
          dataSource={dataTableCartUser}
          columns={userData.role === "admin" ?  columnsAdmin : columnsUser}
          loading={loading}
          pagination={{ pageSize: 10 }}
      />
      </Spin>
    </BaseLayout>
  )
}
export default Cart;