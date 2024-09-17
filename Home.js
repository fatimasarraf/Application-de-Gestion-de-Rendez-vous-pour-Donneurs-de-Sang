import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Footer from './Footer';

const Home = ({ navigation }) => {
  const handleLogout = () => {
    navigation.navigate('Connexion');
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur la page d'accueil</Text>
      <Button title="Se déconnecter" onPress={handleLogout} />
       <Footer navigation={navigation} />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
 
 
});

export default Home;
