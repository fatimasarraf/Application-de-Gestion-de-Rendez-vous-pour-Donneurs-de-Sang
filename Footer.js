import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; 

const Footer = ({ navigation, clientId, currentPage }) => {
  const navigateToPage = (pageName) => {
    if (pageName === 'Mesrendezvous') {
      navigation.navigate(pageName, { clientId });
    } else if (pageName === 'Compte') {
      
      if (currentPage === 'Centers') {
        navigation.navigate('Compte', { clientId });
      } else {
       
        navigation.navigate(pageName);
      }
    } else {
      navigation.navigate(pageName);
    }
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => navigateToPage('Centers')}>
        <FontAwesome5 name="home" style={styles.footerIcon} size={24} color="#64BBFD" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToPage('Compte')}>
        <FontAwesome5 name="user" style={styles.footerIcon} size={24} color="#64BBFD"/>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToPage('Mesrendezvous')}>
        <FontAwesome5 name="calendar" style={styles.footerIcon} size={24} color="#64BBFD"/>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToPage('MoreInfo')}>
        <FontAwesome5 name="info-circle" size={24} style={styles.footerIcon} color="#64BBFD" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width:'100%',
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
  },
});

export default Footer;
