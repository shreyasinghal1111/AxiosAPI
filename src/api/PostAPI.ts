import axios from 'axios';
import { formatDate } from '../utils/datepicker';

interface PostParams {
    page?: number;
    perPage?: number;
    startDate: Date;
}

export const getPost = ({ page = 1, perPage=25, startDate }: PostParams) => {
    const formattedDate = formatDate(startDate);

    return axios.get(`https://api.github.com/search/repositories`, {
        params: {
            // q: `created:>${formattedDate} stars:>1000`,
            ...(startDate ? { q: `created:>${formattedDate} stars:>10000` }: {q:null} ),
            sort: 'stars',
            order: 'desc',
            page,
            per_page: perPage,
        }
    });
};
