import { View, Text, SafeAreaView, TouchableOpacity, Image, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionic from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { APP_BASE_URL, APP_API_KEY, APP_POSTER_URL } from '@env';

export default function MovieDetails({ route, navigation }) {
	const { movieId } = route.params;

	const [movieDetails, setMovieDetails] = useState('');
	const [movieProviders, setMovieProviders] = useState('');

	const WIDTH = Dimensions.get('screen').width;
	const HEIGHT = Dimensions.get('screen').height;

	const hour = Math.floor(movieDetails?.runtime / 60);
	const min = movieDetails?.runtime - hour * 60;

	useEffect(() => {
		getMovieDetailsById(movieId);
	}, [movieId]);

	const getMovieProviders = async (id) => {
		let movieProArr = [];
		try {
			const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/watch/providers?language=ru-RU`, {
				headers: {
					Authorization: `Bearer ${APP_API_KEY}`,
				},
			});
			const providersData = response.data.results.IN?.flatrate ? response.data.results.IN?.flatrate : null;
			// console.log(providersData);
			movieProArr.push(providersData);
			// console.log(movieProArr);
			return setMovieProviders(movieProArr[0] ? movieProArr[0] : null);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const getMovieDetailsById = async (movieId) => {
		try {
			const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?language=ru-RU`, {
				headers: {
					Authorization: `Bearer ${APP_API_KEY}`,
				},
			});
			setMovieDetails(response.data);
			getMovieProviders(response.data.id);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<SafeAreaView
			style={{
				width: '100%',
				height: '100%',
				backgroundColor: '#1A1A23',
				position: 'relative',
			}}
		>
			<View
				style={{
					padding: 20,
					flexDirection: 'row',
					alignItems: 'center',
				}}
			>
				<TouchableOpacity
					activeOpacity={0.6}
					onPress={() => navigation.goBack()}
					style={{
						width: 40,
						height: 40,
						backgroundColor: '#262532',
						borderRadius: 100,
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Ionic name="chevron-back" style={{ fontSize: 18, color: '#ffffff' }} />
				</TouchableOpacity>
				<Text
					style={{
						fontSize: 22,
						color: '#ffffff',
						marginLeft: '25%',
					}}
				>
					О фильме
				</Text>
			</View>
			<View
				style={{
					width: WIDTH,
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<View
					style={{
						width: WIDTH * 0.72,
						height: HEIGHT * 0.5,
						borderRadius: 20,
						overflow: 'hidden',
						position: 'relative',
						backgroundColor: '#FFFFFF20',
					}}
				>
					<Image
						style={{
							width: '100%',
							height: '100%',
							resizeMode: 'cover',
						}}
						source={{ uri: `${APP_POSTER_URL}${movieDetails?.poster_path}` }}
					/>
					{movieProviders && (
						<View
							style={{
								width: 40,
								height: 40,
								borderRadius: 8,
								backgroundColor: '#FFFFFF20',
								position: 'absolute',
								top: 20,
								right: 20,
								zIndex: 1,
							}}
						>
							<Image
								style={{
									width: '100%',
									height: '100%',
									resizeMode: 'cover',
									borderRadius: 8,
								}}
								source={{ uri: `${APP_POSTER_URL}${movieProviders[0].logo_path}` }}
							/>
						</View>
					)}
				</View>
				<Text
					style={{
						fontSize: 24,
						maxWidth: WIDTH * 0.6,
						color: '#ffffff',
						textAlign: 'center',
						fontWeight: 'bold',
						marginTop: 10,
						marginBottom: 20,
					}}
				>
					{movieDetails?.title}
				</Text>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-evenly',
						width: WIDTH * 0.7,
					}}
				>
					<Text
						style={{
							color: '#ffffff',
							fontSize: 12,
							opacity: 0.4,
						}}
					>
						{movieDetails?.release_date?.toString().slice(0, 4)}
					</Text>
					<Text
						style={{
							color: '#ffffff',
							fontSize: 12,
							opacity: 0.4,
						}}
					>
						{movieDetails?.genres ? movieDetails.genres[0].name : null}
					</Text>
					<Text
						style={{
							color: '#ffffff',
							fontSize: 12,
							opacity: 0.4,
						}}
					>
						{hour} ч. {min} мин.
					</Text>
				</View>
			</View>
		</SafeAreaView>
	);
}
