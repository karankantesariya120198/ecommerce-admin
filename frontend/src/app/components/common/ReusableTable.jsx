import { Table, Input, Row, Col } from "antd";
import { useState, useMemo } from "react";

/**
 * ReusableTable - a generic table component for Ant Design
 * @param {Array} columns - columns config (can include action renderers)
 * @param {Array} dataSource - data array
 * @param {boolean} loading - loading state
 * @param {string} rowKey - unique key for each row
 * @param {function} onAction - callback for action events (e.g., edit/delete)
 * @param {object} rest - any other Table props
 */
/**
 * Props:
 * columns: Table columns config
 * dataSource: Array of data
 * loading: Boolean
 * rowKey: String
 * onAction: Function
 * searchKey: String (column to search)
 * showSearch: Boolean (show search input)
 * showTotal: Boolean (show total items)
 * pageSizeOptions: Array (page size options)
 */
const ReusableTable = ({
    columns,
    dataSource,
    loading,
    rowKey = 'id',
    onAction,
    searchKey = '',
    showSearch = true,
    showTotal = true,
    pageSizeOptions = ['5', '10', '20', '50'],
    ...rest
}) => {
    const [searchText, setSearchText] = useState("");
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });

    // Enhance columns to inject onAction handler if needed
    const enhancedColumns = columns.map(col => {
        if (col.isAction && typeof col.render === 'function') {
            return {
                ...col,
                render: (text, record, index) => col.render(text, record, index, onAction)
            };
        }
        return col;
    });

    // Filter data by search
    const filteredData = useMemo(() => {
        if (!searchKey || !searchText) return Array.isArray(dataSource) ? dataSource : [];
        if (!searchKey || !searchText) return dataSource;
        return dataSource.filter(item =>
            String(item[searchKey] || "").toLowerCase().includes(searchText.toLowerCase())
        );
    }, [dataSource, searchKey, searchText]);

    const totalItems = filteredData.length;
    const paginatedData = useMemo(() => {
        return filteredData.slice(
            (pagination.current - 1) * pagination.pageSize,
            pagination.current * pagination.pageSize
        );
    }, [filteredData, pagination]);

    return (
        <>
            {(showSearch && searchKey) && (
                <Row style={{ marginBottom: 12 }}>
                    <Col span={12} style={{ fontWeight: 500 }}>
                        Total Items: {totalItems}
                    </Col>
                    {showTotal && (
                        <Col span={12} style={{ textAlign: 'right', fontWeight: 500 }}>
                            <Input.Search
                                placeholder={`Search by ${rest.searchPlaceholder ?? searchKey}`}
                                allowClear
                                value={searchText}
                                onChange={e => {
                                    setSearchText(e.target.value);
                                    setPagination(p => ({ ...p, current: 1 }));
                                }}
                                style={{ width: 240 }}
                            />
                        </Col>
                    )}
                </Row>
            )}
            <Table
                columns={enhancedColumns}
                dataSource={paginatedData}
                loading={loading}
                rowKey={rowKey}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: totalItems,
                    showSizeChanger: true,
                    pageSizeOptions,
                    onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                }}
                {...rest}
            />
        </>
    );
};

export default ReusableTable;
