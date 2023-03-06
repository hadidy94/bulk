import React, { useState, useCallback } from 'react';
import { Button } from '../UI/Button';
import { Space, Table, Tag, Modal, theme } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { deleteBulkList } from '../../helpers/api/upload-template';


import Link from '../Link';
import toast from "../Toast";






interface DataType {
    id: number;
    name: string;
    owner: string;
    sellers: string[];
    status: string;
    created_at: string;
}

interface BulkData  {
    data: any;
    prefetchData(event: boolean): boolean;
    handlePageClick(page: number): number;
};

function BulkListsTable({ data, prefetchData, handlePageClick }: BulkData) {
    const [open, setOpen] = useState(false);
    const [deletedData, setDeletedData] = useState({id: 0, name: ''});
    const [confirmLoading, setConfirmLoading] = useState(false);


    const { useToken } = theme;
    const { token } = useToken();

    const notify = useCallback((type: string, message: string) => {
        toast({ type, message });
    }, []);


    const handleOk = async () => {
        setConfirmLoading(true);
        const result = await deleteBulkList(deletedData?.id);
        if (result.status) {
            setOpen(false);
            setConfirmLoading(false);
            notify('success', 'Deleted successfully');
        }
        prefetchData(true)
    };

    const handleCancel = () => {
        setOpen(false);
    };


    const showDeleteConfirm = (id: number, name: string) => {
        setOpen(true);
        setDeletedData({
            id,
            name,
        })
    };

    const onTableChange = (page: number) => {
        handlePageClick(page)
    };

    const columns: ColumnsType<DataType> = [
        {
            title: 'List',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Owner',
            dataIndex: 'owner',
            key: 'owner',
        },
        {
            title: 'Seller',
            dataIndex: 'seller',
            key: 'seller',
            render: (_, { sellers }) => (
                <>
                    {sellers?.map((seller: any) => {
                        return (
                            <Tag key={seller.id}>
                                {seller.full_name}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (status: string) => (
                <Tag color={status === 'Draft' ? 'error' : 'warning'}>
                    {status}
                </Tag>),

        },

        {
            title: 'Created at',
            key: 'created_at',
            dataIndex: 'created_at',
            render: (created_at: string) => (
                <span>
                    {new Date(created_at).toLocaleString()}
                </span>),
        },

        {
            title: 'Action',
            key: 'action',

            render: (_, record) => (
                <Space size="middle">
                    <Link href={`/lists/${record.id}`} className="btn btn-gray p-2 py-2 px-4"> Details </Link>
                    {record.status === 'Draft' &&
                        <Button onClick={(e) => showDeleteConfirm(record.id, record.name)} className="btn btn-bm p-2 py-2 px-4">Delete</Button>
                    }
                </Space>
            ),
        },
    ];


    return (
        <>

            <Modal
                title={`Delete  ${deletedData?.name} `}
                open={open}
                onOk={handleOk}
                okText="Yes, delete"
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                okButtonProps={{ size: 'large', style: { backgroundColor: token.colorPrimary } }}
                cancelButtonProps={{ size: 'large', }}
            >
                <p>you want to delete list # {deletedData?.name}?</p>
            </Modal>


            <Table
                rowKey={record => record.id}
                columns={columns}
                dataSource={data?.payload.data}
                pagination={{
                    defaultPageSize: data?.payload.meta.per_page,
                    current: data?.payload.meta.current_page,
                    total: data?.payload.meta.total,
                    onChange: onTableChange,
                }} />
        </>
    );
}

export default BulkListsTable;