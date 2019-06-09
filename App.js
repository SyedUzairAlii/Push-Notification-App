import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './src/navigation/StackNavigation';
import { Provider } from 'react-redux'
import store from './src/Store/store'
console.disableYellowBox = true;

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    );
  }
}
