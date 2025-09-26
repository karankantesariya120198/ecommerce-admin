import { DollarOutlined, RiseOutlined, ShopOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Col, Progress, Row, Spin, Statistic, Table, Tag } from "antd";
// Correct way to import from @ant-design/charts
import { Column, Pie } from '@ant-design/plots';
import { useEffect, useState } from "react";
import { ReusableTable, BreadcrumbItem } from "../../components/common";

const Dashboard = () => {
    const [loading, setLoading] = useState(true);

    // Mock data - replace with API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Sales data for column chart
    const salesData = [
        { month: 'Jan', sales: 3800, revenue: 4200 },
        { month: 'Feb', sales: 5200, revenue: 5800 },
        { month: 'Mar', sales: 4100, revenue: 4500 },
        { month: 'Apr', sales: 6800, revenue: 7200 },
        { month: 'May', sales: 8500, revenue: 8900 },
        { month: 'Jun', sales: 7200, revenue: 7800 },
        { month: 'Jul', sales: 9500, revenue: 10200 },
        { month: 'Aug', sales: 11200, revenue: 11800 },
        { month: 'Sep', sales: 9800, revenue: 10500 },
        { month: 'Oct', sales: 12300, revenue: 13100 },
        { month: 'Nov', sales: 14200, revenue: 14900 },
        { month: 'Dec', sales: 16800, revenue: 17500 },
    ];

    // Category data for pie chart
    const categoryData = [
        { category: 'Electronics', value: 35 },
        { category: 'Clothing', value: 25 },
        { category: 'Home & Kitchen', value: 20 },
        { category: 'Books', value: 15 },
        { category: 'Others', value: 5 },
    ];

    // Recent orders data
    const ordersData = [
        {
            key: '1',
            id: 'ORD-00125',
            customer: 'John Doe',
            date: '2023-06-15',
            amount: 125.99,
            status: 'Completed',
        },
        {
            key: '2',
            id: 'ORD-00126',
            customer: 'Jane Smith',
            date: '2023-06-15',
            amount: 89.50,
            status: 'Processing',
        },
        {
            key: '3',
            id: 'ORD-00127',
            customer: 'Robert Johnson',
            date: '2023-06-14',
            amount: 234.00,
            status: 'Completed',
        },
        {
            key: '4',
            id: 'ORD-00128',
            customer: 'Emily Davis',
            date: '2023-06-14',
            amount: 56.75,
            status: 'Shipped',
        },
        {
            key: '5',
            id: 'ORD-00129',
            customer: 'Michael Wilson',
            date: '2023-06-13',
            amount: 189.99,
            status: 'Processing',
        },
    ];

    // Top products data
    const productsData = [
        {
            key: '1',
            name: 'Wireless Headphones',
            category: 'Electronics',
            price: 129.99,
            stock: 45,
            sales: 142,
        },
        {
            key: '2',
            name: 'Running Shoes',
            category: 'Clothing',
            price: 89.99,
            stock: 32,
            sales: 98,
        },
        {
            key: '3',
            name: 'Smart Watch',
            category: 'Electronics',
            price: 199.99,
            stock: 18,
            sales: 76,
        },
        {
            key: '4',
            name: 'Coffee Maker',
            category: 'Home & Kitchen',
            price: 79.99,
            stock: 55,
            sales: 63,
        },
        {
            key: '5',
            name: 'Yoga Mat',
            category: 'Sports',
            price: 29.99,
            stock: 72,
            sales: 57,
        },
    ];

    // Column chart config
    const columnConfig = {
        data: salesData,
        xField: 'month',
        yField: 'sales',
        label: {
            // position: 'middle', // Change this to a valid position value
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
        meta: {
            month: { alias: 'Month' },
            sales: { alias: 'Sales' },
        },
        color: () => '#5B8FF9',
    };

    // Pie chart config
    const pieConfig = {
        data: categoryData,
        angleField: 'value',
        colorField: 'category',
        innerRadius: 0.3,
        label: {
            text: 'category',
            style: {
                fontSize: 12,
                fontWeight: 'bold',
                color: 'rgba(255, 255, 255, 1)'
            }
        },
        style: {
            stroke: '#fff',
            lineWidth: 1,
            radius: 10
        },
        scale: {
            color: {
                palette: 'spectral',
                offset: (t) => t * 0.8 + 0.1,
            }
        },
        interactions: [{ type: 'element-active' }, { type: 'element-selected' }]
    };

    // Orders table columns
    const ordersColumns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Customer',
            dataIndex: 'customer',
            key: 'customer',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: amount => `$${amount.toFixed(2)}`,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: status => {
                let color = 'default';
                if (status === 'Completed') color = 'green';
                if (status === 'Processing') color = 'blue';
                if (status === 'Shipped') color = 'orange';
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
        },
    ];

    // Products table columns
    const productsColumns = [
        {
            title: 'Product',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: price => `$${price.toFixed(2)}`,
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            render: stock => (
                <Progress 
                    percent={(stock / 100) * 100} 
                    size="small" 
                    status={stock > 20 ? 'active' : 'exception'} 
                />
            ),
        },
        {
            title: 'Sales',
            dataIndex: 'sales',
            key: 'sales',
        },
    ];

    const renderMiniChart = () => {
        const data = salesData.map(item => item.sales);
        const maxValue = Math.max(...data);
        const minValue = Math.min(...data);

        return (
            <div style={{ height: '30px', width: '100%', position: 'relative', marginTop: '8px' }}>
                {
                    data.map((value, index) => {
                        const height = ((value - minValue) / (maxValue - minValue)) * 30;
                        return (
                            <div 
                                key={index} 
                                style={{ 
                                    display: 'inline-block',
                                    height: `${height}px`,
                                    width: '4px',
                                    backgroundColor: '#5B8FF9',
                                    margin: '0 1px',
                                    position: 'absolute',
                                    bottom: '0',
                                    left: `${index * 6}px`,
                                    borderRadius: '2px 2px 0 0', 
                                }} 
                            />
                        );
                    })
                }
            </div>
        )
    }

    if (loading) {
        return (
            <div 
                style={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50vh'
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="dashboard">
            <Row style={{ marginBlockEnd: "10px" }}>
                <Col span={24}>
                    <BreadcrumbItem
                        items={[
                            {
                                title: 'Home',
                                path: '/dashboard'
                            }
                        ]}
                    />
                </Col>
            </Row>
            {/* Stats Cards Row */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic 
                            title="Total Revenue"
                            value={112893}
                            precision={2}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<DollarOutlined />}
                            suffix="$" 
                        />
                        {renderMiniChart()}
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic 
                            title="Total Orders"
                            value={9328}
                            valueStyle={{ color: '#1890ff' }}
                            prefix={<ShopOutlined />}
                        />
                        <div style={{ marginTop: 16, color: '#8c8c8c', fontSize: '14px' }}>
                            <span style={{ marginRight: 16 }}>Wk: 234</span>
                            <span>Mo: 932</span>    
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Customers"
                            value={8264}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<UserOutlined />}
                        />
                        <div style={{ marginTop: 16, color: '#8c8c8c', fontSize: '14px' }}>
                            <span style={{ marginRight: 16 }}>New: 124</span>
                            <span>Returning: 78%</span>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Conversion Rate"
                            value={9.3}
                            precision={2}
                            valueStyle={{ color: '#722ed1' }}
                            prefix={<RiseOutlined />}
                            suffix="%"
                        />
                        <div style={{ marginTop: 16, color: '#8c8c8c', fontSize: '14px' }}>
                            <span style={{ marginRight: 16 }}>+2.5%</span>
                            <span>from last week</span>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Charts Row */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={16}>
                    <Card title="Monthly Sales" variant={false}>
                        <Column {...columnConfig} />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Sales by Category" variant={false}>
                        <Pie {...pieConfig} />
                    </Card>
                </Col>
            </Row>

            {/* Tables Row */}
            <Row gutter={16}>
                <Col xs={24} lg={12}>
                    <Card title="Recent Orders" variant={false}>
                        <ReusableTable
                            rowKey='key'
                            loading={loading}
                            dataSource={ordersData}
                            columns={ordersColumns}
                            searchKey="id"
                            showSearch={true}
                            showTotal={true}
                            pageSizeOptions={['5', '10', '20', '50']}
                            searchPlaceholder="order id"
                            size="middle"
                            scroll={{ x: true }}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Top Products" variant={false}>
                        <ReusableTable
                            rowKey='key'
                            loading={loading}
                            dataSource={productsData}
                            columns={productsColumns}
                            searchKey="name"
                            showSearch={true}
                            showTotal={true}
                            pageSizeOptions={['5', '10', '20', '50']}
                            searchPlaceholder="product"
                            size="middle"
                            scroll={{ x: true }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
