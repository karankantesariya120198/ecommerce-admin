import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Badge, Button, Card, Col, Image, Popconfirm, Row, Space, Tag } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { BreadcrumbItem, ReusableTable } from "../../components/common";
import { FormButton } from "../../components/common/forms";
import { SubcategoryForm } from "../index";
import { fetchSubcategories, deleteSubcategory } from '../../store/slices/index'

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

    // Action handler for table
    const handleTableAction = (action, record) => {
        if (action === 'edit') {
            setEditingSubcategory(record);
            setIsModalVisible(true);
        } else if (action === 'delete') {
            dispatch(deleteSubcategory(record.id))
                .then(() => dispatch(fetchSubcategories()))
                .catch(err => console.error('Error deleting subcategory:', err));
        } else if (action === 'view') {
            navigate(`/subcategories/${record.id}`);
        }
    };

    const handleModalOk = (success) => {
        if (success) {
            setIsModalVisible(false);
            setEditingSubcategory(null);
            fetchData(); // Refresh table after add/update
        }
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setEditingSubcategory(null);
    };

    const columns = [
        {
            title: 'Subcategory',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'relative', marginRight: 10 }}>
                        {record.featured && (
                            <Badge.Ribbon text="Featured" style={{ top: -10, left: -10, zIndex: 1, background: 'linear-gradient(135deg, #6153e19c, #04c0fe80)' }} />
                        )}
                        <Image
                            width={75}
                            height={75}
                            src={record.file ? record.file.base64Url : null}
                            alt={text}
                            style={{ objectFit: 'cover', borderRadius: 4 }}
                        />
                    </div>
                    <div>
                        <div style={{ fontWeight: 500 }}>{text}</div>
                        <div style={{ color: '#8c8c8c', fontSize: '12px' }}>{record.slug}</div>
                    </div>
                </div>
            ),
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Category',
            dataIndex: 'category_name',
            key: 'category_name',
            sorter: (a, b) => a.category_name.localeCompare(b.category_name),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text) => (
                <div style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {text}
                </div>
            ),
            sorter: (a, b) => a.description.localeCompare(b.description),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status ? 'green' : 'red'}>
                    {status ? 'Active' : 'Inactive'}
                </Tag>
            ),
            sorter: (a, b) => a.status - b.status,
        },
        {
            title: 'Created At',
            render: (_, record) => !record.created_at ? null : new Date(record.created_at).toLocaleString(),
            sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
        },
        {
            title: 'Updated At',
            render: (_, record) => !record.updated_at ? null : new Date(record.updated_at).toLocaleString(),
            sorter: (a, b) => new Date(a.updated_at) - new Date(b.updated_at),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => handleTableAction('view', record)}
                    >
                            View
                    </Button>
                    <Button 
                        icon={<EditOutlined />} 
                        size="small"
                        onClick={() => handleTableAction('edit', record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this category?"
                        description="This will also delete all subcategories and products under this category."
                        onConfirm={() => handleTableAction('delete', record)}
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
        <>
            <Row style={{ marginBlockEnd: "20px" }}>
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

            <Card
                style={{ 
                    boxShadow: '0 10px 12px rgba(0,0,0,0.06)',
                    borderRadius: 16,
                }}
            >
                <Row style={{ marginBlockEnd: "20px" }}>
                    <Col span={12}>
                        <h2 style={{ margin: 0 }}>Subcategories</h2>
                        <p style={{ margin: 0, color: '#8c8c8c' }}>Manage your subcategories</p>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right', alignItems: 'center', display: 'flex', justifyContent: 'flex-end' }}>
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
                <Row>
                    <Col span={24}>
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
                    </Col>
                </Row>
            </Card>

            <SubcategoryForm
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                initialValues={editingSubcategory}
            />
        </>
    );
};

export default SubcategoryList;
