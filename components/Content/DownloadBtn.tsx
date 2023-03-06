import { useState, useCallback } from 'react';
import { getTemplate } from '../../helpers/api/download-template';
import { useQuery } from 'react-query';
import { Button } from '../UI/Button';
import { useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import ModelUI from '../UI/ModelUI';
import toast from "../Toast";



interface FileDownload {
    units: number;
    features: number;
    related_link: number;
    additional_information: number;
};

export default function DownloadButton() {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();


    const notify = useCallback((type: string, message: string) => {
        toast({ type, message });
    }, []);


    const handleClose = () => {
        setOpen(false)
    };
    const handleOpen = () => {
        setOpen(true)
    };

    const { register, errors, handleSubmit } = useForm<FileDownload>({
        mode: 'onChange'
    });

    const { mutate, isLoading } = useMutation(getTemplate, {
        onSuccess: data => {
            const link = document.createElement('a');
            link.href = data.payload.url;
            link.setAttribute('download', `${Date.now()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            setOpen(false)
        },
        onError: (error: string) => {
            notify("error", error.data.message)
        },
        onSettled: () => {
            queryClient.invalidateQueries('create');
        }
    });
    const onSubmit = (data: FileDownload) => {
        const requiredData = {
            ...data
        };
        mutate(requiredData);
    };

    return (
        <>
            <Button onClick={handleOpen} className="btn-bm">Download template</Button>


            <ModelUI width={'800'} IsModalOpened={open}>
                <h5 className='mb-5 text-xl'>Download template</h5>

                <form className='my-5' onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5'>
                        <input
                            {...register("units", { required: true, max: 50 })}
                            type="number"
                            className="form-input w-full px-4 py-3 rounded"
                            placeholder='Number of Units'
                            aria-invalid={errors?.units ? "true" : "false"}
                        />

                        <input
                            {...register("features", { required: true, max: 50 })} type="number"
                            className="form-input w-full px-4 py-3 rounded" placeholder='Number of Features' />

                        <input
                            {...register("related_link", { required: true, max: 50 })} type="number"
                            className="form-input w-full px-4 py-3 rounded"
                            placeholder='Number of Related Link' />
                        <input
                            {...register("additional_information", { required: true, max: 50 })} type="number"
                            className="form-input w-full px-4 py-3 rounded"
                            placeholder='Number of Additional Information' />
                    </div>

                    <div className='mt-6 flex gap-4 justify-end'>
                        <Button type='submit' className="btn-bm" disabled={isLoading}>{isLoading ? "Loading..." : "Send"}</Button>
                        <a onClick={handleClose} className="btn-secondary-bm p-3">Cancel</a>
                    </div>

                </form>

            </ModelUI>
        </>
    );
}

