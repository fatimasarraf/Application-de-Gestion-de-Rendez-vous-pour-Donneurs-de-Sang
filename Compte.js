import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 

const Compte = ({ route, navigation }) => {
  const { clientId } = route.params;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchUserData(clientId);
  }, [clientId]);

  const fetchUserData = async (clientId) => {
    try {
      const response = await fetch(`https://d4a9-105-66-135-30.ngrok-free.app/infos/${clientId}`);
      const userData = await response.json();
      setUserData(userData);
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur :', error);
    }
  };

  const handleLogout = () => {
    navigation.navigate('Connexion');
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Text style={styles.title}>Mon Profile</Text>
        {userData ? (
          <>
            <View style={styles.userInfo}>
              <FontAwesome name="user" style={styles.icon} size={24} color="#BCE1FD" />
              <Text style={styles.userInfoText}>Nom d'utilisateur : {userData.nom}</Text>
            </View>
            <View style={styles.userInfo}>
              <FontAwesome name="envelope" style={styles.icon} size={24} color="#BCE1FD" />
              <Text style={styles.userInfoText}>Email : {userData.email}</Text>
            </View>
            <View style={styles.userInfo}>
              <FontAwesome name="id-card" style={styles.icon} size={24} color="#BCE1FD" />
              <Text style={styles.userInfoText}>Identifiant : {userData.id}</Text>
            </View>
          </>
        ) : (
          <Text>Chargement...</Text>
        )}
      </View>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
    height:'60%'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#42A3ED',
    textAlign:'center',
  },
  userInfoContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
      
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
    height: '30%', 
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  userInfoText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#BC1619',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 18,
  },
});

export default Compte;
