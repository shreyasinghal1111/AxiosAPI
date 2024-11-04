import axios, { AxiosResponse } from 'axios';

const api = axios.create({
    baseURL: 'https://api.github.com',
});

export const getPost = (): Promise<AxiosResponse> => {
    return api.get('search/repositories?q=created:>2017-10-22&sort=stars&order=desc&page=1');
};
