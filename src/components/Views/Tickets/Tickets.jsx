import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionic from 'react-native-vector-icons/Ionicons';

import { APP_API_KEY, APP_POSTER_URL } from '@env';

export default function Tickets({ navigation }) {
	const [moviesData, setMoviesData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const getTicketsDataFromStorage = async () => {
		setIsLoading(true);

		try {
			let items = await AsyncStorage.getItem('tickets');
			items = JSON.parse(items) || [];
			let movies = [];

			if (items.length > 0) {
				for (let index = 0; index < items.length; index++) {
					const response = await axios.get(`https://api.themoviedb.org/3/movie/${items[index]}?language=ru-RU`, {
						headers: {
							Authorization: `Bearer ${APP_API_KEY}`,
						},
					});

					movies.push(response.data);
				}
			}
			setMoviesData(movies);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const unsub = navigation.addListener('focus', () => {
			getTicketsDataFromStorage();
		});

		return () => unsub();
	}, [navigation]);

	return (
		<SafeAreaView
			style={{
				flex: 1,
				backgroundColor: '#1a1a23',
				paddingVertical: 20,
			}}
		>
			<FlatList
				showsVerticalScrollIndicator={false}
				data={moviesData}
				keyExtractor={(item) => item.id.toString()}
				contentContainerStyle={{
					paddingBottom: 70,
					justifyContent: 'center',
					zIndex: 1,
					position: 'relative',
					alignItems: 'center',
				}}
				ListHeaderComponent={() => {
					return (
						<View
							style={{
								flexDirection: 'row',
								marginBottom: 20,
								position: 'relative',
								alignItems: 'center',
							}}
						>
							<Text
								style={{
									color: '#ffffff',
									fontSize: 30,
									fontWeight: 'bold',
									marginRight: 10,
								}}
							>
								Список
							</Text>
							<Text
								style={{
									color: '#ffffff',
									fontSize: 25,
									marginRight: 10,
								}}
							>
								добавленных фильмов:
							</Text>
						</View>
					);
				}}
				ListFooterComponent={() => {
					return (
						<>
							{isLoading ? (
								<View
									style={{
										width: '100%',
										alignItems: 'center',
										justifyContent: 'center',
										paddingVertical: 40,
									}}
								>
									<ActivityIndicator size="small" color="#ffffff20" />
								</View>
							) : null}
						</>
					);
				}}
				renderItem={({ item }) => (
					<TouchableOpacity
						onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}
						activeOpacity={0.9}
						style={{
							backgroundColor: 'transparent',
							width: '86%',
							aspectRatio: 3.5 / 2,
							marginVertical: 20,
							marginRight: 6,
						}}
					>
						<LinearGradient
							colors={['#23252f', '#13141b']}
							style={{
								width: '100%',
								height: '100%',
								padding: 14,
								elevation: 1,
								shadowColor: '#ffffff',
								flexDirection: 'row',
								position: 'relative',
								borderRadius: 30,
							}}
						>
							<Image
								style={{
									height: '100%',
									aspectRatio: 2 / 3,
									backgroundColor: 'gray',
									borderRadius: 15,
									marginRight: 20,
								}}
								source={{ uri: `${APP_POSTER_URL}${moviesData?.poster_path}` }}
							/>
							<View style={{ flex: 1, justifyContent: 'space-around' }}>
								<Text
									style={{
										color: '#ffffff',
										fontSize: 20,
										maxHeight: 64,
										overflow: 'hidden',
									}}
								>
									{item?.title}
								</Text>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										marginBottom: 8,
									}}
								>
									<Ionic name="star" style={{ color: '#f9ac2b', marginRight: 6 }} />
									<Text
										style={{
											color: '#f9ac2b',
											fontSize: 12,
										}}
									>
										{item?.vote_count?.toString()}
									</Text>
								</View>
								<Text
									style={{
										color: '#ffffff',
										opacity: 0.4,
										fontSize: 12,
										maxHeight: 20,
										overflow: 'hidden',
									}}
								>
									{item.release_date}
								</Text>
								<View
									style={{
										backgroundColor: '#f9ac2b',
										borderRadius: 100,
										paddingHorizontal: 10,
										paddingVertical: 4,
										position: 'absolute',
										bottom: 26,
										right: -34,
									}}
								>
									<Text
										style={{
											color: '#000000',
											fontWeight: '500',
										}}
									>
										IMDB {item?.vote_average?.toString().slice(0, 3)}
									</Text>
								</View>
							</View>
						</LinearGradient>
					</TouchableOpacity>
				)}
			/>
		</SafeAreaView>
	);
}
