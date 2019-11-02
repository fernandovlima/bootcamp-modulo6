import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';
import { View, ActivityIndicator } from 'react-native';

export default class WebStarred extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('repo').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    loading: null,
  };
  componentDidMount() {
    this.setState({ loading: true });
  }

  hideLoading = () => {
    this.setState({ loading: false });
  };
  render() {
    const { navigation } = this.props;
    const repo = navigation.getParam('repo');
    const { loading } = this.state;

    return (
      <View
        style={{
          flex: 1,
          alignContent: 'center',
          justifyContent: 'center',
        }}
      >
        {loading && <ActivityIndicator color="#7159c1" size="large" />}
        <WebView
          source={{ uri: repo.html_url }}
          style={{ flex: 1 }}
          onLoad={this.hideLoading}
        />
      </View>
    );
  }
}
