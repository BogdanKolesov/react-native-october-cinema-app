import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationAction, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, MovieDetails, Tickets } from './src/components/Views';
import Ionic from 'react-native-vector-icons/Ionicons';

export default function App() {
	const Tab = createBottomTabNavigator();
	const Stack = createNativeStackNavigator();

	const BottomTabs = () => {
		return (
			<Tab.Navigator
				screenOptions={({ route }) => ({
					tabBarShowLabel: false,
					headerShown: false,
					tabBarStyle: {
						backgroundColor: '#1A1A23',
						borderTopEndRadius: 10,
						borderTopStartRadius: 10,
						position: 'absolute',
						borderTopColor: 'transparent',
						elevation: 0,
						height: 54,
						overflow: 'hidden',
					},
					tabBarIcon: ({ focused, colour }) => {
						let iconName;
						if (route.name === 'Home') {
							iconName = focused ? 'home-sharp' : 'home-outline';
							colour = focused && '#ffffff';
						} else if (route.name === 'Tickets') {
							iconName = focused ? 'film-sharp' : 'film-outline';
							colour = focused && '#ffffff';
						}
						return (
							<>
								<Ionic name={iconName} style={{ marginBottom: 4 }} size={22} color={colour ? colour : '#ffffff40'} />
								<Ionic
									name="ellipse"
									style={{ display: colour ? 'flex' : 'none' }}
									size={4}
									color={colour ? colour : 'transparent'}
								/>
							</>
						);
					},
				})}
			>
				<Tab.Screen name="Home" component={Home} />
				<Tab.Screen name="Tickets" component={Tickets} />
			</Tab.Navigator>
		);
	};

	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerShown: false,
				}}
			>
				<Stack.Screen name="BottomTabs" component={BottomTabs} />
				<Stack.Screen name="MovieDetails" component={MovieDetails} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
