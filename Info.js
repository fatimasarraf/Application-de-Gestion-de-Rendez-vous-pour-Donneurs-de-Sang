import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>Conseils après le don</Text>
    </View>
  );
};

const Info = () => {
  const [isQuestion1Open, setIsQuestion1Open] = useState(false);
  const [isQuestion2Open, setIsQuestion2Open] = useState(false);
  const [isQuestion3Open, setIsQuestion3Open] = useState(false);

  const toggleQuestion1 = () => {
    setIsQuestion1Open(!isQuestion1Open);
  };

  const toggleQuestion2 = () => {
    setIsQuestion2Open(!isQuestion2Open);
  };

  const toggleQuestion3 = () => {
    setIsQuestion3Open(!isQuestion3Open);
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView}>
       
        <TouchableOpacity onPress={toggleQuestion1}>
          <Text style={[styles.question, { color: '#BC1619' }]}>Contacter nous après le don</Text>
        </TouchableOpacity>
        {isQuestion1Open && (
          <Text style={styles.answer}>En cas d'effets secondaires inhabituels tels que des étourdissements persistants, des nausées ou des douleurs au site de ponction, il est important de contacter immédiatement le centre de don ou de consulter un professionnel de la santé. Si vous souhaitez obtenir des informations sur les résultats de votre don, comme votre groupe sanguin ou les résultats des tests effectués sur votre sang, vous pouvez contacter le centre de don pour obtenir ces informations. Pour poser des questions ou des préoccupations concernant le processus de don de sang, les protocoles de sécurité ou toute autre question liée au don, vous pouvez également contacter le centre de don pour obtenir des réponses et des clarifications.</Text>
        )}

       
        <TouchableOpacity onPress={toggleQuestion2}>
          <Text style={[styles.question, { color: '#BC1619' }]}>La carte donneur</Text>
        </TouchableOpacity>
        {isQuestion2Open && (
          <Text style={styles.answer}>Une carte de donneur est un document personnel qui atteste de votre statut de donneur de sang régulier ou de votre participation à des dons de sang spécifiques. Elle peut contenir des informations telles que votre nom, votre groupe sanguin et votre numéro de donneur. Cette carte peut être utile en cas d'urgence médicale pour identifier rapidement votre groupe sanguin et votre historique de don de sang, et elle peut également comporter des rappels pour encourager les dons réguliers. Si vous souhaitez obtenir une carte de donneur, vous pouvez contacter votre centre de don de sang local pour savoir s'ils en fournissent et comment vous pouvez en obtenir une.</Text>
        )}

       
        <TouchableOpacity onPress={toggleQuestion3}>
          <Text style={[styles.question, { color: '#BC1619', marginBottom: 20 }]}>Effectuer un nouveau don</Text>
        </TouchableOpacity>
        {isQuestion3Open && (
          <Text style={styles.answer}>La période recommandée entre deux dons de sang peut varier en fonction des directives spécifiques du centre de don et de votre propre santé. Il est important de contacter le centre de don de sang pour connaître leur politique sur cette période d'attente. En général, il est conseillé de respecter un intervalle de quelques semaines à quelques mois entre les dons pour permettre à votre corps de récupérer complètement.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#42A3ED',
    textAlign: "center",
    marginTop: 20,
  },
  question: {
    fontSize: 20,
    marginBottom: 10,
    color: '#BC1619',
    fontWeight: 'bold', 
  },
  answer: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: 'justify', 
    fontWeight: '300', 
  },
});

export default Info;
