import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Divider, Image, List, Rate, Row, Space, Tabs, Tag, Descriptions } from "antd";
import { BreadcrumbItem } from "../../components/common";
import { StarOutlined, ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

const ProductDetail = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Simulate API calls
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // Mock product data
                const mockProduct = {
                id: parseInt(id),
                name: 'iPhone 14 Pro',
                sku: 'IPH14PRO-256',
                price: 999,
                originalPrice: 1099,
                category: 'Electronics',
                subcategory: 'Smartphones',
                stock: 45,
                status: 'published',
                featured: true,
                images: [
                    'https://via.placeholder.com/400x400?text=iPhone+Front',
                    'https://via.placeholder.com/400x400?text=iPhone+Back',
                    'https://via.placeholder.com/400x400?text=iPhone+Side'
                ],
                description: 'The iPhone 14 Pro features a durable ceramic shield front, Super Retina XDR display with ProMotion, and the powerful A16 Bionic chip. With an advanced camera system for stunning photos and videos in any light.',
                specifications: {
                    display: '6.1-inch Super Retina XDR display',
                    chip: 'A16 Bionic chip',
                    camera: '48MP Main camera system',
                    storage: '256GB',
                    battery: 'Up to 23 hours video playback'
                },
                rating: 4.8,
                reviews: 125,
                createdAt: '2023-06-15',
                };
                
                // Mock reviews data
                const mockReviews = [
                {
                    id: 1,
                    user: 'John Doe',
                    rating: 5,
                    comment: 'Amazing phone! The camera quality is outstanding and battery life is impressive.',
                    date: '2023-06-20',
                },
                {
                    id: 2,
                    user: 'Jane Smith',
                    rating: 4,
                    comment: 'Great phone overall, but a bit heavy compared to previous models.',
                    date: '2023-06-18',
                },
                {
                    id: 3,
                    user: 'Robert Johnson',
                    rating: 5,
                    comment: 'Worth every penny. The dynamic island is a game changer!',
                    date: '2023-06-15',
                },
                ];
                
                setProduct(mockProduct);
                setReviews(mockReviews);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product details:', error);
                message.error('Failed to load product details');
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div>
            <Row style={{ marginBlockEnd: "10px" }}>
                <Col span={24}>
                    <BreadcrumbItem
                        items={[
                            {
                                title: 'Home',
                                path: '/dashboard'
                            },
                            {
                                title: 'Product',
                                path: '/products'
                            }
                        ]}
                    />
                </Col>
            </Row>

            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Card>
                    <Space style={{ marginBottom: 16 }}>
                        <Button 
                            icon={<ArrowLeftOutlined />} 
                            onClick={() => navigate('/products')}
                        >
                            Back to List
                        </Button>
                        <Button 
                            type="primary" 
                            icon={<EditOutlined />}
                            onClick={() => navigate(`/products/edit/${id}`)}
                        >
                            Edit Product
                        </Button>
                    </Space>

                    <Row gutter={24}>
                        <Col span={10}>
                            <Image
                                width="100%"
                                src={product.images[0]}
                                alt={product.name}
                                style={{ borderRadius: 8 }}
                            />
                            <Row gutter={8} style={{ marginTop: 16 }}>
                                {product.images.slice(1).map((image, index) => (
                                    <Col span={8} key={index}>
                                        <Image
                                            width="100%"
                                            src={image}
                                            alt={`${product.name} ${index + 2}`}
                                            style={{ borderRadius: 4 }}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </Col>

                        <Col span={14}>
                            <h1 style={{ marginTop: 0 }}>{product.name}</h1>

                            <div style={{ marginBottom: 16 }}>
                                <Rate disabled defaultValue={product.rating} />
                                <span style={{ marginLeft: 8 }}>
                                    {product.rating} ({product.reviews} reviews)
                                </span>
                            </div>

                            <div style={{ marginBottom: 16 }}>
                                <span style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                                    ${product.price}
                                </span>
                                {product.originalPrice && (
                                    <span style={{ textDecoration: 'line-through', color: '#8c8c8c', marginLeft: 8 }}>
                                        ${product.originalPrice}
                                    </span>
                                )}
                            </div>

                            <div style={{ marginBottom: 24 }}>
                                <Tag color={product.stock > 10 ? 'green' : product.stock > 0 ? 'orange' : 'red'}>
                                    {product.stock} in stock
                                </Tag>
                                <Tag color={product.status === 'published' ? 'green' : 'default'}>
                                    {product.status.toUpperCase()}
                                </Tag>
                                {product.featured && <Tag color="red">FEATURED</Tag>}
                            </div>

                            <p>{product.description}</p>

                            <Divider />

                            <h3>Specifications</h3>
                            <Descriptions column={1} size="small">
                                {Object.entries(product.specifications).map(([key, value]) => (
                                    <Descriptions.Item key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
                                        {value}
                                    </Descriptions.Item>
                                ))}
                            </Descriptions>
                        </Col>
                    </Row>  
                </Card>

                <Card>
                    <Tabs defaultActiveKey="reviews">
                        <TabPane 
                            tab={
                                <span>
                                <StarOutlined />
                                    Reviews ({reviews.length})
                                </span>
                            } 
                            key="reviews"
                        >
                            <List
                                itemLayout="horizontal"
                                dataSource={reviews}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Rate disabled defaultValue={item.rating} style={{ fontSize: 14 }} />}
                                            title={item.user}
                                            description={
                                                <div>
                                                <div>{item.comment}</div>
                                                <div style={{ color: '#8c8c8c', fontSize: '12px', marginTop: 4 }}>
                                                    {item.date}
                                                </div>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                            /> 
                        </TabPane>
                        <TabPane tab="Sales History" key="sales">
                            <div style={{ textAlign: 'center', padding: 40 }}>
                                <h3>Sales History</h3>
                                <p>Sales data and charts would be displayed here.</p>
                            </div>
                        </TabPane>
                        <TabPane tab="Inventory History" key="inventory">
                            <div style={{ textAlign: 'center', padding: 40 }}>
                                <h3>Inventory History</h3>
                                <p>Inventory changes and stock history would be displayed here.</p>
                            </div>
                        </TabPane>
                    </Tabs>
                </Card>
            </Space>
        </div>
    );
};

export default ProductDetail;