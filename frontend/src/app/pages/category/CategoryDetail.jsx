import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCategoryById } from "../../store/slices";
import { Badge, Button, Card, Col, Descriptions, Divider, Empty, Image, Rate, Row, Space, Statistic, Tabs, Tag } from "antd";
import { BreadcrumbItem, ReusableTable } from "../../components/common";
import { AppstoreOutlined, ArrowLeftOutlined, ShoppingOutlined } from "@ant-design/icons";


const CategoryDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // Access the category details from the Redux store
    const { categoryDetail, loading, error} = useSelector((state) => state.category);

    // Fetch category details action
    useEffect(() => {
        dispatch(fetchCategoryById(id));
    }, [dispatch, id]);

    const category = categoryDetail;
    if (!category) {
        return <Empty description="No Category Found" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    const subcategoryColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Button type="link" onClick={() => handleView(record.id)}>
                    {text}
                </Button>
            ),
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status.toUpperCase()}
                </Tag>
            ),
            sorter: (a, b) => a.status - b.status,
        },
        {
            title: 'Created At',
            render: (_, record) => !record.createdAt ? null : new Date(record.createdAt).toLocaleString(),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Updated At',
            render: (_, record) => !record.updatedAt ? null : new Date(record.updatedAt).toLocaleString(),
            sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
        }
    ];

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
                        src={Array.isArray(record.files) && record.files[0]?.base64Url ? record.files[0].base64Url : undefined}
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
                        {rating} ({record.reviews} reviews)
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
        }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            padding: '32px 0',
        }}>
            <Row style={{ marginBlockEnd: "15px" }}>
                <Col span={24}>
                    <BreadcrumbItem
                        items={[
                            {
                                title: 'Home',
                                path: '/dashboard'
                            },
                            {
                                title: 'Category',
                                path: '/categories'
                            },
                            {
                                title: category.name,
                                path: `/categories/${category.id}`
                            }
                        ]}
                    />
                </Col>
            </Row>
            <Space direction="vertical" size="large" style={{ display: 'flex', width: '100%' }}>
                <Card
                    style={{
                        boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
                        borderRadius: 16,
                        background: '#fff',
                        padding: 0,
                    }}
                    bodyStyle={{ padding: 0 }}
                >
                    <Row gutter={0}>
                        <Col span={8} style={{
                            background: 'linear-gradient(135deg, #e0eafc9f 0%, #cfdef3b3 100%)',
                            borderTopLeftRadius: 16,
                            borderBottomLeftRadius: 16,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '32px 0',
                        }}>
                            <Image
                                width={220}
                                src={category.file ? category.file.base64Url : null}
                                alt={category.file ? category.file.filename : 'No Image'}
                                style={{ borderRadius: 12, boxShadow: '0 6px 12px rgba(0,0,0,0.10)', border: '2px solid #e6e6e6' }}
                                fallback="https://via.placeholder.com/220x220?text=No+Image"
                            />
                        </Col>
                        <Col span={16} style={{ padding: '32px 40px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <h1 style={{ margin: 0, fontWeight: 700, fontSize: 32, color: '#222' }}>{category.name}</h1>
                                <Button
                                    icon={<ArrowLeftOutlined />}
                                    onClick={() => navigate('/categories')}
                                    type="default"
                                    style={{ borderRadius: 8, fontWeight: 500 }}
                                >
                                    Back to List
                                </Button>
                            </div>
                            <div style={{ margin: '18px 0 24px 0', display: 'flex', gap: 8 }}>
                                <Tag color={category.status == true ? 'green' : 'red'} style={{ fontWeight: 600, fontSize: 14 }}>
                                    {category.status == true ? 'ACTIVE' : 'INACTIVE'}
                                </Tag>
                                {category.featured && <Tag color="gold" style={{ fontWeight: 600, fontSize: 14 }}>FEATURED</Tag>}
                                {!category.parent_id && <Tag color="blue" style={{ fontWeight: 600, fontSize: 14 }}>MAIN CATEGORY</Tag>}
                            </div>
                            <p style={{ fontSize: 16, color: '#444', marginBottom: 18 }}>{category.description}</p>
                            <Divider style={{ margin: '18px 0' }} />
                            <Row gutter={24} style={{ marginBottom: 24 }}>
                                <Col span={8}>
                                    <Statistic title={<span style={{ color: '#888', fontWeight: 500 }}>Total Products</span>} value={(category.products?.length ?? 0)} valueStyle={{ fontWeight: 700, color: '#1890ff', fontSize: 22 }} />
                                </Col>
                                <Col span={8}>
                                    <Statistic title={<span style={{ color: '#888', fontWeight: 500 }}>Subcategories</span>} value={(category.subcategories?.length ?? 0)} valueStyle={{ fontWeight: 700, color: '#52c41a', fontSize: 22 }} />
                                </Col>
                                <Col span={8}>
                                    <Statistic 
                                        title={<span style={{ color: '#888', fontWeight: 500 }}>Created</span>}
                                        value={new Date(category.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: '2-digit',
                                            year: 'numeric'
                                        })}
                                        valueStyle={{ fontWeight: 700, color: '#faad14', fontSize: 22 }}
                                    />
                                </Col>
                            </Row>
                            <Divider style={{ margin: '18px 0' }} />
                            <h3 style={{ fontWeight: 700, fontSize: 20, color: '#222', marginBottom: 12 }}>Category Specifications</h3>
                            {category.specifications && Object.keys(category.specifications).length > 0 ? (
                                <Descriptions column={1} size="small" style={{ marginBottom: 0 }}>
                                    {Object.entries(category.specifications).map(([key, value]) => (
                                        <Descriptions.Item key={value?.key} label={<span style={{ fontWeight: 600, color: '#555' }}>{value?.key.charAt(0).toUpperCase() + value?.key.slice(1)}</span>}>
                                            <span style={{ color: '#333' }}>{value?.value}</span>
                                        </Descriptions.Item>
                                    ))}
                                </Descriptions>
                            ) : (
                                <Empty description="No specifications added" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            )}
                        </Col>
                    </Row>
                </Card>
                <Card 
                    style={{ 
                        boxShadow: '0 10px 12px rgba(0,0,0,0.06)',
                        borderRadius: 16,
                        background: 'linear-gradient(135deg, #e0eafc24 0%, #cfdef32b 100%)',
                    }}
                >
                    <Tabs
                        defaultActiveKey="subcategories"
                        items={[
                            {
                                key: "subcategories",
                                label: (
                                    <span>
                                        <AppstoreOutlined style={{ marginRight: 8 }} />
                                        Subcategory ({category.subcategories?.length ?? 0})
                                    </span>
                                ),
                                children: (
                                    <ReusableTable
                                        rowKey="id"
                                        loading={loading}
                                        dataSource={category.subcategories ?? []}
                                        columns={subcategoryColumns}
                                        searchKey="name"
                                        showSearch={true}
                                        showTotal={false}
                                        pageSizeOptions={['5', '10', '20', '50']}
                                        searchPlaceholder="subcategory name"
                                    />
                                ),
                            },
                            {
                                key: "products",
                                label: (
                                    <span>
                                        <ShoppingOutlined style={{ marginRight: 8 }} />
                                        Products ({category.products?.length ?? 0})
                                    </span>
                                ),
                                children: (
                                    <ReusableTable
                                        rowKey="id"
                                        loading={loading}
                                        dataSource={category.products ?? []}
                                        columns={productsColumns}
                                        searchKey="name"
                                        showSearch={true}
                                        showTotal={false}
                                        pageSizeOptions={['5', '10', '20', '50']}
                                        searchPlaceholder="product name"
                                    />
                                ),
                            },
                        ]}
                    />
                </Card>
            </Space>
        </div>
    );
};

export default CategoryDetail;
