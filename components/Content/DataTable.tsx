import React, { useState, useCallback } from "react";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Link from '../Link';
import ModelUI from '../UI/ModelUI';
import { Button } from '../UI/Button';
import { deleteProductById, deleteMultibleProducts } from '@/helpers/api/products';
import toast from "../Toast";


interface BulkData  {
    data: any;
    prefetchData(event: boolean): boolean;
};
export default function DataTable({ data, prefetchData }: BulkData) {
    const [List, setList] = useState(data);
    const [openDeleteModel, setOpenDeleteModel] = useState(false);
    const [openLogModel, setOpenLogModel] = useState(false);
    const [deletedData, setDeletedData] = useState({
        id: 0,
        name: '',
    });

    const [MasterChecked, setMasterChecked] = useState(false);
    const [SelectedList, setSelectedList] = useState([]);
    const [logData, setLogData] = useState([]);

    const notify = useCallback((type: string, message: string) => {
        toast({ type, message });
    }, []);

    const onMasterCheck = (e: any) => {
        let tempList = List;
        tempList.map((user: any) => (user.selected = e.target.checked));

        setList(tempList);
        setMasterChecked(e.target.checked);
        setSelectedList(List.filter((e: any) => e.selected))
    }

    const onItemCheck = (e: any, item: any) => {
        let tempList = List;
        tempList.map((user: any) => {
            if (user.id === item.id) {
                user.selected = e.target.checked;
            }
            return user;
        });

        const totalItems = List.length;
        const totalCheckedItems = tempList.filter((e: any) => e.selected).length;


        setList(tempList);
        setMasterChecked(totalItems === totalCheckedItems);
        setSelectedList(List.filter((e: any) => e.selected))
    }

    const getSelectedRows = () => {
        setSelectedList(List.filter((e: any) => e.selected))
    }

    const handleDeleteModelClose = () => {
        setOpenDeleteModel(false)
    };
    const handleDeleteModelOpen = () => {
        setOpenDeleteModel(true)
    };

    const handleLogModelClose = () => {
        setOpenLogModel(false)
    };
    const handleLogModelOpen = () => {
        setOpenLogModel(true)
    };

    const handleMultibleProduct = async () => {
        let products: any[] = [];
        SelectedList.map(((el: any) => {
            products.push(el.id)
        }))
        const selectProducts = {
            products,
        }
        const result = await deleteMultibleProducts(selectProducts);
        console.log(result);
        if (result.status) {
            notify('success', 'Deleted successfully');
        }
        prefetchData(true)
    }

    const handleDeleteAction = async (id: any) => {
        const result = await deleteProductById(id);
        if (result.status) {
            notify('success', 'Deleted successfully');
        }
        setOpenDeleteModel(false)
        prefetchData(true)
    }


    const handleDeleteModel = async (event: any, id: any, name: any) => {
        event.preventDefault();
        setDeletedData({
            id,
            name
        })
        setOpenDeleteModel(true)
    }

    const handleLogModel = async (log: any) => {
        setLogData(log);
        console.log(logData);
        setOpenLogModel(true);

    }


    return (
        <>
            <div className="my-8 flex justify-end items-center">
                <div className="form-group mr-10">
                    <input
                        type="checkbox"
                        className="form-check-input mr-3"
                        checked={MasterChecked}
                        id="mastercheck"
                        onChange={(e) => onMasterCheck(e)}
                    />
                    <label htmlFor="mastercheck">Select all</label>
                </div>

                <button
                    className="btn btn-dark-gray"
                    onClick={() => handleMultibleProduct()}
                    disabled={SelectedList.length == 0}>Delete</button>

            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell> </TableCell>
                            <TableCell align="center">BM-Code</TableCell>
                            <TableCell align="center">Title</TableCell>
                            <TableCell align="center">Category</TableCell>
                            <TableCell align="center">Model</TableCell>
                            <TableCell align="center">Brand</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.map((row: any) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                className={row.selected ? "selected" : ""}
                            >
                                <TableCell component="th" scope="row">
                                    <input
                                        type="checkbox"
                                        checked={row.selected}
                                        className="form-check-input"
                                        id="rowcheck{user.id}"
                                        onChange={(e: any) => onItemCheck(e, row)}
                                    />
                                </TableCell>
                                <TableCell align="center">__</TableCell>
                                <TableCell align="center">{row.name_en}</TableCell>
                                <TableCell align="center">{row.category}</TableCell>
                                <TableCell align="center">{row.model}</TableCell>
                                <TableCell align="center">{row.brand}</TableCell>
                                <TableCell align="center">{row.has_log ? 'Invalid' : 'Valid'}</TableCell>
                                <TableCell align="center">
                                    <div className='flex gap-4 justify-center align-baseline'>
                                        {row.has_log &&
                                            <Button onClick={() => handleLogModel(row.logs)} className="btn btn-dark-gray">Log</Button>
                                        }
                                        <Link href={`/products/${row.id}`} className="btn btn-gray"> Details </Link>
                                        <Button onClick={(event) => handleDeleteModel(event, row.id, row.name_en)} className="btn btn-bm">Delete</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <ModelUI width={'500'} IsModalOpened={openDeleteModel}>
                <h5 className='text-xl text-centermt-5 font-bold text-center'>{deletedData.name}</h5>
                <p className='my-4 text-center text-secondary'>Are you sure you want to delete product {deletedData.name}?</p>
                <div className='flex gap-4 justify-center align-baseline mt-5'>
                    <Button className="btn btn-bm" onClick={() => handleDeleteAction(deletedData.id)}>Delete</Button>
                    <a onClick={handleDeleteModelClose} className="btn-secondary-bm p-3">Cancel</a>
                </div>
            </ModelUI>


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
