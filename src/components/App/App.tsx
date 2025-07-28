import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { fetchMovies } from '../../services/movieService'
import type { Movie } from '../../types/movie'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import Loader from '../Loader/Loader'
import MovieGrid from '../MovieGrid/MovieGrid'
import MovieModal from '../MovieModal/MovieModal'
import SearchBar from '../SearchBar/SearchBar'
import css from './App.module.css'

export default function App() {
	const [movies, setMovies] = useState<Movie[]>([])
	const [error, setError] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

	const handleSearch = async (query: string) => {
		setIsLoading(true)

		try {
			const data = await fetchMovies(query)

			if (data.length === 0) {
				setError('No movies found.')
				setMovies([])
				return
			}

			setError(null)
			setMovies(data)
		} catch {
			toast.error('Failed to fetch movies.')
			setError('Failed to fetch movies.')
			setMovies([])
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className={css.app}>
			<Toaster position='top-right' />
			<SearchBar onSubmit={handleSearch} />
			{isLoading && <Loader />}
			{error ? (
				<ErrorMessage />
			) : (
				<MovieGrid movies={movies} onSelect={setSelectedMovie} />
			)}
			{selectedMovie && (
				<MovieModal
					movie={selectedMovie}
					onClose={() => setSelectedMovie(null)}
				/>
			)}
		</div>
	)
}
