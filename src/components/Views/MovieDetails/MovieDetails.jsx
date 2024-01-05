import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import React from 'react';
import Ionic from 'react-native-vector-icons/Ionicons';

export default function MovieDetails({ route, navigation }) {
	const { movieId } = route.params;
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
				}}
			>
				<TouchableOpacity activeOpacity={0.6} onPress={() => navigation.goBack()}>
					<Ionic name="chevron-back" style={{ fontSize: 18, color: '#ffffff' }} />
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}
