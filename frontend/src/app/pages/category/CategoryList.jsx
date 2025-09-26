import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Space, Image, Tooltip, Tag, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { FormButton } from "../../components/common/forms/index";
import { ReusableTable, BreadcrumbItem } from "../../components/common/index";
import CategoryForm from "../../pages/category/CategoryForm";
import { fetchCategories, deleteCategory } from "../../store/slices/index";

const CategoryList = () => {
    const { categories, loading, error } = useSelector(state => state.category);
    const [modalOpen, setModalOpen] = useState(false);
    const [editCategory, setEditCategory] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Table columns config
    const columns = [
        {
            title: 'Category Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            sorter: (a, b) => a.quantity - b.quantity,
        },
        {
            title: 'Icon',
            render: (_, record, idx, onAction) => (
                <Image
                    src={record.file ? record.file.base64Url : null}
                    style={{ width: 50, height: 50, objectFit: "cover" }}
                />
            ),
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
            isAction: true,
            render: (_, record, idx, onAction) => (
                <Space>
                    <Tooltip title="Edit">
                        <Tag
                            color="geekblue"
                            icon={<EditOutlined />}
                            onClick={() => onAction && onAction('edit', record)}
                            size="small"
                        >
                            Edit
                        </Tag>
                    </Tooltip>
                    <Popconfirm
                        title="Are you sure you want to delete this category?"
                        onConfirm={() => onAction && onAction('delete', record)}
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        okText="Yes"
                        okButtonProps={{ style: { color: '#cf1322', backgroundColor: '#fff1f0', borderColor: '#ffa39e' } }}
                        cancelText="No"
                        cancelButtonProps={{ style: { color: '#1d39c4', backgroundColor: '#f0f5ff', borderColor: '#adc6ff' } }}
                    >
                        <Tooltip title="Delete">
                            <Tag
                                color="red"
                                icon={<DeleteOutlined />}
                                size="small"
                            >
                                Delete
                            </Tag>
                        </Tooltip>
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
        }
    };

    // Handle modal OK
    const handleModalOk = (success) => {
        if (success) {
            setModalOpen(false);
            setEditCategory(null);
        }
    };

    // Handle modal cancel
    const handleModalCancel = () => {
        setModalOpen(false);
        setEditCategory(null);
    };

    return (
        <>
            <Row style={{ marginBlockEnd: "10px" }}>
                <Col span={24}>
                    <BreadcrumbItem
                        items={[
                            {
                                title: 'Home',
                                path: '/dashboard'
                            },
                            {
                                title: 'Category',
                                path: '/category'
                            }
                        ]}
                    />
                </Col>
            </Row>
            <Row style={{ marginBlockEnd: "10px" }}>
                <Col span={12}>
                    <FormButton type='primary' variant='outlined' onClick={() => { setModalOpen(true); setEditCategory(null); }}>
                        + Add Category
                    </FormButton>
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
            />
        </>
    );
};

export default CategoryList;
