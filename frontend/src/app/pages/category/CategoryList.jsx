import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Row, Col, Space, Image, Tag, Popconfirm, Button, Badge, Card } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined, AppstoreOutlined, PlusOutlined } from '@ant-design/icons';
import { FormButton } from "../../components/common/forms/index";
import { ReusableTable, BreadcrumbItem } from "../../components/common/index";
import CategoryForm from "../../pages/category/CategoryForm";
import { fetchCategories, deleteCategory } from "../../store/slices/index"; 

const CategoryList = () => {
    const { categories, loading, error } = useSelector(state => state.category);
    const [modalOpen, setModalOpen] = useState(false);
    const [editCategory, setEditCategory] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Table columns config
    const columns = [
        {
            title: 'Category',
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
                            style={{ objectFit: 'cover', borderRadius: 10, pointerEvents: 'cursor', backgroundColor: '#f0f0f0' }}
                        />
                    </div>
                    <div>
                        <div style={{ fontWeight: 500 }}>{text}</div>
                        <div style={{ color: '#8c8c8c', fontSize: '12px', pointerEvents: 'cursor' }}>{record.slug}</div>
                    </div>
                </div>
            ),
            sorter: (a, b) => a.name.localeCompare(b.name),
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
        },
        {
            title: 'Created At',
            render: (_, record) => !record.created_at ? null : new Date(record.created_at).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
            sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
        },
        {
            title: 'Updated At',
            render: (_, record) => !record.updated_at ? null : new Date(record.updated_at).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
            sorter: (a, b) => new Date(a.updated_at) - new Date(b.updated_at),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 250,
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

    // Action handler for table
    const handleTableAction = (action, record) => {
        if (action === 'edit') {
            setEditCategory(record);
            setModalOpen(true);
        } else if (action === 'delete') {
            dispatch(deleteCategory(record.id))
                .then(() => dispatch(fetchCategories()))
                .catch(err => console.error('Error deleting category:', err));
        } else if (action === 'view') {
            navigate(`/categories/${record.id}`);
        }
    };

    // Handle modal OK
    const handleModalOk = (success) => {
        if (success) {
            setModalOpen(false);
            setEditCategory(null);
            dispatch(fetchCategories());
        }
    };

    // Handle modal cancel
    const handleModalCancel = () => {
        setModalOpen(false);
        setEditCategory(null);
    };

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
                                title: 'Category',
                                path: '/categories'
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
                        <h2 style={{ margin: 0 }}>Categories</h2>
                        <p style={{ margin: 0, color: '#8c8c8c' }}>Manage your categories</p>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right', alignItems: 'center', display: 'flex', justifyContent: 'flex-end' }}>
                        <Space>
                            <FormButton
                                type='primary'
                                variant='outlined'
                                icon={<PlusOutlined />}
                                onClick={() => { setModalOpen(true); setEditCategory(null); }}
                            >
                                Add Category
                            </FormButton>
                        </Space>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <ReusableTable
                            rowKey='id'
                            loading={loading}
                            dataSource={categories}
                            columns={columns}
                            onAction={handleTableAction}
                            searchKey="name"
                            showSearch={true}
                            showTotal={true}
                            pageSizeOptions={['5', '10', '20', '50']}
                            searchPlaceholder="category name"
                        />
                    </Col>
                </Row>
                <CategoryForm
                    open={modalOpen}
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                    initialValues={editCategory}
                    data={categories}
                />
            </Card>
        </>
    );
};

export default CategoryList;
