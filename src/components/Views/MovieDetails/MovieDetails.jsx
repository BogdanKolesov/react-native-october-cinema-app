import {
	View,
	Text,
	SafeAreaView,
	TouchableOpacity,
	Image,
	Dimensions,
	ActivityIndicator,
	ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionic from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { APP_BASE_URL, APP_API_KEY, APP_POSTER_URL } from '@env';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MovieDetails({ route, navigation }) {
	const { movieId } = route.params;

	const [movieDetails, setMovieDetails] = useState('');
	const [movieProviders, setMovieProviders] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isBuy, setIsBuy] = useState(false);

	const WIDTH = Dimensions.get('screen').width;
	const HEIGHT = Dimensions.get('screen').height;

	const hour = Math.floor(movieDetails?.runtime / 60);
	const min = movieDetails?.runtime - hour * 60;

	const handleBuyTickets = async (id) => {
		setIsLoading(true);

		try {
			let itemsArr = await AsyncStorage.getItem('tickets');
			itemsArr = JSON.parse(itemsArr) || [];

			if (!itemsArr.includes(id)) {
				itemsArr.push(id);
				await AsyncStorage.setItem('tickets', JSON.stringify(itemsArr));
				setIsBuy(true);
			}

			setIsLoading(false);
		} catch (error) {
			console.error(error);
			setIsLoading(false);
		}
	};

	const handleRemoveTickets = async (id) => {
		setIsLoading(true);

		try {
			let itemsArr = await AsyncStorage.getItem('tickets');
			itemsArr = JSON.parse(itemsArr) || [];

			const index = itemsArr.indexOf(id);
			if (index !== -1) {
				itemsArr.splice(index, 1);
				await AsyncStorage.setItem('tickets', JSON.stringify(itemsArr));
				setIsBuy(false);
			}

			setIsLoading(false);
		} catch (error) {
			console.error(error);
			setIsLoading(false);
		}
	};

	const getItemsInStorageData = async (movieId) => {
		setIsLoading(true);

		try {
			let items = await AsyncStorage.getItem('tickets');
			items = JSON.parse(items) || [];

			const isMovieInCart = items.includes(movieId);
			setIsBuy(isMovieInCart);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const getMovieProviders = async (id) => {
		setIsLoading(true);

		try {
			const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/watch/providers?language=ru-RU`, {
				headers: {
					Authorization: `Bearer ${APP_API_KEY}`,
				},
			});

			const providersData = response.data.results.IN?.flatrate || null;
			setMovieProviders(providersData);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const getMovieDetailsById = async (movieId) => {
		setIsLoading(true);

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
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getMovieDetailsById(movieId);
		getItemsInStorageData(movieId);
	}, [movieId]);
	return (
		<SafeAreaView
			style={{
				width: '100%',
				height: '100%',
				backgroundColor: '#1A1A23',
				position: 'relative',
			}}
		>
			<ScrollView style={{ width: WIDTH }}>
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
							marginBottom: 20,
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
					<View
						style={{
							width: WIDTH,
							alignItems: 'center',
							justifyContent: 'space-evenly',
							paddingHorizontal: 80,
							marginBottom: 30,
						}}
					>
						<Text
							style={{
								color: '#ffffff',
								fontWeight: 'bold',
								letterSpacing: 2,
							}}
						>
							IMDB {movieDetails?.vote_average?.toString().slice(0, 3)}
						</Text>
					</View>
					<View
						style={{
							width: WIDTH,
							alignItems: 'center',
						}}
					>
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={() => (!isBuy ? handleBuyTickets(movieId) : handleRemoveTickets(movieId))}
							style={{
								width: WIDTH * 0.5,
								paddingVertical: 10,
								backgroundColor: isBuy ? '#ffffff' : '#ff0000',
								alignItems: 'center',
								justifyContent: 'center',
								borderRadius: 4,
								position: 'relative',
							}}
						>
							<View
								style={{
									width: 18,
									aspectRatio: 1 / 1,
									borderRadius: 100,
									backgroundColor: '#1A1A23',
									position: 'absolute',
									left: -12,
									top: '50%',
								}}
							></View>
							{isLoading ? (
								<ActivityIndicator size="small" color="#ffffff" />
							) : (
								<Text
									style={{
										color: isBuy ? '#000000' : '#ffffff',
										fontWeight: 'bold',
										letterSpacing: 2,
									}}
								>
									{isBuy ? 'Отменить покупку' : 'Купить билет'}
								</Text>
							)}
							<View
								style={{
									width: 18,
									aspectRatio: 1 / 1,
									borderRadius: 100,
									backgroundColor: '#1A1A23',
									position: 'absolute',
									right: -12,
									top: '50%',
								}}
							></View>
						</TouchableOpacity>
					</View>
				</View>
				<View
					style={{
						width: WIDTH,
						height: HEIGHT * 0.5,
						position: 'absolute',
						zIndex: -1,
						alignItems: 'center',
						overflow: 'hidden',
					}}
				>
					<LinearGradient
						style={{
							width: WIDTH,
							height: 80,
							position: 'absolute',
							zIndex: 1,
							bottom: 0,
						}}
						colors={['#1a1a2310', '#1a1a2390', '#1a1a23', '#1a1a23']}
					></LinearGradient>
					<Image
						source={{ uri: `${APP_POSTER_URL}${movieDetails?.poster_path}` }}
						style={{
							width: '100%',
							height: '100%',
							resizeMode: 'cover',
							opacity: 0.2,
						}}
					/>
				</View>
				<View
					style={{
						width: WIDTH,
						justifyContent: 'center',
						alignItems: 'center',
						marginTop: 20,
						marginBottom: 10,
					}}
				>
					<Text
						style={{
							color: '#ffffff',
							marginHorizontal: '5%',
							letterSpacing: 0.8,
							fontSize: 16,
							textAlign: 'justify',
						}}
					>
						{movieDetails?.overview}
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
