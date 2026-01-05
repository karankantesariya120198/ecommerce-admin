import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Card, Col, Form, Row, Space, Badge, Image, Tag, Rate, Popconfirm } from "antd";
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { BreadcrumbItem, ReusableTable } from "../../components/common";
import ProductForm from "./ProductForm";
import { deleteProduct, fetchProducts } from "../../store/slices";
import { FormButton } from "../../components/common/forms";

const ProductList = () => {
    const [products, setProducts] = useState([]); // Replace with actual data fetching logic
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await dispatch(fetchProducts());
            if (response) {
                setProducts(response.payload);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    // Mock data - replace with API calls
    useEffect(() => {
        fetchData();
    }, [dispatch]);

    const productsColumns = [
        {
            title: 'Product',
            dataIndex: 'name',
            key: 'name',
            width: 250,
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                <Image
                    width={60}
                    height={60}
                    src={record.iconsUrl[0].base64Url}
                    alt={text}
                    style={{ marginRight: 10, objectFit: 'cover' }}
                />
                <div>
                    <div style={{ fontWeight: '500' }}>{text}</div>
                    <div style={{ color: '#8c8c8c', fontSize: '12px' }}>{record.sku}</div>
                </div>
                {record.featured && (
                    <Badge.Ribbon text="Featured" color="red" style={{ top: -5, right: -5 }} />
                )}
                </div>
            ),
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (category, record) => <Tag color="blue">{record.category ? record.category.name ?? 'N/A' : 'N/A'}</Tag>,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price, record) => (
                <div>
                <div style={{ fontWeight: '500' }}>${price}</div>
                {record.originalPrice && (
                    <div style={{ textDecoration: 'line-through', color: '#8c8c8c', fontSize: '12px' }}>
                        ${record.originalPrice}
                    </div>
                )}
                </div>
            ),
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
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating, record) => (
                <div>
                    <Rate disabled defaultValue={rating} style={{ fontSize: 14 }} />
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                        {rating} ({record.reviews ?? 0} reviews)
                    </div>
                </div>
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
        {
            title: 'Actions',
            key: 'actions',
            width: 200,
            render: (_, record) => (
                <Space size="middle">
                    <Button 
                        icon={<EyeOutlined />} 
                        size="small"
                        onClick={() => handleView(record.id)}
                    >
                        View
                    </Button>
                    <Button 
                        icon={<EditOutlined />} 
                        size="small"
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this product?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button 
                            icon={<DeleteOutlined />} 
                            size="small" 
                            danger
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleEdit = (record) => {
        setEditingProduct(record);
        setIsModalVisible(true);
    };

    const handleDelete = (id) => {
        dispatch(deleteProduct(id))
            .then(() => dispatch(fetchProducts()))
            .catch(err => console.error('Error deleting product:', err));
    };

    const handleModalOk = (success) => {
        if (success) {
            setIsModalVisible(false);
            fetchData(); // Refresh table after add/update
        }
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const handleView = (id) => {
        navigate(`/products/${id}`);
    };

    return (
        <div>
            <Row style={{ marginBlockEnd: "20px" }}>
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

            <Card
                style={{ 
                    boxShadow: '0 10px 12px rgba(0,0,0,0.06)',
                    borderRadius: 16,
                }}
            >
                <Row gutter={16} style={{ marginBottom: "20px" }}>
                    <Col span={12}>
                        <h2 style={{ margin: 0 }}>Products</h2>
                        <p style={{ margin: 0, color: '#8c8c8c' }}>Manage your product inventory</p>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right', alignItems: 'center', display: 'flex', justifyContent: 'flex-end' }}>
                        <Space>
                            <FormButton
                                type='primary'
                                variant='outlined'
                                icon={<PlusOutlined />}
                                onClick={() => { setIsModalVisible(true); setEditingProduct(null); }}
                            >
                                Add Product
                            </FormButton>
                        </Space>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <ReusableTable
                            rowKey='id'
                            loading={loading}
                            dataSource={products}
                            columns={productsColumns}
                            searchKey="name"
                            showSearch={true}
                            showTotal={true}
                            pageSizeOptions={['5', '10', '20', '50']}
                            searchPlaceholder="product name"
                            size="middle"
                            scroll={{ x: true }}
                        />
                    </Col>
                </Row>
            </Card>

            <ProductForm
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                initialValues={editingProduct}
            />
        </div>
    );
};

export default ProductList;
