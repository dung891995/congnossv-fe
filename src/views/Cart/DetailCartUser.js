import React, { useEffect, useState } from "react";
import {useSelector} from 'react-redux'
import {getInfoUser} from '../../api/user';
import { Row, Col, Divider, Button, Table, Typography, notification, Popconfirm, Input, Space, DatePicker   } from 'antd';
import { getAllCartOfUser, updateNoteCartOfUser, updateStatusSuccessCart, updateStatusFailCart, paySalaryUser, searchCartOfUserFollowTime } from "../../api/cart";
import {CheckCircleOutlined, CloseCircleOutlined, SearchOutlined, ArrowLeftOutlined  } from "@ant-design/icons" 
import moment from 'moment';
import {    
    convertNumberToCurrency,
    convertCurrencyToNumber
} from "../../utils/currencyData";
import { errorNotify } from '../../utils/notifiactionCommon';
import Highlighter from 'react-highlight-words';
import {handleDate} from "../../utils/handleDate";
const { Paragraph } = Typography;
const DetailUser = (props) => {
    let [dataTableCartUser, setDataTableCartUser] = useState([]);
    let [loading, setLoading] = useState(false);
    let [isNoteOfUser, setIsNoteOfUser] = useState(false);
    let [isUpdateStatusCart, setIsUpdateStatusCart] = useState(false);
    let [timeSearchStart, setTimeSearchStart] = useState(0);
    let [timeSearchEnd, setTimeSearchEnd] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [resetSearch, setResetSearch] = useState(false);
    const [cartUser, setCartUser] = useState([])
    const userData = useSelector(state => state.userReducer);
    const [infoUser, setInfoUser] = useState({});
    const [isPaySalary, setIsPaySalary] = useState(false);
    useEffect(()=>{
        let _initUser = async () =>{
           try {
                let res = await getInfoUser(props.user.key);
                if(res.data.status.status === 200){
                    setInfoUser(res.data.data);
                }
           } catch (error) {
             errorNotify("Không thành công", "Hiển thị đơn hàng không thành công")
           }
        }
        _initUser();
    },[props.user.key, isPaySalary])
    const handleDataSourceCartOfUser = data => {
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
    const columns = [
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
            key: 'status',
            render: (text, record) => (
              <>
               {
                templateStatusCart(record)
               }
              </>
            ),
          },
    ];
    
    useEffect(() => {
        const _getCartUser = async () => {
            try {
                let response = await getAllCartOfUser(props.user.key);
                if(response.data.status.status === 200){
                    setDataTableCartUser(handleDataSourceCartOfUser(response.data.data));
                    setCartUser(response.data.data)
                }
            } catch (error) {
                errorNotify("Không thành công", "Hiển thị đơn hàng không thành công")
            }
        }
        _getCartUser();
    }, [props.user.key, props.isVisibleDetailUser, isNoteOfUser, isUpdateStatusCart, resetSearch, isPaySalary])
    const searchCartFollowTime = async () => {
        try {
            var condition = {};
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
            condition.idUser = props.user.key;
            let res = await searchCartOfUserFollowTime(condition);
            if(res.data.status.status === 200){
                setDataTableCartUser(handleDataSourceCartOfUser(res.data.data));
            }
        } catch (error) {
            errorNotify("Không thành công", "Hiển thị đơn hàng không thành công")
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
    const paySalary = async ()=>{
        try {
            let body = {}
            if(timeSearchStart !==0){
                let date = handleDate(timeSearchStart);
                body.timeSearchStart = new Date(date.year, date.month, date.day, 0, 0, 0).getTime();
            }else{
                var dateStart = new Date("2000","01","01","0","0","0");
                body.timeSearchStart = dateStart.getTime();
            }

            if(timeSearchEnd!==0){
                let date = handleDate(timeSearchEnd);
                body.timeSearchEnd = new Date(date.year, date.month, date.day, 23, 59, 59).getTime();
            }else{
                var dateEnd = new Date("2100", "01", "01", "23", "59", "59");
                body.timeSearchEnd = dateEnd.getTime();
            }
            body.totalSalaryCurrent = infoUser.salary;
            dataTableCartUser.length ? body.totalSalaryPaid = totalSalaryUser(dataTableCartUser) :  body.totalSalaryPaid = totalSalaryUser(0)
            let res = await paySalaryUser(infoUser._id, body);
            if(res.data.status.status === 200){
                notification.success({
                    duration:2,
                    message: "Thành công",
                    description: 'Thanh toán thành công thành công'
                });
                setIsPaySalary(!isPaySalary)
            }
        } catch (error) {
            errorNotify("Không thành công", "Thanh toán không thành công")
        }
    }
    return (
        <div className="detail-user"> 
            <p style={{margin: 30}} className="back-to-history" onClick={() => { props.setIsVisibleDetailUser(!props.isVisibleDetailUser) }}>
                <ArrowLeftOutlined /> Quay lai trang truoc
            </p>
            <h1 style={{ textAlign: 'center' }}>Thông tin nhân viên</h1>
            <Divider orientation="left" plain>
                Thông tin cá nhân
            </Divider>
            <div style={{ width:"80%", margin: "0 auto"}}>
                <Row gutter={[8, 8]}>
                    <Col span={24}>
                        <Row gutter={[8, 8]}>
                            <Col span={6}>
                                Tên:
                            </Col>
                            <Col span={18}>
                                {infoUser.name}
                            </Col>
                        </Row>
                        <Row gutter={[8, 8]}>
                            <Col span={6}>
                                Email:
                            </Col>
                            <Col span={18}>
                            {infoUser.email}
                            </Col>
                        </Row>
                        <Row gutter={[8, 8]}>
                            <Col span={6}>
                            Hoa hồng của nhân viên:
                            </Col>
                            <Col span={18}>
                            {infoUser.commissionUser}
                            </Col>
                        </Row>
                        <Row gutter={[8, 8]}>
                            <Col span={6}>
                                Lương:
                            </Col>
                            <Col span={18}>
                                {infoUser.salary ? convertNumberToCurrency(infoUser.salary) : 0}
                            </Col>
                        </Row>
                        <Row gutter={[8, 8]}>
                            <Col span={6}>
                                Số lượng đơn hàng:
                            </Col>
                            <Col span={18}>
                                {cartUser.length ? cartUser.length : 0}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            <Divider orientation="left" plain>
                Các đơn hàng của nhân viên
            </Divider>
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
                    onChange={value=>{setTimeSearchEnd(value._d)}} 
                    placeholder="Thời gian kết thúc" 
                    value={timeSearchEnd !== 0 ? moment(timeSearchEnd, "DD/MM/YYYY") : ""}    
                />
                    <Button style={{marginLeft : 30}} onClick={searchCartFollowTime}>Tìm kiếm</Button>
                    <Button style={{marginLeft : 30}} onClick={resetSearchCartFollowTime}>Xoá khoảng tìm kiếm</Button>
                </Col>
            </Row>
            <Row style={{width: "90%", margin: "0 auto"}}  gutter={[16, 16]}>
                Tổng lương của nhân viên theo tìm kiếm : {convertNumberToCurrency(totalSalaryUser(dataTableCartUser))}
            </Row>
            <Row style={{width: "90%", margin: "0 auto"}}  gutter={[16, 16]}>
              {userData.role === "admin" ?  <Button onClick={paySalary}> Thanh toán lương </Button> : null}
            </Row>
            <Table
                className="table"
                bordered
                dataSource={dataTableCartUser}
                columns={columns}
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    )
}
export default DetailUser