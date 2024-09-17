import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ScrollView, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Inscription = () => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [motdepasse, setMotDePasse] = useState('');
  const [telephone, setTelephone] = useState('');
  const [groupeSanguin, setGroupeSanguin] = useState('');
  const [age, setAge] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleSubmit = () => {
    if (!nom || !prenom || !email || !motdepasse || !telephone || !groupeSanguin || !age) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (!validateEmail(email)) {
      setError('Veuillez saisir une adresse e-mail valide');
      return;
    }

    axios.post('https://d4a9-105-66-135-30.ngrok-free.app/inscription', {
      nom,
      prenom,
      email,
      motdepasse,
      telephone,
      groupeSanguin,
      age
    })
    .then(response => {
      setMessage('Utilisateur inscrit avec succès');
      setError('');
      console.log('Utilisateur inscrit avec succès:', response.data);
      navigation.navigate('Connexion');
    })
    .catch(error => {
      if (error.response && error.response.status === 400 && error.response.data && error.response.data.error === 'email_exists') {
        setError('Cette adresse e-mail est déjà associée à un compte');
        setMessage('');
      } else {
        console.log('Erreur complète:', error); 
        setMessage('');
        setError('Erreur lors de l\'inscription');
        console.log('Erreur lors de l\'inscription:', error);
      }
    });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image source={require('./logo.png')} style={styles.image} resizeMode="contain" />
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <TextInput
          style={styles.input}
          placeholder='Nom'
          placeholderTextColor='#000'
          value={nom}
          onChangeText={text => setNom(text)}
        />
        <TextInput
          style={styles.input}
          placeholder='Prénom'
          placeholderTextColor='#000'
          value={prenom}
          onChangeText={text => setPrenom(text)}
        />
        <TextInput
          style={styles.input}
          placeholder='Email'
          placeholderTextColor='#000'
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder='Mot de passe'
          placeholderTextColor='#000'
          value={motdepasse}
          onChangeText={text => setMotDePasse(text)}
          secureTextEntry={true}
        />
        <TextInput
          style={styles.input}
          placeholder='Téléphone'
          placeholderTextColor='#000'
          value={telephone}
          onChangeText={text => setTelephone(text)}
          keyboardType='numeric'
        />
        <TextInput
          style={styles.input}
          placeholder='Groupe Sanguin'
          placeholderTextColor='#000'
          value={groupeSanguin}
          onChangeText={text => setGroupeSanguin(text)}
        />
        <TextInput
          style={styles.input}
          placeholder='Âge'
          placeholderTextColor='#000'
          value={age}
          onChangeText={text => setAge(text)}
          keyboardType='numeric'
        />
        {message ? <Text style={styles.successMessage}>{message}</Text> : null}
        {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  image: {
    width: 150, 
    height: 150, 
    marginBottom: 20,
    resizeMode: 'contain', 
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#BCE1FD',
    backgroundColor: 'rgba(188, 225, 253, 0.5)',
    padding: 10,
    marginBottom: 10,
    width: '100%',
    borderRadius: 10,
  },
  successMessage: {
    color: '#5FB1EF',
    marginTop: 10,
  },
  errorMessage: {
    color: '#BC1619',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#EB0000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Inscription;
