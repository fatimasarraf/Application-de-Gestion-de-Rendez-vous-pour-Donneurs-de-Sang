import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, ScrollView, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/FontAwesome'; 

const Rendezvous = ({ route, navigation }) => {
  console.log('Params reçus dans Rendezvous:', route.params);
  const { centerId, clientId } = route.params;
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedCreneauId, setSelectedCreneauId] = useState(null);
  const [selectedCreneauHeureDebut, setSelectedCreneauHeureDebut] = useState(null);
  const [creneauxDisponibles, setCreneauxDisponibles] = useState([]);
  const [placesDisponibles, setPlacesDisponibles] = useState({});
  const [creneauxDisponiblesLoaded, setCreneauxDisponiblesLoaded] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      fetchCreneauxEtPlacesDisponibles(centerId, selectedDate.getDay(), selectedDate.toISOString().split('T')[0]);
    }
  }, [selectedDate]);

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleDateConfirm = (date) => {
    setSelectedDate(date);
    console.log('Date sélectionnée :', date);
    hideDatePicker();
  };

  const fetchCreneauxEtPlacesDisponibles = async (centreId, jourSemaineId, selectedDate) => {
    try {
     
      const creneauxResponse = await fetch(`https://d4a9-105-66-135-30.ngrok-free.app/creneaux/${centreId}?jourSemaineId=${jourSemaineId}`);
      const creneauxData = await creneauxResponse.json();
      console.log('Créneaux disponibles :', creneauxData);

      if (creneauxData.length === 0) {
        setCreneauxDisponiblesLoaded(true);
        return;
      }

     
      const placesResponse = await fetch(`https://d4a9-105-66-135-30.ngrok-free.app/places-disponibles/${centreId}/${selectedDate}`);
      const placesData = await placesResponse.json();
      console.log('Places disponibles :', placesData);

      
      const creneauxMap = {};
      creneauxData.forEach(creneau => {
        creneauxMap[creneau.id] = { ...creneau, placesDisponibles: 0 };
      });

     
      placesData.forEach(place => {
        if (creneauxMap[place.creneau_id]) {
          creneauxMap[place.creneau_id].placesDisponibles = place.places_disponibles;
        }
      });

      
      setCreneauxDisponibles(creneauxData);
      setPlacesDisponibles(creneauxMap);
      setCreneauxDisponiblesLoaded(true);
      console.log('Creneaux map après mise à jour :', creneauxMap);
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };

  const handleCreneauClick = (creneauId, heureDebut) => {
    const placesDispo = placesDisponibles[creneauId] ? placesDisponibles[creneauId].placesDisponibles : 0;
    if (placesDispo > 0) {
      setSelectedCreneauId(creneauId);
      setSelectedCreneauHeureDebut(heureDebut);
    } else {
      Alert.alert('Erreur', 'Ce créneau est complet. Veuillez choisir un autre créneau.');
    }
  };

  const enregistrerRendezVous = async () => {
    try {
      const requestBody = {
        creneau_id: selectedCreneauId,
        centre_id: centerId,
        date: selectedDate.toISOString().split('T')[0], 
        clientId: clientId, 
      };
      console.log('Données envoyées à l\'API :', requestBody); 
      const response = await fetch('https://d4a9-105-66-135-30.ngrok-free.app/ajouter-rendezvous', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      const responseData = await response.text(); 
      console.log('Réponse de l\'API :', responseData);
      if (response.ok) {
        console.log('Rendez-vous enregistré avec succès.');
        navigation.replace('Mesrendezvous', { clientId: clientId });
      } else {
        console.log('Erreur lors de l\'enregistrement du rendez-vous :', responseData);
        if (responseData.includes("Le client a déjà pris un rendez-vous pour cette date")) {
          Alert.alert('Erreur', 'Le client a déjà pris un rendez-vous pour cette date');
        } else {
          Alert.alert('Erreur', 'Une erreur est survenue lors de l\'enregistrement du rendez-vous.');
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du rendez-vous :', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'enregistrement du rendez-vous.');
    }
  };

  const prendreRendezVous = () => {
    if (selectedCreneauId && selectedCreneauHeureDebut) {
      Alert.alert(
        'Confirmation',
        `Voulez-vous prendre rendez-vous pour le créneau ${selectedCreneauHeureDebut} le ${selectedDate.toLocaleDateString()} ?`,
        [
          {
            text: 'Annuler',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: enregistrerRendezVous,
          },
        ],
      );
    } else {
      Alert.alert('Erreur', 'Veuillez sélectionner un créneau.');
    }
  };

  return (
    <ImageBackground source={require('./cren.png')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.datePickerButton} onPress={showDatePicker}>
            <Icon name="calendar" size={20} color="#fff" style={styles.calendarIcon} />
            <Text style={styles.datePickerText}>{selectedDate ? selectedDate.toLocaleDateString() : 'Sélectionnez une date'}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleDateConfirm}
            onCancel={hideDatePicker}
            minimumDate={new Date()} 
          />
          {!creneauxDisponiblesLoaded && (
            <Text style={styles.loadingText}></Text>
          )}
          {creneauxDisponiblesLoaded && creneauxDisponibles.length === 0 ? (
            <Text style={styles.noCreneauxText}>Aucun créneau disponible pour cette date.</Text>
          ) : (
            <View style={styles.creneauxContainer}>
              {creneauxDisponibles.map(creneau => (
                <TouchableOpacity
                  key={creneau.id}
                  style={[styles.creneau, selectedCreneauId === creneau.id && styles.selectedCreneau, placesDisponibles[creneau.id]?.placesDisponibles === 0 && styles.disabledCreneau]}
                  onPress={() => handleCreneauClick(creneau.id, creneau.heure_debut)}
                  disabled={placesDisponibles[creneau.id]?.placesDisponibles === 0}
                >
                  <View style={styles.iconContainer}>
                    <Icon name="clock-o" size={20} color="#fff" style={{ marginRight: 5 }} />
                    <Text>{creneau.heure_debut.split(':').slice(0, 2).join(':')}</Text>
                  </View>
                  <View style={styles.iconContainer}>
                    <Icon name="user" size={20} color="#fff" style={{ marginRight: 5 }} />
                    <Text>{placesDisponibles[creneau.id] ? placesDisponibles[creneau.id].placesDisponibles : '-'}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {selectedCreneauId && selectedCreneauHeureDebut && (
            <TouchableOpacity style={styles.bottomButton} onPress={prendreRendezVous}>
              <Text style={styles.buttonText}>Je prends un rendez-vous</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  datePickerButton: {
    backgroundColor: '#72B0DF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  datePickerText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  calendarIcon: {
    marginRight: 5,
  },
  creneauxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  creneau: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 10,
    marginBottom: 10,
    marginRight: 10,
    backgroundColor: '#BCE1FD',
  },
  selectedCreneau: {
    backgroundColor: '#EB0000',
  },
  disabledCreneau: {
    backgroundColor: '#ddd',
  },
  bottomButton: {
    backgroundColor: '#EB0000',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 2,
    marginRight: 9,
  },
  noCreneauxText: {
    fontSize: 16,
    color: '#blue',
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', 
    justifyContent: 'center', 
  },
});

export default Rendezvous;
