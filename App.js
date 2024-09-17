import 'react-native-gesture-handler';
import React from 'react';
import Connexion from './connexion';
import Home from './Home';
import Compte from './Compte';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from  '@react-navigation/stack';
import 'react-native-gesture-handler';
import Info from './Info';
import Centers from './Centres';
import Rendezvous from './Rendezvous';
import Inscription from './Inscription';
import Mesrendezvous from './Mesrendezvous';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      
      <Stack.Navigator initialRouteName="Connexion" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Connexion"  component={Connexion} />
        <Stack.Screen name="inscription" component={Inscription} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Compte" component={Compte} />
        <Stack.Screen name="Rendezvous" component={Rendezvous} />
        <Stack.Screen name="Centers" component={Centers} />
        <Stack.Screen name="Mesrendezvous" component={Mesrendezvous} />
        <Stack.Screen name="MoreInfo" component={Info} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;



