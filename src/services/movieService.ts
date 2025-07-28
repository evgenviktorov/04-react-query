import axios from 'axios'
import type { Movie } from '../types/movie'

const BASE_URL = 'https://api.themoviedb.org/3'
const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN

export interface MoviesResponse {
	results: Movie[]
	total_pages: number
}

export const fetchMovies = async (
	query: string,
	page: number = 1
): Promise<MoviesResponse> => {
	const response = await axios.get<MoviesResponse>(`${BASE_URL}/search/movie`, {
		params: { query, page },
		headers: {
			Authorization: `Bearer ${API_TOKEN}`,
		},
	})

	return response.data
}
