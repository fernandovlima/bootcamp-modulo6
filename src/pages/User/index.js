import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  ShowLoading,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: false,
    page: 4,
    refreshing: false,
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    console.tron.log('navigation', this.props);

    this.setState({ loading: true });
    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({ stars: response.data, loading: false });
  }

  loadMore = async () => {
    const { stars, page } = this.state;
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    await api
      .get(`/users/${user.login}/starred?page=${page + 1}`)
      .then(resp => {
        this.setState({
          stars: stars.concat(resp.data),
          page: page + 1,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  refreshList = async () => {
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({ stars: response.data });
  };

  handleNavigate = repo => {
    const { navigation } = this.props;

    navigation.navigate('WebStarred', { repo });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, refreshing } = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
          <ShowLoading>
            <ActivityIndicator color="#7159c1" size="large" />
          </ShowLoading>
        ) : (
          <Stars
            onRefresh={this.refreshList} // Função dispara quando o usuário arrasta a lista pra baixo
            refreshing={refreshing} // Variável que armazena um estado true/false que representa se a lista está atualizando
            onEndReachedThreshold={0.5} // Carrega mais itens quando chegar em 20% do fim
            onEndReached={this.loadMore}
            data={stars}
            keyExtrator={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred>
                <OwnerAvatar
                  source={{
                    uri: item.owner.avatar_url && item.owner.avatar_url,
                  }}
                />
                <Info>
                  <Title onPress={() => this.handleNavigate(item)}>
                    {item.name}
                  </Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}
