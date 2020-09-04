import React, { useEffect, useState } from "react";
import { Row, Col, Divider, Button, Table, Input, Space, DatePicker, notification   } from 'antd';
import { getDetailAgency, payCredit, payDebit } from "../../api/agency";
import { getCartofAgency, searchCartOfAgencyFollowTime } from "../../api/cart";
import {CheckCircleOutlined, CloseCircleOutlined, SearchOutlined, ArrowLeftOutlined  } from "@ant-design/icons" 
import moment from 'moment';
import {    
    convertNumberToCurrency,
} from "../../utils/currencyData";
import { errorNotify } from '../../utils/notifiactionCommon';
import Highlighter from 'react-highlight-words';
import {handleDate} from "../../utils/handleDate";
const DetailCartAgency = (props) => {
    let [dataTableCartAgency, setDataTableCartAgency] = useState([]);
    let [loading, setLoading] = useState(false);
    let [timeSearchStart, setTimeSearchStart] = useState(0);
    let [timeSearchEnd, setTimeSearchEnd] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [resetSearch, setResetSearch] = useState(false);
    const [infoAgency, setInfoAgency] = useState({});
    const [isPay, setIsPay] = useState(false)
    useEffect(()=>{
        setLoading(true)
        let _initAgency = async () =>{
           try {
                let res = await getDetailAgency(props.agency.key);
                if(res.data.status.status === 200){
                    setInfoAgency(res.data.data);
                }
           } catch (error) {
             errorNotify("Không thành công", "Hiển thị thông tin của đại lí không thành công")
           }finally{
                setLoading(false)
           }
        }
        _initAgency();
    },[props.agency.key, isPay])
    const handleDataSourceCartOfAgency = data => {
        return data.map((cart, index) => {
          return {
              key: cart._id,
              stt: index + 1,
              timeFrom: moment(cart.createdAt).format("DD/MM/YYYY")+" "+ moment(cart.createdAt).format("hh:mm a"),
              timeTo: cart.updatedAt ? moment(cart.updatedAt).format("DD/MM/YYYY")+" "+ moment(cart.updatedAt).format("hh:mm a") : null,
              agency: cart.idAgency.name,
              sim: cart.sim,
              agencySupport: convertNumberToCurrency(cart.agencySupport),
              status: cart.status,
              typeTrade: cart.typeTrade
          }
        })
      }
      const templateStatusCart = (record) => {
        switch(record.status){
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
            title: 'Đại lí hỗ trợ',
            key: 'agencySupport',
            dataIndex: 'agencySupport',
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
        const _getCartAgency = async () => {
            try {
                let response = await getCartofAgency(props.agency.key);
                if(response.data.status.status === 200){
                    setDataTableCartAgency(handleDataSourceCartOfAgency(response.data.data));
                }
            } catch (error) {
                errorNotify("Không thành công", "Hiển thị đơn hàng không thành công")
            }
        }
        _getCartAgency();
    }, [props.agency.key, resetSearch])
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
            condition.idUser = props.agency.key;
            let res = await searchCartOfAgencyFollowTime(condition);
            if(res.data.status.status === 200){
                setDataTableCartAgency(handleDataSourceCartOfAgency(res.data.data));
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

    let handlePayCredit = async () => {
        try {
            setLoading(true)
            let res = await payCredit(props.agency.key)
            if (res.status === 200) {
                notification.success({
                  duration:2,
                  message: "Thành công",
                  description: 'Thanh toán nợ thành công'
                });
                setIsPay(!isPay);
            }
        } catch (error) {
            errorNotify("Không thành công", "Thanh toán nợ không thành công");
        }finally{
            setLoading(false)
        }
    }

    let handlePayDebit = async () => {
        setLoading(true)
        try {
            let res = await payDebit(props.agency.key)
            if (res.status === 200) {
                notification.success({
                  duration:2,
                  message: "Thành công",
                  description: 'Thanh toán công thành công'
                });
                setIsPay(!isPay);
            }
        } catch (error) {
            errorNotify("Không thành công", "Thanh toán công không thành công");
        }finally{
            setLoading(false)
        }
    }
    return (
        <div className="detail-agency"> 
            <p style={{margin: 30}} className="back-to-history" onClick={() => { props.setIsVisibleDetailAgency(!props.isVisibleDetailAgency) }}>
                <ArrowLeftOutlined /> Quay lai trang truoc
            </p>
            <h1 style={{ textAlign: 'center' }}>Thông tin đại lí</h1>
            <Divider orientation="left" plain>
                Thông tin đại lí
            </Divider>
            <div style={{ width:"80%", margin: "0 auto"}}>
                <Row gutter={[8, 8]}>
                    <Col span={24}>
                        <Row gutter={[8, 8]}>
                            <Col span={6}>
                                Tên:
                            </Col>
                            <Col span={18}>
                                {infoAgency.name}
                            </Col>
                        </Row>
                        <Row gutter={[8, 8]}>
                            <Col span={6}>
                                Hoa hồng của đại lí:
                            </Col>
                            <Col span={18}>
                                {infoAgency.commissionAgency}
                            </Col>
                        </Row>
                        <Row gutter={[8, 8]}>
                            <Col span={6}>
                                Công:
                            </Col>
                            <Col span={18}>
                                {infoAgency.debit ? convertNumberToCurrency(infoAgency.debit) : 0}
                                <Button
                                    style={{marginLeft: "15px"}}
                                    onClick={handlePayDebit}
                                    htmlType="button"
                                > Thanh toán </Button>
                            </Col>
                        </Row>
                        <Row gutter={[8, 8]}>
                            <Col span={6}>
                                Nợ
                            </Col>
                            <Col span={18}>
                                {infoAgency.credit ? convertNumberToCurrency(infoAgency.credit): 0}
                                <Button
                                    onClick={handlePayCredit}
                                    htmlType="button"
                                    style={{marginLeft: "15px"}}
                                > Thanh toán </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            <Divider orientation="left" plain>
                Các đơn hàng của đại lí
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
            <Table
                className="table"
                bordered
                dataSource={dataTableCartAgency}
                columns={columns}
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    )
}
export default DetailCartAgency