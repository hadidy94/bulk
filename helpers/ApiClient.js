import axios from 'axios'
import { getSession, signOut } from 'next-auth/react';


const ApiClient = () => {
    const instance = axios.create({
        baseURL: process.env.API_URL,
    })
    instance.interceptors.request.use(async (request) => {
        request.headers = {
            'Content-Type': 'application/json',
            'Content-Type': 'multipart/form-data',
            'accept': 'application/json',
        }
        const session = await getSession()

        if (session) {
            request.headers.Authorization = `Bearer ${session.accessToken}`;
        }
        return request
    })

    instance.interceptors.response.use(
        (response) => {
            return response.data
        },
        async (error) => {
            console.log(error.response.status);

            if (error.response.status == 401) {
                await signOut();
            }
            return Promise.reject(error.response);

        }
    )

    return instance
}

export default ApiClient()