import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, TextInput } from 'react-native';
import Footer from './Footer';
import { useIsFocused } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const Centers = ({ navigation, route }) => {
  const [initialCenters, setInitialCenters] = useState([]);
  const [centers, setCenters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [token, setToken] = useState('');
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [showRegions, setShowRegions] = useState(false); // État pour afficher ou masquer les régions
  const clientId = route.params && route.params.clientId !== null ? route.params.clientId : 'defaultClientId';
  const currentDate = new Date();
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken !== null) {
          setToken(storedToken);
          console.log('Token JWT récupéré avec succès depuis AsyncStorage:', storedToken);
          fetchCenters(storedToken);
        } else {
          console.log('Aucun token JWT trouvé dans AsyncStorage');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du token JWT depuis AsyncStorage:', error);
      }
    };
    fetchToken();
  }, [isFocused]);

  useEffect(() => {
    let filteredData = initialCenters;
    if (selectedRegion) {
      filteredData = initialCenters.filter(center => center.region === selectedRegion);
    }
    if (searchQuery.trim()) {
      filteredData = filteredData.filter(center => center.ville_centre.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setCenters(filteredData);
  }, [searchQuery, selectedRegion]);

  const fetchCenters = async (token) => {
    try {
      console.log('Token JWT envoyé dans les en-têtes de la requête:', token);
      const response = await fetch('https://d4a9-105-66-135-30.ngrok-free.app/centres-sante', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      // Extraction des régions des données récupérées
      const regions = [...new Set(data.map(center => center.region))];
      setRegions(regions);

      setInitialCenters(data);
      setCenters(data);
    } catch (error) {
      console.error('Error fetching centers:', error);
    }
  };

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setSearchQuery('');
    setShowRegions(false); // Masquer la liste des régions après sélection
  };

  const toggleRegions = () => {
    setShowRegions(!showRegions); // Inverser l'état pour afficher ou masquer les régions
  };

  const handleCenterSelect = (centerId) => {
    navigation.navigate('Rendezvous', { centerId, clientId }); 
  };

  const formatTime = (time) => {
    return time.substring(0, 5); 
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Image source={require('./logo.png')} style={styles.logo} />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Connexion')} style={styles.logoutIcon}>
          <FontAwesome5 name="sign-out-alt" size={42} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Bouton pour afficher les régions */}
      <TouchableOpacity style={[styles.button, { width: '75%' }]} onPress={toggleRegions}>
        <Text style={styles.buttonText}>Afficher les régions</Text>
      </TouchableOpacity>

      {/* Affichage des régions si showRegions est vrai */}
      {showRegions && (
        <View style={styles.regionContainer}>
          {regions.map((region, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.regionItem, index !== regions.length - 1 && styles.regionSeparator]} 
              onPress={() => handleRegionSelect(region)}
            >
              <Text style={styles.regionText}>{region}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher par ville..."
        onChangeText={text => setSearchQuery(text)}
        value={searchQuery}
      />
      
      {/* Centers List */}
      <ScrollView contentContainerStyle={styles.content}>
        {centers.length > 0 ? (
          centers.map((center) => (
            <TouchableOpacity
              key={center.id}
              style={styles.centerBlock}
              onPress={() => handleCenterSelect(center.id)}
            >
              <Text style={styles.centerName}>{center.nom_centre}</Text>
              <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                  <FontAwesome5 name="map-marker-alt" size={16} color="#BCE1FD" />
                  <Text style={styles.infoText}>{center.adresse_centre}</Text>
                </View>
                <View style={styles.infoItem}>
                  <FontAwesome5 name="phone" size={16} color="#BCE1FD" />
                  <Text style={styles.infoText}>{center.telephone}</Text>
                </View>
                <View style={styles.infoItem}>
                  <FontAwesome5 name="clock" size={16} color="#BCE1FD" />
                  <Text style={styles.infoText}>{formatTime(center.heure_ouverture)} - {formatTime(center.heure_fermeture)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noCentersText}>Aucun centre de don de sang trouvé dans cette ville.</Text>
        )}
      </ScrollView>
      
      {/* Footer */}
      <Footer navigation={navigation} clientId={clientId} currentPage="Centers" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
  },
  header: {
    backgroundColor: '#BCE1FD',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 0,
    paddingHorizontal: 10,
  },
  logoutIcon: {
    alignSelf: 'flex-end',
    marginBottom:80,
  },
  logo: {
    width: 180, 
    height: 180, 
    resizeMode: 'contain',
    marginTop:15,
  },
  centerBlock: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%', 
    shadowColor: '#64BBFD',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    alignSelf: 'center',
  },
  centerName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color:'#BC1619',
  },
  content: {
    alignItems: 'center',
    paddingTop: 20, 
  },
  infoContainer: {
    marginTop: 10,
  },
  infoItem: {
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    marginLeft: 5,
    color: '#666',
  },
  searchInput: {
    height: 40,
    borderColor: '#84B4D8',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 17,
    width: '75%',
    alignSelf: 'center',
  },
  noCentersText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#BCE1FD',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  regionContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignSelf: 'center',
    width: '75%',
  },
  regionItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    backgroundColor: '#BEDBF1',
    alignItems: 'center',
  },
  regionSeparator: {
    marginBottom: 8, 
  },
  regionText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default Centers;
