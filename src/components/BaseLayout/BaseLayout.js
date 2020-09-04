import React, { useState, useEffect } from 'react';
import {useSelector} from 'react-redux'
import {Layout, Menu, Dropdown, notification } from 'antd';
import './BaseLayout.less';
import {logout} from "../../api/auth";
import {useDispatch} from 'react-redux'
import actions from '../../redux/actions'
import {withRouter} from 'react-router'
import {
    Link,
    useHistory
} from "react-router-dom";
import {getProfile} from "../../api/profile"
import Cookies from "js-cookie";
import { DownOutlined } from '@ant-design/icons';
const {Header, Content, Footer} = Layout;

const BaseLayout = (props) => {
    const userData = useSelector(state => state.userReducer)
    const dispatch = useDispatch();
    const history = useHistory();
    const userRole = userData.role;
    const activeKey = useState(props.location.pathname.split('/')[1])
    useEffect(() => {
        async function _getProfile(){
          var res = await getProfile()
          dispatch(actions.userActions.setUser(res.data.data))
        }
        _getProfile()
      }, [dispatch]);

    const onCLickLogout = async () => {
        try {
            const response = await logout();
            Object.keys(Cookies.get()).forEach(function(cookieName) {
            var neededAttributes = {
                // Here you pass the same attributes that were used when the cookie was created
                // and are required when removing the cookie
            };
            Cookies.remove(cookieName, neededAttributes);
            });
            if (response.status === 200) {
            dispatch(actions.userActions.logOut())

            notification.success({
                duration: 1,
                message: "Thành công",
                description: 'Đăng xuất thành công!'
            })
            history.push('/login')
            }
        } catch (err) {
            if (err) {
            notification.error({
                duration: 1,
                message: "Đăng xuất Không thành công",
                description: (err.response && err.response.data && err.response.data.message) || "Không thể kết nối server"
            })
            }
        }
    }
    const menu = (
        <Menu>
          <Menu.Item>
            <Link to="#" target="" rel="noopener noreferrer" onClick={onCLickLogout}>
              Đăng xuất
            </Link>
          </Menu.Item>
        </Menu>
      );
    return(
        <Layout className="layout" id='components-layout-demo-top-side-2'>
            <Header>
                <Link className="logo" to='/' style={{float: "left", marginRight: "30px"}}>SIM SO</Link>
                <Menu  theme="dark" mode="horizontal"  selectedKeys={activeKey}>
                    <Menu.Item key="cart" className="element-menu">
                        <Link to={`/cart`}>Đơn hàng</Link>
                    </Menu.Item>
                    {userRole==="admin"?     <Menu.Item key="user" className="element-menu">
                        <Link to={`/user`}> Nhân viên</Link>
                    </Menu.Item> : null}

                    {userRole==="admin" ?  <Menu.Item key="agency" className="element-menu">
                        <Link to={`/agency`}>Đại lí</Link>
                    </Menu.Item> : null}
                    <Menu.Item className="element-menu" style={{float: 'right'}}>
                        <Dropdown overlay={menu} trigger='click'>
                        <Link to="#" className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            {userData.name} <DownOutlined style={{fontSize:13, marginTop:10}}/>
                        </Link>
                        </Dropdown>
                </Menu.Item>
                </Menu>
            </Header>
            <Content className="site-layout-background" style={{
                margin: 0,
                minHeight: 280,
            }}
            >
                <div className="site-layout-content">
                {
                    props.children
                }
                </div>
            </Content>
            <Footer style={{textAlign: 'center'}}> sim so team</Footer>
        </Layout>
    )
}
export default withRouter(BaseLayout)