import { useRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Col, Form, Row, Modal, Upload, Button, Input } from "antd";
import { FormButton, FormCheckbox, FormInput, FormSelect } from "../../components/common/forms";
import { MessageNotification } from "../../components/common";
import { addProduct, updateProduct } from "../../store/slices/index";
import { fetchCategories, fetchSubcategories } from "../../store/slices/index";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";

const ProductForm = ({ open, onOk, onCancel, initialValues }) => {
    const [form] = Form.useForm();
    const fileRef = useRef();
    const { contextHolder, show } = MessageNotification();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [subcategoryOptions, setSubcategoryOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const categories = await dispatch(fetchCategories());
            if (categories) {
                let data = categories.payload.map(cat => ({ value: cat.id, label: cat.name }));
                setCategoryOptions(data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSubcategoriesByCategory = async (categoryId) => {
        try {
            setLoading(true);
            const subcategories = await dispatch(fetchSubcategories(categoryId));
            if (subcategories) {
                let data = subcategories.payload.map(sub => ({ value: sub.id, label: sub.name }));
                setSubcategoryOptions(data);
            } else {
                setSubcategoryOptions([]);
            }
        } catch (error) {
            setSubcategoryOptions([]);
            console.error("Error fetching subcategories:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories and subcategories when modal opens
    useEffect(() => {
        fetchData();
        setSubcategoryOptions([]);
        setSelectedCategory(null);
    }, [open]);

    // Listen for category change
    const handleCategoryChange = value => {
        setSelectedCategory(value);
        form.setFieldsValue({ subcategoryId: undefined });
        setSubcategoryOptions([]);
        if (value) {
            fetchSubcategoriesByCategory(value);
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (initialValues) {
                // Edit category
                dispatch(updateProduct({ id: initialValues.id, data: values }));
                show("success", "Product updated successfully.");
            } else {
                // Create category
                dispatch(addProduct(values));
                show("success", "Product added successfully.");
            }
            form.resetFields();
            onOk(true);
        } catch (error) {
            if (error?.response) {
                if (error.response.status === 400 && error.response.data?.errors) {
                    const serverErrors = error.response.data.errors;
                    const fieldErrors = Object.keys(serverErrors).map(key => ({
                        name: key,
                        errors: [serverErrors[key]]
                    }));
                    form.setFields(fieldErrors);
                } else if (error.response.status === 409) {
                    show("error", error.response.data?.error || "Product name already exists.");
                } else {
                    // Other known server errors
                    show("error", error.response.data?.message || "Something went wrong.");
                }
            } else {
                console.error("Category operation error:", error?.stack || error);
            }
        }
    };

    const handleCancel = () => {
        onCancel();
        form.resetFields();
    };

    // Set initial values for edit (useEffect instead of render)
    useEffect(() => {
        if (open && initialValues) {
            form.setFieldsValue({
                name: initialValues.name,
                sku: initialValues.sku,
                price: initialValues.price,
                originalPrice: initialValues.originalPrice,
                stock: initialValues.stock,
                categoryId: initialValues.categoryId,
                subcategoryId: initialValues.subcategoryId,
                description: initialValues.description,
                icons: initialValues.iconsUrl
                    ? initialValues.iconsUrl.map((icon, index) => ({
                            uid: icon.uid || `icon-${index}`,
                            thumbUrl: icon.thumbUrl,
                            name: icon.name,
                            size: icon.size,
                            type: icon.type,
                        }))
                    : [],
                status: initialValues.status,
                featured: initialValues.featured,
                specifications: initialValues.specifications || [],
            });
        } else if (open && !initialValues) {
            form.resetFields();
        }
    }, [open, initialValues]);

    return (
        <Modal
            title = {
                <div key="header" className="gradient-text-btn" style={{ borderBottom: '1px solid #eee', paddingBottom: 15, fontSize: '20px', fontWeight: 'bold'}}>
                    <span>{initialValues ? "Edit Product" : "Add Product"}</span>
                </div>
            }
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            width={700}
            style={{ top: 80 }}
            footer={[
                <div key="footer" style={{ borderTop: '1px solid #eee', paddingTop: 15, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <FormButton
                        htmlType="button"
                        type="danger"
                        children="Cancel"
                        onClick={handleCancel}
                    />
                    <FormButton
                        children="Submit"
                        htmlType="submit"
                        type="primary"
                        onClick={handleOk}
                    />
                </div>
            ]}
            closable={false} // Remove close icon in the header
        >
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                name="productForm"
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <FormInput
                            name="name"
                            label="Product Name"
                            placeholder="Enter product name"
                            rules={[{ required: true, message: 'Please enter product name' }]}
                            style={{ width: "100%" }}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            name="sku"
                            label="SKU"
                            placeholder="Enter SKU"
                            rules={[{ required: true, message: 'Please enter SKU' }]}
                            style={{ width: "100%" }}
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <FormInput
                            name="price"
                            label="Price"
                            type="number"
                            placeholder="0.00"
                            rules={[{ required: true, message: 'Please enter price' }]}
                            prefix="$"
                            style={{ width: "100%" }}
                        />
                    </Col>
                    <Col span={8}>
                        <FormInput
                            name="originalPrice"
                            label="Original Price"
                            type="number"
                            placeholder="0.00"
                            prefix="$"
                            style={{ width: "100%" }}
                        />
                    </Col>
                    <Col span={8}>
                        <FormInput
                            name="stock"
                            label="Stock Quantity"
                            type="number"
                            placeholder="0"
                            rules={[{ required: true, message: 'Please enter stock quantity' }]}
                            style={{ width: "100%" }}
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <FormSelect
                            name="categoryId"
                            label="Category"
                            placeholder="Select category"
                            rules={[{ required: true, message: 'Please select a category' }]}
                            options={categoryOptions}
                            onChange={handleCategoryChange}
                        />
                    </Col>
                    <Col span={12}>
                        <FormSelect
                            name="subcategoryId"
                            label="Subcategory"
                            placeholder="Select subcategory"
                            rules={selectedCategory ? [{ required: true, message: 'Please select a subcategory' }] : []}
                            options={selectedCategory ? subcategoryOptions : []}
                        />
                    </Col>
                </Row>
                
                <Row gutter={16}>
                    <Col span={12}>
                        <FormInput
                            name="description"
                            label="Product Description"
                            type="textarea"
                            placeholder="Please enter product description"
                            rules={[{ required: true, message: 'Please enter product description' }]}
                            style={{ width: "100%" }}
                            inputProps={{ style: { width: "100%" } }}
                        />
                    </Col>
                    <Col span={6}>
                        <FormSelect
                            name="status"
                            label="Status"
                            placeholder="Select status"
                            rules={[{ required: true, message: 'Please select status' }]}
                            options={[
                                { value: "published", label: "Published" },
                                { value: "draft", label: "Draft" },
                            ]}
                        />
                    </Col>
                    <Col span={6}>
                        <FormCheckbox
                            name="featured"
                            label="Featured"
                            valuePropName="checked"
                        />
                    </Col>
                </Row>

                <Form.Item
                    name="icons"
                    label="Product Images"
                    valuePropName="fileList"
                    getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList}
                    rules={[{ required: true, message: 'Please upload product images' }]}
                    style={{ width: "100%" }}
                >
                    <Upload
                        name="icon"
                        listType="picture"
                        maxCount={10}
                        beforeUpload={() => false}
                        accept="image/*"
                        ref={fileRef}
                        defaultFileList={[]}
                        style={{ width: "100%" }}
                    >
                        <Button icon={<UploadOutlined />} style={{ width: "100%", textAlign: "left" }}>Click to Upload</Button>
                    </Upload>
                </Form.Item>

                <Form.Item
                    name="specifications"
                    label="Specifications"
                >
                    <Form.List name="specifications">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Row key={key} gutter={8} style={{ marginBottom: 8 }}>
                                        <Col span={10}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'key']}
                                                rules={[{ required: true, message: 'Missing key' }]}
                                            >
                                                <Input placeholder="Specification name" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'value']}
                                                rules={[{ required: true, message: 'Missing value' }]}
                                            >
                                                <Input placeholder="Specification value" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={2}>
                                            <Button
                                                type="text"
                                                danger
                                                onClick={() => remove(name)}
                                                style={{ marginTop: 4 }}
                                            >
                                                Remove
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        block
                                        icon={<PlusOutlined />}
                                    >
                                        Add Specification
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ProductForm;