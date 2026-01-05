import { Button, Layout, Space, Avatar, Tooltip, message, Badge, Dropdown, Drawer } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useState } from 'react';
import { BellOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
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
    const [notificationDrawer, setNotificationDrawer] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

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

    const userMenuItems = [
        {
            key: 'profile',
            label: 'Profile',
            icon: <UserOutlined />,
            onClick: () => navigate('/profile'),
        },
        {
            key: 'settings',
            label: 'Settings',
            icon: <SettingOutlined />,
            onClick: () => navigate('/settings'),
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: 'Logout',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
        },
    ];

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
                    padding: '0 24px', 
                    background: '#fff', 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #f0f0f0',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '16px', width: 48, height: 48 }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginRight: 16 }}>
                        <Badge count={5}>
                            <Button
                                type="text"
                                icon={<BellOutlined style={{ fontSize: 18 }} />}
                                onClick={() => setNotificationDrawer(true)}
                            />
                        </Badge>

                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                <Avatar icon={<UserOutlined />}/>
                                <span style={{ fontWeight: 500 }}>
                                    { 'Admin' /*user?.first_name || user?.email*/}
                                </span>
                            </div>
                        </Dropdown>
                    </div>
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

            <Drawer
                title="Notifications"
                placement="right"
                onClose={() => setNotificationDrawer(false)}
                open={notificationDrawer}
            >
                <p>No new notifications</p>
            </Drawer>
        </Layout>
    );
};

export default AppLayout;