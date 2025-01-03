import axios, { AxiosResponse } from 'axios';

// interface Post {
//     userId: number;
//     id?: number; // Optional, as it may be generated by the server
//     title: string;
//     body: string;
// }

const API_URL = 'https://submissionservice.parthmern.store';


export default async function postDataToSubmissionService(payload:any): Promise<void> {
    try {
        

        const response: AxiosResponse<any> = await axios.post(`${API_URL}/evaluted`, payload);

        console.log('POST Response:', response.data);

    } catch (error: any) {
        console.error('Error posting data:', error);
    }
}

