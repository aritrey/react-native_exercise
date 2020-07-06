import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  Alert,
  TextInput,
} from 'react-native';
import api from './services/api';

const App = () => {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [tech, setTech] = useState('');
  const [url, setUrl] = useState('');

  const addRepository = () => {
    console.log(tech);
    const myTechs = tech.replace(' ', '').split(',');
    if (url === '' || myTechs.length === 0 || url === '') {
      Alert.alert(
        'You have to fill in all fields.',
        'If you want to add a new Repository set title, tech and url!',
      );
    } else {
      api
        .post('/repositories', {
          title,
          url,
          techs: myTechs,
        })
        .then(response => {
          if (response.status !== 200) {
            Alert.alert(
              `Something went wrong. The response status is ${response.status}`,
            );
          } else {
            setItems([...items, response.data]);
          }
        });
      setTitle('');
      setTech('');
      setUrl('');
    }
  };

  const addALike = id => {
    api.post(`repositories/${id}/like`).then(response => {
      if (response.status !== 200) {
        Alert.alert(
          `Something went wrong. The response status is ${response.status}`,
        );
      } else {
        const newArray = items.map(item =>
          item.id === id ? {...item, likes: item.likes + 1} : item,
        );
        setItems(newArray);
      }
    });
  };

  const deleteItem = id => {
    api.delete(`repositories/${id}`).then(response => {
      if (response.status !== 204) {
        Alert.alert(
          `Something went wrong. The response status is ${response.status}`,
        );
      } else {
        const newArray = [];
        items.map(item => (item.id === id ? null : newArray.push(item)));
        setItems(newArray);
      }
    });
  };

  useEffect(() => {
    api.get('repositories').then(response => {
      setItems(response.data);
    });
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView>
        {items.map(item => {
          return (
            <View key={item.id} style={styles.item}>
              <Text style={styles.itemTitle}>Title: {item.title}</Text>
              <Text style={styles.itemText}>
                techs: {item.techs.reduce((total, next) => `${total}, ${next}`)}
              </Text>
              <Text style={styles.itemText}>likes: {item.likes}</Text>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <View style={styles.buttonContainer}>
                  <Button
                    title="add a like"
                    onPress={() => addALike(item.id)}
                  />
                </View>
                <View style={styles.buttonContainer}>
                  <Button
                    color="red"
                    title="delete"
                    onPress={() => deleteItem(item.id)}
                  />
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.button}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text style={styles.inputTitle}>Title:</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setTitle(text)}
            value={title}
            placeholder="set a title"
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.inputTitle}>tech:</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setTech(text)}
            value={tech}
            placeholder="set a tech"
          />
        </View>
      </View>

      <View style={{flexDirection: 'row'}}>
        <Text style={styles.inputTitle}>url:</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={text => setUrl(text)}
          value={url}
          placeholder="set a url"
        />
      </View>

      <Button title="add a repository" onPress={addRepository} />
    </View>
  );
};

const styles = StyleSheet.create({
  itemTitle: {color: 'yellow', fontSize: 20},
  itemText: {color: 'white', fontSize: 16},
  inputTitle: {
    alignItems: 'center',
    flex: 1,
    fontSize: 20,
    height: 35,
    backgroundColor: 'blue',
    color: 'yellow',
  },
  buttonContainer: {
    margin: 5,
    flex: 1,
  },
  textInput: {
    flex: 4,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    fontSize: 16,
    backgroundColor: 'white',
  },
  button: {
    justifyContent: 'flex-end',
  },
  item: {
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: 'blue',
  },
  container: {
    flex: 1,
    backgroundColor: 'lightskyblue',
  },
});

export default App;
