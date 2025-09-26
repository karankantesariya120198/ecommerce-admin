import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Card, Col, Popconfirm, Row, Space, Tag } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { BreadcrumbItem, ReusableTable } from "../../components/common";
import { FormButton } from "../../components/common/forms";
import { SubcategoryForm } from "../index";
import { fetchSubcategories } from '../../store/slices/index'

const SubcategoryList = () => {
    const [subcategories, setSubcategories] = useState([]); // Replace with actual data fetching logic
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSubcategory, setEditingSubcategory] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await dispatch(fetchSubcategories());
            if (response) {
                setSubcategories(response.payload);
            }
        } catch (error) {
            console.error("Error fetching subcategories:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [dispatch]);

    const handleEdit = (record) => {
        setEditingSubcategory(record);
        setIsModalVisible(true);
    };

    const handleDelete = (id) => {
        // Delete logic here
        setSubcategories(subcategories.filter(item => item.id !== id));
        message.success('Subcategory deleted successfully');
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
        navigate(`/subcategories/${id}`);
    };

    const columns = [
        {
            title: 'Index',
            key: 'index',
            width: 50,
            render: (_, __, index) => index + 1,
        },
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
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (category) => category?.name || 'N/A',
            sorter: (a, b) => a.category.name.localeCompare(b.category.name),
        },
        {
            title: 'Products',
            dataIndex: 'products',
            key: 'products',
            render: (products) => <Tag color="blue">{products} products</Tag>,
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
        },
        {
            title: 'Actions',
            key: 'actions',
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
                        title="Are you sure to delete this subcategory?"
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
                                title: 'Subcategory',
                                path: '/subcategories'
                            }
                        ]}
                    />
                </Col>
            </Row>

            <Card>
                <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={12}>
                        <h2 style={{ margin: 0 }}>Subcategories</h2>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                        <Space>
                            <FormButton
                                type='primary'
                                variant='outlined'
                                icon={<PlusOutlined />}
                                onClick={() => { setIsModalVisible(true); setEditingSubcategory(null); }}
                            >
                                Add Subcategory
                            </FormButton>
                        </Space>
                    </Col>
                </Row>
                
                <ReusableTable
                    rowKey='id'
                    loading={loading}
                    dataSource={subcategories}
                    columns={columns}
                    searchKey="name"
                    showSearch={true}
                    showTotal={true}
                    pageSizeOptions={['5', '10', '20', '50']}
                    searchPlaceholder="subcategory name"
                    size="middle"
                    scroll={{ x: true }}
                />
            </Card>

            <SubcategoryForm
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                initialValues={editingSubcategory}
            />
        </div>
    );
};

export default SubcategoryList;
