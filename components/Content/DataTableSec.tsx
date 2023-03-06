import React, { useState, useCallback } from "react";

import Link from 'next/link';
import ModelUI from '../UI/ModelUI';
// import { Button } from '../UI/Button';
import { deleteProductById, deleteMultibleProducts } from '@/helpers/api/products';
import toast from "../Toast";
import type { ColumnsType, TableProps } from 'antd/es/table';

import { Space, Table, Tag, Modal, theme, Button } from 'antd';




interface BulkData {
    data: any;
    prefetchData(event: boolean): boolean;
    handlePageClick(page: number): number;
};

interface logType {
    id: number;
    bulk_upload_request_product_id: number;
    log: string;
}
interface DataType {
    id: number;
    code: string;
    name_en: string;
    category: string;
    brand: string;
    model: string;
    has_log: boolean;
    logs: logType;
}

export default function DataTableSec({ data, prefetchData, handlePageClick }: BulkData) {

    const [openDeleteModel, setOpenDeleteModel] = useState(false);

    const [openLogModel, setOpenLogModel] = useState(false);
    const [deletedData, setDeletedData] = useState({
        id: 0,
        name: '',
    });
    const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
    const [deleteAllLoading, setDeleteAllLoading] = useState(false);

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [logData, setLogData] = useState([]);

    const notify = useCallback((type: string, message: string) => {
        toast({ type, message });
    }, []);


    const { useToken } = theme;
    const { token } = useToken();


    const handleDeleteModelClose = () => {
        setOpenDeleteModel(false)
    };

    const handleLogModelClose = () => {
        setOpenLogModel(false)
    };
    const handleLogModelOpen = () => {
        setOpenLogModel(true)
    };




    const handleLogModel = async (log: any) => {
        setLogData(log);
        console.log(logData);
        setOpenLogModel(true);
    }

    const showDeleteConfirm = (id: number, name: string) => {
        setOpenDeleteModel(true);
        setDeletedData({
            id,
            name,
        })
    };

    const handleDeleteOk = async () => {
        setConfirmDeleteLoading(true);
        const result = await deleteProductById(deletedData?.id);
        if (result.status) {
            setOpenDeleteModel(false)
            setConfirmDeleteLoading(false);
            notify('success', 'Deleted successfully');
        }
        prefetchData(true)
    }

    const columns: ColumnsType<DataType> = [
        {
            title: 'BM-Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Title',
            dataIndex: 'name_en',
            key: 'name_en',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Model',
            dataIndex: 'model',
            key: 'model',
        },
        {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand',
        },
        {
            title: 'Status',
            key: 'has_log',
            dataIndex: 'has_log',
            render: (has_log: string) => (
                <Tag color={has_log ? 'error' : 'warning'}>
                    {has_log ? 'Invalid' : 'Valid'}
                </Tag>),

        },
        {
            title: 'Action',
            key: 'action',

            render: (_, record) => (
                <Space size="middle">
                    {record.has_log &&
                        <Button onClick={(e) => showDeleteConfirm(record.id, record.name)} className="btn btn-dark-gray">Log</Button>
                    }
                    <Link href={`/lists/${record.id}`} className="btn btn-gray"> Details </Link>
                    <Button type="primary" onClick={(e) => showDeleteConfirm(record.id, record.name)}>Delete</Button>
                </Space>
            ),
        },
    ];

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const start = () => {
        setDeleteAllLoading(true);
        // ajax request after empty completing
        setTimeout(() => {
          setSelectedRowKeys([]);
          setDeleteAllLoading(false);
        }, 1000);
      };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;

    const onTableChange = (page: number) => {
        handlePageClick(page)
    };


    return (
        <>
            <div className="my-8 flex justify-end items-center">


                {/* <button
                    className="btn btn-dark-gray"
                    onClick={() => handleMultibleProduct()}
                    disabled={SelectedList.length == 0}>Delete</button> */}

                <div style={{ marginBottom: 16 }}>
                    <Button className="btn btn-dark-gray" onClick={start} disabled={!hasSelected} loading={deleteAllLoading}>
                        Reload
                    </Button>
                    <span style={{ marginLeft: 8 }}>
                        {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                    </span>
                </div>

            </div>

            <Modal
                title={`Delete  ${deletedData?.name} `}
                open={openDeleteModel}
                onOk={handleDeleteOk}
                okText="Yes, delete"
                confirmLoading={confirmDeleteLoading}
                onCancel={handleDeleteModelClose}
                okButtonProps={{ size: 'large', style: { backgroundColor: token.colorPrimary } }}
                cancelButtonProps={{ size: 'large', }}
            >
                <p>you want to delete list # {deletedData?.name}?</p>
            </Modal>



            <Table
                rowSelection={rowSelection}
                rowKey={record => record.id}
                columns={columns}
                dataSource={data?.payload.data}
                pagination={{
                    defaultPageSize: data?.payload.meta.per_page,
                    current: data?.payload.meta.current_page,
                    total: data?.payload.meta.total,
                    showSizeChanger: false,
                    onChange: onTableChange,
                }} />



            {/* <ModelUI width={'500'} IsModalOpened={openDeleteModel}>
                <h5 className='text-xl text-centermt-5 font-bold text-center'>{deletedData.name}</h5>
                <p className='my-4 text-center text-secondary'>Are you sure you want to delete product {deletedData.name}?</p>
                <div className='flex gap-4 justify-center align-baseline mt-5'>
                    <Button className="btn btn-bm" onClick={() => handleDeleteAction(deletedData.id)}>Delete</Button>
                    <a onClick={handleDeleteModelClose} className="btn-secondary-bm p-3">Cancel</a>
                </div>
            </ModelUI> */}


            <ModelUI width={'500'} IsModalOpened={openLogModel}>
                <h5 className='text-xl text-centermt-5 font-bold text-center'>Log Data</h5>
                {logData.map((dataEl: any) => (
                    <p key={dataEl.id} className='my-4 text-secondary'>{dataEl.log}</p>

                ))}

                <div className='flex gap-4 justify-center align-baseline mt-5'>
                    <a onClick={handleLogModelClose} className="btn-secondary-bm p-3">Cancel</a>
                </div>

            </ModelUI>

        </>
    );

}
