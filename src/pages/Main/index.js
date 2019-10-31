import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';

import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
  ValidationTxt,
} from './styles';

import api from '../../services/api';

Icon.loadFont();

export default class Main extends Component {
  static navigationOptions = {
    title: 'Users',
  };

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };
  state = {
    newUser: '',
    users: [],
    loading: false,
    errorMsg: '',
    error: null,
  };

  async componentDidMount() {
    const users = await AsyncStorage.getItem('users');

    if (users) {
      this.setState({ users: JSON.parse(users) });
    }
  }

  async componentDidUpdate(_, prevState) {
    const { users } = this.state;

    if (prevState !== users) {
      AsyncStorage.setItem('users', JSON.stringify(users));
    }
  }

  handleAddUser = async () => {
    const { users, newUser } = this.state;

    this.setState({
      loading: true,
    });

    const response = await api.get(`/users/${newUser}`);

    if (newUser === '') throw new Error('You need to type a user');

    const userExist = users.find(user => user.login === response.data.login);
    if (userExist) throw new Error('User already added to list.');

    const data = {
      name: response.data.name,
      login: response.data.login,
      bio: response.data.bio,
      avatar: response.data.avatar_url,
    };

    try {
      this.setState({
        users: [...users, data],
        newUser: '',
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: true,
        errorMsg: error.response ? error.response.data.message : error.message,
      });
    } finally {
      this.setState({ loading: false });
    }

    Keyboard.dismiss();
  };

  handleNavigate = user => {
    const { navigation } = this.props;

    navigation.navigate('User', { user });
  };

  render() {
    const { newUser, users, loading, errorMsg, error } = this.state;

    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Add User"
            value={newUser}
            onChangeText={text => this.setState({ newUser: text })}
            returnKeyType="send"
            onSubmitEditing={this.handleAddUser}
          />
          <SubmitButton loading={loading} onPress={this.handleAddUser}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Icon name="plus" color="#fff" size={20} />
            )}
          </SubmitButton>
        </Form>
        {error && <ValidationTxt>{errorMsg}</ValidationTxt>}

        <List
          data={users}
          keyExtractor={user => user.login}
          renderItem={({ item }) => (
            <User>
              <Avatar source={{ uri: item.avatar }} />
              <Name>{item.name}</Name>
              <Bio>{item.bio}</Bio>

              <ProfileButton onPress={() => this.handleNavigate(item)}>
                <ProfileButtonText>See Profile</ProfileButtonText>
              </ProfileButton>
            </User>
          )}
        />
      </Container>
    );
  }
}
