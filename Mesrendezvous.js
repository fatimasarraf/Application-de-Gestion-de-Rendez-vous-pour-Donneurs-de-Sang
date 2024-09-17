import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library'; 

const Mesrendezvous = ({ route }) => {
  const { clientId } = route.params;
  const [rendezvous, setRendezvous] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!clientId || !token) {
          console.error("L'identifiant du client ou le token JWT n'est pas défini.");
          return;
        }
        const response = await fetch(`https://d4a9-105-66-135-30.ngrok-free.app/mes-rendezvous/${clientId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des rendez-vous');
        }
        const responseData = await response.json();
        setRendezvous(responseData);
      } catch (error) {
        console.error('Erreur lors de la récupération des rendez-vous :', error.message);
      }
    };

    fetchData();
  }, [clientId]);

  const handleDelete = async (rendezvousId) => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer ce rendez-vous ?',
      [
        {
          text: 'Annuler',
          onPress: () => console.log('Annulation de la suppression du rendez-vous'),
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              const response = await fetch(`https://d4a9-105-66-135-30.ngrok-free.app/suprendez-vous/${rendezvousId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              if (response.ok) {
                setRendezvous(prevRendezvous => prevRendezvous.filter(rendezvous => rendezvous.id !== rendezvousId));
              } else {
                console.error('Erreur lors de la suppression du rendez-vous');
              }
            } catch (error) {
              console.error('Erreur lors de la requête de suppression du rendez-vous :', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleDownloadConvocation = async (rendezvousInfo) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('La permission d\'accès à la bibliothèque média a été refusée.');
      }
  
      const htmlContent = `<html><body>
        <h1>Confirmation du Rendez-vous</h1>
        
        <p>Nom et prénom : ${rendezvousInfo.nom} ${rendezvousInfo.prenom}</p>
        <p>Date : ${new Date(rendezvousInfo.date_rendezvous).toLocaleDateString()}</p>
        <p>Créneau : ${rendezvousInfo.heure_debut.split(':').slice(0, 2).join(':')}</p>
        <p>Centre : ${rendezvousInfo.nom_centre}</p>
        <p>Centre : ${rendezvousInfo.adresse_centre}</p>
      </body></html>`;
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      console.log("URI du fichier PDF généré :", uri);
      const fileName = `Convocation_Rendezvous_${rendezvousInfo.nom}.pdf`;
      const destinationUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.moveAsync({ from: uri, to: destinationUri });
      console.log("Chemin de destination du fichier PDF :", destinationUri);
      const downloadUri = FileSystem.documentDirectory + fileName;
      const asset = await MediaLibrary.createAssetAsync(downloadUri);
      await MediaLibrary.createAlbumAsync("Download", asset, false);
      Alert.alert('Convocation téléchargée avec succes');
    } catch (error) {
      console.error('Erreur lors de la génération et du téléchargement de la convocation :', error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Rendez-vous</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.rendezvousList}>
          {rendezvous.map(rendezvous => (
            <View key={rendezvous.id} style={styles.rendezvousItem}>
              <View style={styles.infoContainer}>
                <Icon name="calendar" size={20} color="#84B4D8" style={styles.icon} />
                <Text>Date : {new Date(rendezvous.date_rendezvous).toLocaleDateString()}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Icon name="clock-o" size={20} color="#84B4D8" style={styles.icon} />
                <Text>Créneau : {rendezvous.heure_debut.split(':').slice(0, 2).join(':')}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Icon name="map-marker" size={20} color="#84B4D8" style={styles.icon} />
                <Text>Centre : {rendezvous.nom_centre}</Text>
              </View>
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity onPress={() => handleDelete(rendezvous.id)}>
                  <Text style={styles.actionButton}>Supprimer</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDownloadConvocation(rendezvous)}>
                  <Text style={styles.actionButton1}>Télécharger</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 10,
  },
  scrollView: {
    flexGrow: 1,
    paddingTop: 60,
  },
  rendezvousList: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60,
  },
  rendezvousItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 20,
    marginBottom: 20,
    width: '100%',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#fff',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    color: '#EB0000',
    marginLeft: 10,
  },
  actionButton1: {
    color: '#84B4D8',
    marginLeft: 10,
  },
});

export default Mesrendezvous;
