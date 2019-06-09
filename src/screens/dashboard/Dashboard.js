import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Button from '../../components/button/Button';
import firebase from 'firebase'
import { Header, Icon } from 'react-native-elements';
import { Permissions, Notifications } from 'expo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import UserIcon from '../../../assets/user.png'
import moment from 'moment'



async function getToken() {
    // Remote notifications do not work in simulators, only on device
    let { status } = await Permissions.askAsync(
        Permissions.NOTIFICATIONS,
    );
    if (status !== 'granted') {
        return;
    }
    var value = await Notifications.getExpoPushTokenAsync();
    console.log(value, 'token===<<');

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            const uid = user.uid;
            firebase.database().ref('/user/').orderByChild('userUid').equalTo(uid).on('child_added', (snapShot) => {
                firebase.database().ref('user' + '/' + snapShot.key).update({ expoToken: value })
            })
        }
    })
}

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            alluser: null,
            currentUser: null,
            UID: null,
            deliveryRender: false,
            DeliveryBoy: false,
            person: false,
            user: ''
        };
    }

    componentDidMount() {
        this.getDAta()
        this.getDelivery()
        getToken();
        this.listener = Notifications.addListener(this.handleNotification);
    }

    componentWillReceiveProps(props) {
        const { user } = props;
        this.setState({ user })
    }

    handleNotification = ({ origin, data }) => {
        console.log(
            `Push notification ${origin} with data: ${(data)}`,
        );
    };

    Logout() {
        firebase.auth().signOut()
        this.props.navigation.navigate('LogIn')
    }

    getDelivery() {
        var userUid = firebase.auth().currentUser.uid
        var arr = []
        firebase.database().ref('/history/' + userUid).on('child_added', (snapShot) => {
            if (!snapShot.exists) {
                this.setState({ deliveryRender: true })
            }
            arr.push(snapShot.val())

            this.setState({ delivered: arr, deliveryRender: true })
        })

        firebase.database().ref('/history/' + userUid).on('child_changed', (snapShot) => {
            arr.map((items, index) => {
                if (items.time === snapShot.val().time) {
                    arr.splice(index, 1, snapShot.val())
                    this.setState({ delivered: arr })
                }
            })
        })
    }


    getDAta = () => {
        var arr = []
        var user;
        var DeliveryBoy = false
        var UID = firebase.auth().currentUser.uid
        firebase.database().ref('/user/').on('child_added', snapShot => {
            const UserData = snapShot.val();
            if (UserData.userUid === UID) {
                user = snapShot.val()
                if (user.status === "Delivery user") {
                    DeliveryBoy = true
                    this.setState({ DeliveryBoy })
                } else {
                    this.setState({ person: true })
                }
            }
            else {
                if (snapShot.val().status === 'User') {
                    arr.push(snapShot.val())
                }
                // console.log("alluser", snapShot.val())
            }
            this.setState({
                alluser: arr,
                currentUser: user,
                UID,
                // DeliveryBoy
            })
        })

    }

    go(item) {
        this.props.navigation.navigate('User', item)
        console.log("gyaa ", item)
    }



    //naviagtion default header null
    static navigationOptions = {
        header: null
    };

    DeliveryHistory(item, index) {
        var status = item.notify === 'Pending' ? 'grey' : item.notify === 'Accept' ? 'green' : 'red'
        return (
            <View key={index} style={{ backgroundColor: '#dfe1e6', paddingHorizontal: '4%', marginTop: 1 }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flexGrow: 1, paddingVertical: '1%' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
                            {'Request From'}
                        </Text>
                    </View>
                    <View style={{ alignSelf: 'center' }}>
                        <Text style={{ fontWeight: 'bold', color: '#6b778c', fontSize: 12 }}>
                            {moment(new Date(item.time)).fromNow()}
                        </Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', paddingHorizontal: '2%' }}>
                    <View>
                        <Text style={{ color: '#6b778c' }}>
                            {item.Sender_Name}
                        </Text>
                    </View>
                </View>
                <View style={{ paddingHorizontal: '2%', paddingVertical: '2%', alignItems: 'flex-start' }}>
                    <View style={{
                        borderWidth: 1,
                        // paddingHorizontal: '4%',
                        width: '20%',
                        borderRadius: 5,
                        paddingVertical: '2%',
                        borderColor: status,
                        backgroundColor: status
                    }}>
                        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600', fontSize: 13 }}>
                            {item.notify}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        const { alluser, deliveryRender, delivered, UID, DeliveryBoy, person, user } = this.state

        return (
            <View style={styles.main}>
                {/* <StatusBar backgroundColor={'#014E70'} /> */}
                <Header
                    placement='center'
                    leftComponent={DeliveryBoy && { icon: 'assignment', color: 'white', onPress: () => this.props.navigation.navigate('History') } || person && { icon: 'notifications', color: 'white', onPress: () => this.props.navigation.navigate('Notification') }}
                    centerComponent={user && { text: `${user.FirstName} ${user.LastName}`, style: { color: '#fff' } }}
                    rightComponent={{ icon: 'lock', color: '#fff', onPress: () => this.Logout() }}
                />
                {/* <ScrollView> */}

                <View style={styles.minDiv}>
                    {!DeliveryBoy && !person &&
                        <View style={{ flex: 1, }}>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                    }
                    <View style={styles.Email}>

                        {
                            DeliveryBoy &&
                            <View style={styles.headings}><Text style={styles.HeadingText}>User's List's</Text></View>
                        }
                        {
                            person &&
                            <View style={styles.headings}><Text style={styles.HeadingText} onPress={() => this.props.navigation.navigate('Notification')}>Delivery History</Text></View>
                        }
                    </View>
                    <View style={{ flex: 1 }}>
                        <ScrollView>

                            {DeliveryBoy ?
                                <View style={styles.headings}>
                                    {alluser && alluser.map((item, index) => {
                                        return (
                                            <TouchableOpacity key={index} style={styles.User} onPress={() => this.go(item)}>
                                                <Image
                                                    source={UserIcon}
                                                    style={{ width: 50, height: 50, borderRadius: 25 }}
                                                />
                                                <Text style={styles.HeadingText}>
                                                    {item.FirstName + ' ' + item.LastName}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>
                                :
                                deliveryRender &&
                                    delivered ?
                                    delivered.length ?
                                        delivered.map((items, index) => {
                                            return (
                                                this.DeliveryHistory(items, index)
                                            )
                                        })
                                        :
                                        null
                                    :
                                    DeliveryBoy || person &&
                                    <View style={{ alignItems: 'center', paddingTop: '10%' }}>
                                        <Text style={{ fontSize: 14, color: 'grey' }}>
                                            {'No delivered history'}
                                        </Text>
                                    </View>


                            }
                        </ScrollView>

                    </View>

                </View>
                {/* </ScrollView> */}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'space-around'
    },
    minDiv: {
        flex: 1,
        height: "100%",
        flexDirection: 'column',
    },
    Email: {
        // borderWidth: 1,
        height: "8%",
        justifyContent: 'center',
        alignItems: 'center'

    },
    headings: {
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    User: {
        paddingHorizontal: 10,
        // justifyContent: 'center',
        flexDirection: 'row'
    },
    InputFields: {
        minHeight: 30,
        maxHeight: 100,
        borderBottomColor: '#5DBCD2',
        borderBottomWidth: 1,
        fontSize: 18,
        color: "black",
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: "center"
        // flex:1
    },
    HeadingText: {
        fontSize: 20,
        // fontWeight: 'bold',
        color: "#5DBCD2",
        borderBottomColor: '#5DBCD2',
        justifyContent: 'space-between',
        padding: 4
    },
    InputDiv: {
        margin: 5,
        padding: 5,
        // borderWidth: 1,
        width: '100%',
        height: '40%'
    },
    Button: {
        // borderWidth: 1,
        height: "90%",
        justifyContent: 'center',
        alignItems: 'center',
        // flexDirection: 'column',

    },
    textDivBottom: {
        height: "90%",
        // borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%"
    },
    ButtonDiv: {
        height: "90%",
        // borderWidth: 1,
        width: "96%",
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    hyperLink: {
        fontSize: 22,
        fontWeight: 'bold',
        color: "#0274BD",
        marginTop: "10%"

    }, detailText: {
        fontSize: 20,
        // fontWeight: 'bold',
        color: "#8B8B8B",
        margin: 0
    },
    buttondiv4: {
        backgroundColor: '#0274BD',
        width: '100%',
        height: '35%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
        borderRadius: 6
    },
    buttonTittle: {
        fontSize: 16,
        color: 'white'
    }
})

function mapStateToProps(states) {
    return ({
        user: states.authReducers.USER,
        allUser: states.authReducers.ALLUSER,
    })
}

function mapDispatchToProps(dispatch) {
    return ({

    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);