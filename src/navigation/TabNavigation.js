import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// Importa tutte le schermate
import HomeScreen from '../screens/App/HomeScreen';
import SearchScreen from '../screens/App/SearchScreen';
import ProfileScreen from '../screens/App/ProfileScreen';
import RecipesScreen from '../screens/App/RecipesScreen';
import DistributorDetailScreen from '../screens/App/DistributorDetailScreen';
import SelectQuantityScreen from '../screens/App/SelectQuantityScreen';
import OrderSummaryScreen from '../screens/App/OrderSummaryScreen';
import OrderConfirmationScreen from '../screens/App/OrderConfirmationScreen';
import CartScreen from '../screens/App/CartScreen';
import OrderHistoryScreen from '../screens/App/OrderHistoryScreen';
import PastOrderDetailScreen from '../screens/App/PastOrderDetailScreen';
import OffersScreen from '../screens/App/OffersScreen';
import PaymentScreen from '../screens/App/PaymentScreen';

const PlaceholderScreen = ({ route }) => ( <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontFamily: 'SpaceGrotesk-Regular' }}>{route.name} Screen</Text></View> );
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const RecipesStack = createStackNavigator();
const CartStack = createStackNavigator();
const OffersStack = createStackNavigator();

const COLORS = { primary: '#007BFF', inactive: '#8e8e93', white: '#FFFFFF', background: '#F4F5F7' };

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="Search" component={SearchScreen} options={{ title: 'Cerca', headerBackTitleVisible: false, headerTintColor: '#000', headerStyle: { backgroundColor: COLORS.background, elevation: 0, shadowOpacity: 0 }, headerTitleStyle: { fontFamily: 'SpaceGrotesk-Bold' } }} />
      <HomeStack.Screen name="DistributorDetail" component={DistributorDetailScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="SelectQuantity" component={SelectQuantityScreen} options={{ headerShown: false }} />
      {/* Le schermate di checkout sono state spostate nel CartStackNavigator */}
    </HomeStack.Navigator>
  );
}

function CartStackNavigator() {
    return (
        <CartStack.Navigator>
            <CartStack.Screen name="CartMain" component={CartScreen} options={{ headerShown: false }} />
            <CartStack.Screen name="OrderSummary" component={OrderSummaryScreen} options={{ headerShown: false }} />
            <CartStack.Screen name="Payment" component={PaymentScreen} options={{ headerShown: false }} />
            <CartStack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} options={{ headerShown: false }} />
        </CartStack.Navigator>
    );
}

function ProfileStackNavigator() { 
    return ( 
        <ProfileStack.Navigator>
            <ProfileStack.Screen name="Account" component={ProfileScreen} options={{ headerShown: false }} />
            <ProfileStack.Screen name="OrderHistory" component={OrderHistoryScreen} options={{ headerShown: false }} />
            <ProfileStack.Screen name="PastOrderDetail" component={PastOrderDetailScreen} options={{ headerShown: false }} />
            <ProfileStack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} options={{ headerShown: false }} />
        </ProfileStack.Navigator> 
    ); 
}

function RecipesStackNavigator() { return ( <RecipesStack.Navigator><RecipesStack.Screen name="RecipesMain" component={RecipesScreen} options={{ headerShown: false }} /></RecipesStack.Navigator> ); }
function OffersStackNavigator() { return ( <OffersStack.Navigator><OffersStack.Screen name="OffersMain" component={OffersScreen} options={{ headerShown: false }} /></OffersStack.Navigator> ); }

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, size }) => {
            const iconColor = focused ? COLORS.primary : COLORS.inactive;
            let iconComponent;
            if (route.name === 'Home') iconComponent = <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={iconColor} />;
            else if (route.name === 'Ricette') iconComponent = <MaterialCommunityIcons name="notebook-outline" size={size} color={iconColor} />;
            else if (route.name === 'Carrello') iconComponent = <Ionicons name={focused ? 'cart' : 'cart-outline'} size={size} color={iconColor} />;
            else if (route.name === 'Offerte') iconComponent = <MaterialCommunityIcons name="tag-outline" size={size} color={iconColor} />;
            else if (route.name === 'Profilo') iconComponent = <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={iconColor} />;
            return iconComponent;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarStyle: { backgroundColor: COLORS.white, borderTopWidth: 0, elevation: 5, shadowOpacity: 0.1 },
        tabBarLabelStyle: { fontSize: 12, fontFamily: 'SpaceGrotesk-Regular' },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Ricette" component={RecipesStackNavigator} />
      <Tab.Screen name="Carrello" component={CartStackNavigator} />
      <Tab.Screen name="Offerte" component={OffersStackNavigator} />
      <Tab.Screen name="Profilo" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}
