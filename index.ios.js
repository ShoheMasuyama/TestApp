/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import ReactNative from 'react-native';
import * as firebase from 'firebase';

const StatusBar = require('./components/StatusBar');
const ActionButton = require('./components/ActionButton');
const ListItem = require('./components/ListItem');
const styles = require('./styles.js');

const {
    AppRegistry,
    ListView,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    AlertIOS,
} = ReactNative;

const FirebaseConfig = require('./firebase.config');

const firebaseApp = firebase.initializeApp(FirebaseConfig);


export default class TestApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
    this.itemsRef = firebaseApp.database().ref();
  }

  listenForItems(itemsRef){
      itemsRef.on('value', (snap) => {
          var items = [];
          snap.forEach((child) => {
              items.push({
                  title: child.val().title,
                  _key: child.key
              });
          });
          this.setState({
              dataSource: this.state.dataSource.cloneWithRows(items)
          });
      });
  }

  _addItem(){
      AlertIOS.prompt(
          'Add New Item',
          null,
          [
              {
                  text: 'Add',
                  onPress: (text) => {
                      this.itemsRef.push({ title: text})
                  }
              },
          ],
          'plain-text'
      );
  }

  componentDidMount() {
    // this.setState({
    //   dataSource: this.state.dataSource.cloneWithRows([{ title: 'Pizza' }])
    // })
      this.listenForItems(this.itemsRef);
  }

    _renderItem(item) {

        const onPress = () => {
            AlertIOS.alert(
                'Complete',
                null,
                [
                    {text: 'Complete', onPress: (text) => this.itemsRef.child(item._key).remove()},
                    {text: 'Cancel', onPress: (text) => console.log('Cancelled')}
                ]
            );
        };

        return (
            <ListItem item={item} onPress={onPress} />
        );
    }

  render() {
    return (
            <View style={styles.container}>

            <StatusBar title="Grocery List" />

            <ListView dataSource={this.state.dataSource} renderRow={this._renderItem.bind(this)} style={styles.listview} />

            <ActionButton title="Add" onPress = { this._addItem.bind(this) } > </ActionButton>

            </View>
    );
  }
}

AppRegistry.registerComponent('TestApp', () => TestApp);
