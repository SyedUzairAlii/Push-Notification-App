

import React from 'react';
import { View, ScrollView, Image, Text, StyleSheet, TouchableOpacity, TextInput, Button, KeyboardAvoidingView, } from 'react-native';
import firebase from '../../config/Firebase';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux'
import { Header, Input } from 'react-native-elements';
import { Constants, Location, Permissions, Contacts } from 'expo';
import { ImagePicker } from 'expo';
import UserIcon from '../../../assets/user.png'

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: false,
            disabled: false
        };
    }
    componentDidMount() {
        const { navigation, } = this.props
        const details = navigation.state.params
        var user
        var UID = firebase.auth().currentUser.uid
        firebase.database().ref('/user/').on('child_added', snapShot => {
            const UserData = snapShot.val();
            // console.log("user", snapShot.val())
            if (UserData.userUid === UID) {
                user = snapShot.val()
            }
        })
        this.setState({
            Userdetails: details,
            user: true,
            UID,
            currentUser: user,
        })
    }

    submit(i) {
        const { UID, currentUser } = this.state
        // console.log(currentUser, '------');
        var now = new Date();
        now.setMinutes(now.getMinutes() + 1); // timestamp
        now = new Date(now); // Date object
        var time = now.toString()

        this.setState({ disabled: true })

        fetch('https://exp.host/--/api/v2/push/send', {
            mode: 'no-cors',
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                to: i.expoToken,
                title: `Request`,
                body: `${currentUser.FirstName} ${currentUser.LastName} send you a request`,
            })
        });
        var obj = {
            Sender_UID: UID,
            Reciver_UID: i.userUid,
            time: time,
            notify: 'Pending',
            Reciver_Name: `${i.FirstName} ${i.LastName}`,
            Sender_Name: `${currentUser.FirstName} ${currentUser.LastName}`
        }
        firebase.database().ref('/history/' + i.userUid).push(obj).then(() => {
            alert('success')
            this.setState({ disabled: false })
            setTimeout(() => {
                this.CheckStatus(i, obj)
            }, 15000)
            this.props.navigation.navigate('Dashboard')
        })
    }

    CheckStatus = (i, obj) => {
        firebase.database().ref('/history/' + i.userUid).on('value', (snapshot) => {
            for (var key in snapshot.val()) {
                var value = snapshot.val()[key]
                if (value.time === obj.time) {
                    console.log("notification data here><><><>><><", value)
                    if (value.notify === "Pending") {
                        var done = {
                            notify: "Reject",
                        }
                        firebase.database().ref('/history/' + i.userUid + '/' + key + '/').update(done).then(() => {
                            console.log("order cancled ")
                        })
                    }
                }
            }
        })
    }

    static navigationOptions = { header: null }

    render() {
        const { user, Userdetails, disabled } = this.state

        return (
            <View style={{ flex: 1 }}>
                <Header
                    placement='center'
                    leftComponent={{ icon: 'assignment', color: 'white', onPress: () => this.props.navigation.navigate('Dashboard') }}
                    centerComponent={{ text: "User Detail's", style: { color: '#fff' } }}
                // rightComponent={{ icon: 'lock', color: '#fff', onPress: () => this.Logout() }}
                />
                <ScrollView>
                    <KeyboardAvoidingView enabled>
                        <View style={styles.MainDiv}>
                            <View>
                                <View style={{ alignItems: "center" }}>
                                    <Image source={UserIcon} style={{ width: 270, height: 230 }} />

                                </View>

                            </View>
                            {
                                user && Userdetails &&
                                <View>
                                    <View style={styles.headings}><Text style={styles.HeadingText}>{`Name:${Userdetails.FirstName} ${Userdetails.LastName}`} </Text></View>
                                    <View style={styles.headings}><Text style={styles.HeadingText}>{`Address:${Userdetails.address} `} </Text></View>
                                    <View style={styles.headings}><Text style={styles.HeadingText}>{`Email:${Userdetails.email}`} </Text></View>
                                </View>
                            }
                        </View>
                        <View style={{ height: 20, marginBottom: 10 }}>
                            <Button
                                disabled={disabled}
                                onPress={!disabled ? () => this.submit(Userdetails) : ''}
                                title="Send"
                                color={disabled ? '#dfe1e6' : "#841584"}
                            />
                        </View>
                        <View style={{ height: 20 }}></View>

                    </KeyboardAvoidingView>
                </ScrollView>

            </View>

        );
    }
}

const styles = StyleSheet.create({

    statusBar: {
        backgroundColor: "#075e54",
        height: Constants.statusBarHeight,
    },
    InputFields: {
        minHeight: 30,
        maxHeight: 100,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        fontSize: 15,

    },
    InputDiv: {
        margin: 5,
        padding: 5,
    },
    MainDiv: {
        margin: 5,
        backgroundColor: '#e9f1e2',
        borderRadius: 10,
    },
    headings: {
        paddingHorizontal: 10,
        justifyContent: 'center',
        // alignItems: 'center'
    },
    HeadingText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: "#4860a5",

    },
    inputPrice: {
        backgroundColor: 'rgba(99, 172, 221,0.5)',
        color: '#fff',
        height: 34,
        width: 70,
        paddingHorizontal: 10,
        // paddingVertical: 16,
        justifyContent: 'center',
        fontSize: 18,
        borderRadius: 10,
        overflow: 'hidden'
    },
    dateTime: {
        padding: 10,
        color: '#fff',
        height: 40,
        fontSize: 18,
    },

});

function mapStateToProp(state) {
    return ({
    })
}
function mapDispatchToProp(dispatch) {
    return ({


    })
}
export default connect(mapStateToProp, mapDispatchToProp)(User);
