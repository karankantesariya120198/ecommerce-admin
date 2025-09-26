import { Button, Layout, Space, Avatar, Tooltip, message } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useState } from 'react';
import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/index';
import { MessageNotification } from '../common/index';

const { Header, Content, Sider, Footer } = Layout;
const avatarImage = '../../src/assets/admin-panel.png';

const AppLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { contextHolder, show } = MessageNotification();

    const handleMenuClick = (e) => {
        navigate(e.key); // Navigate to the selected menu item (key is already a route)
    }

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            dispatch(logoutUser());
            show('success', 'Logged out successfully!');
            navigate('/login');
        } catch (err) {
            show('error', 'Logout failed. Please try again.');
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {contextHolder}
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 100,
                }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 120,
                    position: 'sticky',
                    top: 0,
                }}>
                    <Space>
                        <Avatar
                            src={avatarImage}
                            alt="Admin Panel"
                            size={collapsed ? 48 : 72}
                            style={{
                                transition: 'width 0.2s, height 0.2s',
                                objectFit: 'contain',
                            }}
                        />
                    </Space>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingTop: 8 }}>
                    <Sidebar onMenuClick={handleMenuClick} />
                </div>
            </Sider>
            <Layout style={{ marginLeft: collapsed ? 80 : 200, minHeight: '100vh', background: '#f5f5f5' }}>
                <Header style={{
                    background: '#fff',
                    padding: '0 32px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'sticky',
                    top: 0,
                    height: 60,
                }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '16px', width: 48, height: 48 }}
                    />
                    <Tooltip title="Logout">
                        <Button
                            type="text"
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                            style={{ fontSize: '16px', width: 48, height: 48 }}
                        />
                    </Tooltip>
                </Header>
                <Content style={{
                    margin: '10px 10px 10px',
                    padding: 0,
                    height: 'calc(86vh - 64px - 48px)',
                    overflow: 'auto',
                    background: '#fff',
                    borderRadius: 12,
                    boxShadow: '0 2px 8px #f0f1f2',
                }}>
                    <div style={{ padding: 25, minHeight: 'calc(100vh - 64px - 48px)', background: '#fff', borderRadius: 12 }}>
                        <Outlet />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center', height: 70 }}>
                    Admin Panel Layout Example Using Ant Design ©{new Date().getFullYear()} Created by <b>Karan</b>
                </Footer>
            </Layout>
        </Layout>
    );
};

export default AppLayout;