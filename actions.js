
import axios from 'axios';

export const loginUser = (email, motdepasse) => async dispatch => {
  try {
    const response = await axios.post('https://b9bf-105-74-12-197.ngrok-free.app/connexion', {
      email,
      motdepasse
    });
    
    if (response.data && response.data.id) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
      console.log('Utilisateur connecté avec succès. ID utilisateur :', response.data.id);
      // Vous pouvez également naviguer ici
    } else {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Email ou mot de passe incorrect' });
    }
  } catch (error) {
    console.log('Erreur lors de la connexion:', error);
    if (error.response && error.response.status === 401) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Email ou mot de passe incorrect' });
    } else {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Une erreur est survenue lors de la connexion' });
    }
  }
};
