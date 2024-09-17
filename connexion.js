import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Button, Alert, Text, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Connexion = () => {
    const [email, setEmail] = useState('');
    const [motdepasse, setMotDePasse] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation();

    const handleCreateAccount = () => {
        navigation.navigate('inscription');
    };

    const handleSubmit = async () => {
        console.log('Tentative de connexion avec email :', email);
        console.log('Mot de passe :', motdepasse);

        if (!email || !motdepasse) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        try {
            const response = await axios.post('https://d4a9-105-66-135-30.ngrok-free.app/connexion', {
                email,
                motdepasse
            });

            if (response.data && response.data.token) {
                const token = response.data.token;

                // Stocker le token dans AsyncStorage
                await AsyncStorage.setItem('token', token);
                console.log('Token JWT stocké avec succès dans AsyncStorage:', token);

                console.log('Réponse de connexion reçue :', response.data);

                if (response.data && response.data.id) {
                    console.log('Utilisateur connecté avec succès. ID utilisateur :', response.data.id);
                    navigation.navigate('Centers', { clientId: response.data.id });
                } else {
                    Alert.alert('Email ou mot de passe incorrect');
                }
            } else {
                Alert.alert('Email ou mot de passe incorrect');
            }
        } catch (error) {
            console.log('Erreur lors de la connexion:', error);
            if (error.response && error.response.status === 401) {
                Alert.alert('Email ou mot de passe incorrect');
            } else {
                Alert.alert('Une erreur est survenue lors de la connexion');
            }
        }0
    };

    return (
        <ImageBackground source={require('./blood.png')} style={styles.backgroundImage}>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Connexion</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Email'
                        placeholderTextColor='#999'
                        value={email}
                        onChangeText={text => setEmail(text)}
                    />

                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder='Mot de passe'
                            placeholderTextColor='#999'
                            value={motdepasse}
                            onChangeText={text => setMotDePasse(text)}
                            secureTextEntry={!showPassword}
                        />
                        <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="#BCE1FD" onPress={() => setShowPassword(!showPassword)} style={[styles.eyeIcon, { marginTop: -10 }]} />
                    </View>

                    <Button title='Se connecter' onPress={handleSubmit} color="#42A3ED" />
                </View>

                <Text style={[styles.inscriptionText, {color: '#42A3ED'}]} onPress={handleCreateAccount}>Créer un compte si vous n'avez pas de compte</Text>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    formContainer: {
        borderWidth: 1,
        borderColor: '#BCE1FD',
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 20,
        width: '100%',
    },
    input: {
        borderWidth: 1,
        borderColor: '#BCE1FD',
        padding: 10,
        marginBottom: 20,
        height: 50,
        width: '100%',
        color: 'black',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    eyeIcon: {
        marginLeft: -30,
    },
    inscriptionText: {
        textDecorationLine: 'underline',
        marginTop: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#42A3ED',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
});

export default Connexion;
