import React, { useState, useEffect, useRef } from 'react';
import {
	SafeAreaView,
	StatusBar,
	View,
	Text,
	Image,
	TextInput,
	FlatList,
	Dimensions,
	Animated,
	ActivityIndicator,
	TouchableOpacity,
} from 'react-native';
import Ionic from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { APP_BASE_URL, APP_API_KEY, APP_POSTER_URL } from '@env';

export default function Home({ navigation }) {
	const [moviesData, setMoviesData] = useState([]);
	const [page, setPage] = useState(1);
	const [isLoading, setIsLoading] = useState(false);

	const WIDTH = Dimensions.get('screen').width;
	const ITEM_WIDTH = WIDTH * 0.72;
	const MOVIE_SPACE_WIDTH = WIDTH - ITEM_WIDTH;
	const scrollX = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		getMoviesDataFromDB(page);
	}, [page]);

	const getMoviesDataFromDB = async () => {
		try {
			const response = await axios.get(`${APP_BASE_URL}/movie/popular?language=ru_RU&page=${page}`, {
				headers: {
					Authorization: `Bearer ${APP_API_KEY}`,
				},
			});

			setMoviesData([...moviesData, ...response.data.results]);
		} catch (error) {
			console.error(error);
		}
		setIsLoading(false);
	};

	const handleOnEnd = () => {
		setIsLoading(true);
		setPage((prev) => prev + 1);
	};
	// console.log(page);

	return (
		<SafeAreaView
			style={{
				width: '100%',
				height: '100%',
				backgroundColor: '#1A1A23',
				padding: 0,
				position: 'relative',
			}}
		>
			<StatusBar barStyle="light-content" backgroundColor="#1A1A23" />
			<View
				style={{
					width: '100%',
					padding: 20,
					marginBottom: 20,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<View>
					<Text style={{ color: '#ffffff', fontSize: 30, fontWeight: '300' }}>Кинотеатр "Октябрь"</Text>
					<View style={{ flexDirection: 'row' }}>
						<Text
							style={{
								color: '#ffffff',
								fontSize: 24,
								fontWeight: 'bold',
								marginRight: 10,
							}}
						>
							Привет,
						</Text>
						<Text style={{ color: '#ffffff', fontSize: 24, fontWeight: '300' }}>bkjs.ru</Text>
					</View>
				</View>
				<View
					style={{
						width: 40,
						height: 40,
						borderRadius: 100,
						backgroundColor: '#ffffff30',
						overflow: 'hidden',
					}}
				>
					<Image
						source={require('../../../assets/image/avatar.jpg')}
						style={{ width: '100%', height: '100%', borderRadius: 100 }}
					/>
				</View>
			</View>
			<View>
				<View
					style={{
						width: '100%',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<View
						style={{
							width: '90%',
							paddingHorizontal: 20,
							flexDirection: 'row',
							height: 50,
							alignItems: 'center',
							justifyContent: 'space-between',
							backgroundColor: '#262532',
							borderRadius: 10,
						}}
					>
						<Ionic name="mic-outline" style={{ fontSize: 18, color: '#ffffff', opacity: 0.4 }} />
						<TextInput placeholder="Поиск" placeholderTextColor="#70717A" style={{ color: '#fff' }} />
						<Ionic name="search" style={{ fontSize: 18, color: '#ffffff', opacity: 0.4 }} />
					</View>
				</View>
			</View>
			<View
				style={{
					flexDirection: 'row',
					padding: 20,
					marginBottom: 20,
					marginTop: 10,
				}}
			>
				<Text
					style={{
						color: '#ffffff',
						fontSize: 16,
						marginRight: 8,
						fontWeight: 'bold',
					}}
				>
					Фильмы
				</Text>
				<Text style={{ color: '#ffffff', fontSize: 16, marginRight: 8 }}>в прокате</Text>
			</View>

			{isLoading && (
				<View
					style={{
						position: 'absolute',
						right: 10,
						top: '60%',
						height: 20,
						zIndex: 1,
					}}
				>
					<ActivityIndicator size="small" color="#ffffff" />
				</View>
			)}

			<FlatList
				data={moviesData}
				horizontal
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					justifyContent: 'center',
					alignItems: 'center',
					position: 'relative',
					paddingBottom: 70,
					zIndex: 1,
				}}
				onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
				snapToInterval={ITEM_WIDTH}
				snapToAlignment="start"
				decelerationRate={0.6}
				scrollEventThrottle={16}
				onEndReached={handleOnEnd}
				ListHeaderComponent={() => {
					return <View style={{ width: MOVIE_SPACE_WIDTH / 2, height: 300 }} />;
				}}
				ListFooterComponent={() => {
					return <View style={{ width: MOVIE_SPACE_WIDTH / 2, height: 300 }} />;
				}}
				renderItem={({ item, index }) => {
					const inputRange = [(index - 1) * ITEM_WIDTH, index * ITEM_WIDTH, (index + 1) * ITEM_WIDTH];
					const translateY = scrollX.interpolate({
						inputRange,
						outputRange: [50, 0, 50],
					});
					const rotateY = scrollX.interpolate({
						inputRange,
						outputRange: ['4deg', '0deg', '-4deg'],
					});
					return (
						<Animated.View
							style={{
								width: ITEM_WIDTH,
								position: 'relative',
								paddingHorizontal: 24,
							}}
						>
							<TouchableOpacity
								activeOpacity={0.9}
								onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}
								stlyle={{
									backgroundColor: 'transparent',
								}}
							>
								<Animated.View
									style={{
										marginHorizontal: 0,
										height: 300,
										elevation: 20,
										borderRadius: 34,
										borderColor: 'transparent',
										transform: [{ translateY: translateY }, { rotateZ: rotateY }],
									}}
								>
									<Image
										style={{
											width: '100%',
											height: '100%',
											borderRadius: 34,
										}}
										source={{ uri: `${APP_POSTER_URL}${item.poster_path}` }}
									/>
								</Animated.View>

								<Animated.Text
									style={{
										color: '#ffffff',
										marginTop: 20,
										fontSize: 20,
										letterSpacing: 2,
										fontWeight: 'bold',
										textAlign: 'center',
										opacity: 0.8,
										transform: [{ translateY: translateY }, { rotateZ: rotateY }],
									}}
								>
									{item.title}
								</Animated.Text>
								<Animated.Text
									style={{
										color: '#ffffff',
										marginTop: 10,
										fontSize: 14,
										letterSpacing: 2,
										textAlign: 'center',
										fontWeight: 'bold',
										opacity: 0.2,
										transform: [{ translateY: translateY }, { rotateZ: rotateY }],
									}}
								>
									{item.release_date?.toString().slice(0, 4)}
								</Animated.Text>
							</TouchableOpacity>
						</Animated.View>
					);
				}}
				keyExtractor={(item, index) => index.toString()}
			/>
		</SafeAreaView>
	);
}
