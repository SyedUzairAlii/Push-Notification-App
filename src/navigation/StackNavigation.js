import { createStackNavigator, createAppContainer, createDrawerNavigator, createMaterialTopTabNavigator } from 'react-navigation';
import LogIn from '../screens/authentication/LogIn'
import SignUp from '../screens/authentication/SignUp';
import Dashboard from '../screens/dashboard/Dashboard';
import History from '../screens/history/History';
import Notification from '../screens/notification/Notification';
import ForgetPassword from '../screens/authentication/forgetPassword';
import User from '../screens/dashboard/userDetails';

const StackNavigator = createStackNavigator({
    LogIn: {
        screen: LogIn
    },
    SignUp: {
        screen: SignUp
    },
    Dashboard: {
        screen: Dashboard
    },
    History: {
        screen: History
    },
    Notification: {
        screen: Notification
    },
    ForgetPassword: {
        screen: ForgetPassword
    },
    User:{
        screen:User
    }
},
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }
    })
const Navigation = createAppContainer(StackNavigator)

export default Navigation;