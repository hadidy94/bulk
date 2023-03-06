import { useState, useRef, useMemo, useCallback } from 'react';
import { Button } from '../UI/Button';
import { useQuery } from 'react-query';
import { getSellers } from '../../helpers/api/sellers';
import { uploadTemplate, getByBatchId } from '../../helpers/api/upload-template';
import { UploadOutlined } from '@ant-design/icons';
import { Modal, theme, Form, Input, Select, Upload, Progress } from 'antd';
import toast from "../Toast";

const { Option } = Select;
const { useToken } = theme;

interface FileDownload {
    name: string;
    file: string;
    sellers: string[];
};

function filterSellerData(data) {
    let newoption: any[] = [];
    if (data) {
        data.data.map(el => {
            newoption.push(
                {
                    id: el.id,
                    label: el.fullname
                }
            )
        })
    }
    return newoption;
}


export default function UploadBtn({ prefetchData }) {

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [progressJobs, setProgressJobs] = useState({
        pendingJobs: 0,
        processedJobs: 0,
        totalJobs: 0
    });

    const { token } = useToken();
    const selectRef = useRef();
    const [form] = Form.useForm();


    const { data, isLoading } = useQuery(['sellers'], () => getSellers());
    const optionResult = useMemo(() => filterSellerData(data), [data]);


    const notify = useCallback((type: string, message: string) => {
        toast({ type, message });
    }, []);

    const handleClose = () => {
        setOpen(false);
        form.resetFields();
    };
    const handleOpen = () => {
        setOpen(true)
    };

    const handlePrefetch = () => prefetchData(true);

    const onCreate = async (values: any) => {
        setConfirmLoading(true);
        const data = new FormData();
        data.append('name', values.name)
        data.append('file', values.upload[0].originFileObj)
        values.multipleSellers.map((el) => {
            data.append('sellers[]', el)
        })
        const result = await uploadTemplate(data);


        if (result.status) {

            var timer = setInterval(async function () {

                const batchResult = await getByBatchId(result.payload.batch_id);

                setProgressPercentage(batchResult.payload.batch.progress);

                setProgressJobs({
                    pendingJobs: batchResult.payload.batch.pendingJobs,
                    processedJobs: batchResult.payload.batch.processedJobs,
                    totalJobs: batchResult.payload.batch.totalJobs
                })
                if (batchResult.payload.batch.progress === 100) {
                    clearInterval(timer)
                    setTimeout(() => {
                        setConfirmLoading(false);
                        setProgressPercentage(0);
                        setOpen(false);
                        handlePrefetch();
                        form.resetFields();
                        notify('success', 'Added successfully');
                    }, 1500)
                };
            }, 500);
        }


    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <div>
            <Button onClick={handleOpen} className="btn-secondary-bm">Add Bulk products</Button>

            <Modal
                open={open}
                title="Upload File"
                okText="Upload"
                cancelText="Cancel"
                onCancel={handleClose}
                width={700}
                confirmLoading={confirmLoading}
                okButtonProps={{ size: 'large', style: { backgroundColor: token.colorPrimary } }}
                cancelButtonProps={{ size: 'large', disabled: confirmLoading }}
                maskClosable={false}
                closable={false}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            onCreate(values);
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}
            >

                {progressPercentage > 0 && <Progress strokeLinecap="butt" percent={progressPercentage} />}

                {progressPercentage > 0 && <div className='mb-6 mt-10 flex justify-around'>

                    <div className='text-center'>
                        <h6 className='mb-4 text-sm text-secondary'>pending Jobs</h6>
                        <h2 className='text-2xl'>{progressJobs.pendingJobs}</h2>
                    </div>

                    <div className='text-center'>
                        <h5 className='mb-4 text-sm text-secondary'>processed Jobs</h5>
                        <h2 className='text-2xl'>{progressJobs.processedJobs}</h2>
                    </div>

                    <div className='text-center'>
                        <h5 className='mb-4 text-sm text-secondary'>total Jobs</h5>
                        <h2 className='text-2xl'>{progressJobs.totalJobs}</h2>
                    </div>

                </div>
                }

                {progressPercentage == 0 &&
                    <Form
                        form={form}
                        layout="vertical"
                        name="form_in_modal"
                        initialValues={{ modifier: 'public' }}
                    >

                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: true, message: 'Please input the name of file!' }]}
                        >
                            <Input placeholder="Enter file name" />
                        </Form.Item>

                        {isLoading && <p>Loading</p>}
                        {!isLoading &&
                            <Form.Item
                                name="multipleSellers"
                                label="Sellers"
                                rules={[{ required: true, message: 'Please select sellers!' }]}
                            >
                                <Select
                                    ref={selectRef}
                                    mode="multiple"
                                    placeholder="Please select sellers"
                                    onChange={() => selectRef.current.blur()}>
                                    {optionResult.map((el) => (
                                        <Option key={el.id} value={el.id}>{el.label}</Option>

                                    ))}

                                </Select>
                            </Form.Item>

                        }
                        
                        <Form.Item
                            name="upload"
                            label="Upload"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            rules={[{ required: true, message: 'Please upload  the file!' }]}
                        >
                            <Upload name="logo" action="/upload.do" listType="picture">
                                <Button icon={<UploadOutlined />}>Click to upload</Button>
                            </Upload>
                        </Form.Item>
                    </Form>
                }
            </Modal>


        </div>
    );
}

