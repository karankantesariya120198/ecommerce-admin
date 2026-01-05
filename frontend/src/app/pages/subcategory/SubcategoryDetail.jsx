import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card,
  Descriptions,
  Tag,
  Button,
  Space,
  Tabs,
  Table,
  Image,
  Statistic,
  Row,
  Col,
  Breadcrumb,
  message
} from "antd";
import { BreadcrumbItem } from "../../components/common";
import {
  ArrowLeftOutlined,
  EditOutlined,
  ShoppingOutlined
} from '@ant-design/icons';

const { TabPane } = Tabs;

const SubcategoryDetail = () => {
    const [subcategory, setSubcategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Simulate API calls
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // Mock subcategory data
                const mockSubcategory = {
                    id: parseInt(id),
                    name: id == 1 ? 'Smartphones' : 'Laptops',
                    slug: id == 1 ? 'smartphones' : 'laptops',
                    category: 'Electronics',
                    categoryId: 1,
                    status: 'active',
                    description: id == 1 
                        ? 'Latest smartphones from top brands' 
                        : 'High-performance laptops for work and gaming',
                    products: id == 1 ? 125 : 89,
                    createdAt: id == 1 ? '2023-01-15' : '2023-02-10',
                };
                
                // Mock products data
                const mockProducts = id == 1 ? [
                    {
                        id: 101,
                        name: 'iPhone 14 Pro',
                        price: 999,
                        stock: 45,
                        status: 'published',
                        image: 'https://via.placeholder.com/60x60?text=iPhone',
                        sku: 'IPH14PRO-256',
                    },
                    {
                        id: 102,
                        name: 'Samsung Galaxy S23',
                        price: 899,
                        stock: 32,
                        status: 'published',
                        image: 'https://via.placeholder.com/60x60?text=Galaxy',
                        sku: 'SGS23-256',
                    },
                    {
                        id: 103,
                        name: 'Google Pixel 7',
                        price: 699,
                        stock: 28,
                        status: 'published',
                        image: 'https://via.placeholder.com/60x60?text=Pixel',
                        sku: 'GP7-128',
                    },
                ] : [
                    {
                        id: 201,
                        name: 'MacBook Pro 16"',
                        price: 2399,
                        stock: 15,
                        status: 'published',
                        image: 'https://via.placeholder.com/60x60?text=MacBook',
                        sku: 'MBP16-1TB',
                    },
                    {
                        id: 202,
                        name: 'Dell XPS 15',
                        price: 1899,
                        stock: 22,
                        status: 'published',
                        image: 'https://via.placeholder.com/60x60?text=XPS',
                        sku: 'DXPS15-512',
                    },
                    {
                        id: 203,
                        name: 'HP Spectre x360',
                        price: 1499,
                        stock: 18,
                        status: 'published',
                        image: 'https://via.placeholder.com/60x60?text=Spectre',
                        sku: 'HPSX360-512',
                    },
                ];
                
                setSubcategory(mockSubcategory);
                setProducts(mockProducts);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching subcategory details:', error);
                message.error('Failed to load subcategory details');
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const productColumns = [
        {
            title: 'Product',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Image
                        width={60}
                        height={60}
                        src={record.image}
                        alt={text}
                        style={{ marginRight: 10, objectFit: 'cover' }}
                    />
                    <div>
                        <div style={{ fontWeight: '500' }}>{text}</div>
                        <div style={{ color: '#8c8c8c', fontSize: '12px' }}>{record.sku}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `$${price}`,
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            render: (stock) => (
                <Tag color={stock > 10 ? 'green' : stock > 0 ? 'orange' : 'red'}>
                    {stock} in stock
                </Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'published' ? 'green' : 'default'}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </Tag>
            ),
        },
    ];

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!subcategory) {
        return <div>Subcategory not found</div>;
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            padding: '32px 0',
        }}>
            <Row style={{ marginBlockEnd: "10px" }}>
                <Col span={24}>
                    <BreadcrumbItem
                        items={[
                            {
                                title: 'Home',
                                path: '/dashboard'
                            },
                            {
                                title: 'Subcategory',
                                path: '/subcategories'
                            },
                            {
                                title: subcategory.name,
                                path: `/subcategories/${subcategory.id}`
                            }
                        ]}
                    />
                </Col>
            </Row>

            <Space direction="vertical" style={{ width: "100%" }} size="large">
                <Card>
                    <Space style={{ marginBottom: 16 }}>
                        <Button 
                            icon={<ArrowLeftOutlined />} 
                            onClick={() => navigate('/subcategories')}
                        >
                            Back to List
                        </Button>
                        <Button 
                            type="primary" 
                            icon={<EditOutlined />}
                            onClick={() => navigate(`/subcategories/edit/${id}`)}
                        >
                            Edit Subcategory
                        </Button>
                    </Space>

                    {subcategory && (
                        <Descriptions
                            title="Subcategory Details"
                            bordered
                            column={2}
                        >
                            <Descriptions.Item label="ID">{subcategory.id}</Descriptions.Item>
                            <Descriptions.Item label="Name">{subcategory.name}</Descriptions.Item>
                            <Descriptions.Item label="Category">{subcategory.category}</Descriptions.Item>
                            <Descriptions.Item label="Status">
                                <Tag color={subcategory.status === 'active' ? 'green' : 'red'}>
                                    {subcategory.status.toUpperCase()}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Products">
                                {subcategory.products} products
                            </Descriptions.Item>
                            <Descriptions.Item label="Description" span={2}>
                                {subcategory.description}
                            </Descriptions.Item>
                            <Descriptions.Item label="Created At">
                                {subcategory.createdAt}
                            </Descriptions.Item>
                        </Descriptions>
                    )}
                </Card>

                <Card>
                    <Tabs defaultActiveKey="products">
                        <TabPane 
                            tab={
                                <span>
                                    <ShoppingOutlined />
                                    Products ({products.length})
                                </span>
                            } 
                            key="products"
                        >
                            <Row gutter={16} style={{ marginBottom: 24 }}>
                                <Col span={6}>
                                    <Statistic title="Total Products" value={products.length} />
                                </Col>
                                <Col span={6}>
                                    <Statistic 
                                        title="In Stock" 
                                        value={products.filter(p => p.stock > 0).length} 
                                    />
                                </Col>
                                <Col span={6}>
                                    <Statistic 
                                        title="Out of Stock" 
                                        value={products.filter(p => p.stock === 0).length} 
                                        valueStyle={{ color: '#cf1322' }}
                                    />
                                </Col>
                                <Col span={6}>
                                    <Statistic 
                                        title="Average Price" 
                                        value={products.reduce((sum, p) => sum + p.price, 0) / products.length} 
                                        precision={2}
                                        prefix="$"
                                    />
                                </Col>
                            </Row>

                            <Table 
                                columns={productColumns} 
                                dataSource={products} 
                                rowKey="id"
                                pagination={{ pageSize: 5 }}
                            />
                        </TabPane>
                        <TabPane tab="Sales Analytics" key="analytics">
                            <div style={{ textAlign: 'center', padding: 40 }}>
                                <h3>Sales Analytics</h3>
                                <p>Sales data and charts would be displayed here.</p>
                            </div>
                        </TabPane>
                    </Tabs>
                </Card>
            </Space>
        </div>
    );
};

export default SubcategoryDetail;
