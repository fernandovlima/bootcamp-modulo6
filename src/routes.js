import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from './pages/Main/index';
import User from './pages/User/index';
import WebStarred from './pages/WebStarred/index';

const Routes = createAppContainer(
  createStackNavigator(
    {
      Main,
      User,
      WebStarred,
    },
    {
      headerLayoutPreset: 'center',
      headerBackTitleVisible: false,
      defaultNavigationOptions: {
        headerStyle: {
          backgroundColor: '#7159c1',
        },
        headerTintColor: '#fff',
      },
    }
  )
);

export default Routes;
