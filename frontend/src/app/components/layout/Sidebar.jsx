import { Menu } from "antd";
import { 
    DashboardOutlined, 
    UserOutlined, 
    SettingOutlined,
    AppstoreOutlined,
    ShoppingOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import { useLocation } from 'react-router-dom';


const Sidebar = ({ onMenuClick }) => {
    const location = useLocation();
    const items = [
        { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
        { key: '/categories', icon: <AppstoreOutlined />, label: 'Category' },
        { key: '/subcategories', icon: <AppstoreOutlined />, label: 'Subcategory' },
        { key: '/products', icon: <ShoppingOutlined />, label: 'Products' },
        { key: '/orders', icon: <ShoppingCartOutlined />, label: 'Orders' },
        { key: '/profile', icon: <UserOutlined />, label: 'Profile' },
        { key: '/settings', icon: <SettingOutlined />, label: 'Settings' },
    ];
    // Highlight the correct menu item based on the current path
    const selectedKey = items.find(item => location.pathname.startsWith(item.key))?.key || '/dashboard';
    return (
        <Menu
            theme='dark'
            mode="inline"
            defaultSelectedKeys={[selectedKey]}
            style={{ height: '100%', borderRight: 0 }}
            items={items}
            onClick={onMenuClick}
        />
    );
};

export default Sidebar;
