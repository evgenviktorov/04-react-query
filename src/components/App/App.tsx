import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import ReactPaginate from 'react-paginate'
import { fetchMovies } from '../../services/movieService'
import type { Movie } from '../../types/movie'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import Loader from '../Loader/Loader'
import MovieGrid from '../MovieGrid/MovieGrid'
import MovieModal from '../MovieModal/MovieModal'
import SearchBar from '../SearchBar/SearchBar'
import css from './App.module.css'

export default function App() {
	const [query, setQuery] = useState('')
	const [page, setPage] = useState(1)
	const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

	const { data, isLoading, isFetching, isError, isSuccess } = useQuery({
		queryKey: ['movies', query, page],
		queryFn: () => fetchMovies(query, page),
		enabled: query !== '',
		placeholderData: keepPreviousData,
	})

	const handleSearch = (query: string) => {
		setQuery(query)
		setPage(1)
	}

	useEffect(() => {
		if (isError) {
			toast.error('Failed to fetch movies')
		}
	}, [isError])

	useEffect(() => {
		if (isSuccess && data?.results.length === 0) {
			toast('No movies found.')
		}
	}, [isSuccess, data])

	return (
		<div className={css.app}>
			<Toaster position='top-right' />
			<SearchBar onSubmit={handleSearch} />

			{data && data.total_pages > 1 && (
				<ReactPaginate
					pageCount={data.total_pages}
					pageRangeDisplayed={5}
					marginPagesDisplayed={1}
					onPageChange={({ selected }) => setPage(selected + 1)}
					forcePage={page - 1}
					containerClassName={css.pagination}
					activeClassName={css.active}
					nextLabel='→'
					previousLabel='←'
				/>
			)}

			{isLoading || isFetching ? (
				<Loader />
			) : isError ? (
				<ErrorMessage />
			) : data?.results ? (
				<MovieGrid movies={data.results} onSelect={setSelectedMovie} />
			) : null}

			{selectedMovie && (
				<MovieModal
					movie={selectedMovie}
					onClose={() => setSelectedMovie(null)}
				/>
			)}
		</div>
	)
}
