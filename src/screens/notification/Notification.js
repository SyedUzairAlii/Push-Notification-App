import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase'
import { Header, Icon } from 'react-native-elements';
import moment from 'moment'

class Notification extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            notificationList: [],
            notification: false
        }
    }

    componentDidMount() {
        this.get()
        // setTimeout(() => {
        //     this.get()
        // }, 16100)
    }

    get = () => {
        const { user } = this.props;
        var arr = [];
        firebase.database().ref('history' + '/' + user.userUid).on('child_added', snapshot => {
            // console.log(snapshot.val(), '====');
            var key = snapshot.key;
            var obj = {
                Name: snapshot.val().Sender_Name,
                _UID: snapshot.val()._UID,
                notify: snapshot.val().notify,
                time: snapshot.val().time,
                key: key
            }
            if (moment(snapshot.val().time) < moment(Date.now()) && snapshot.val().notify === 'Pending') {
                firebase.database().ref('history' + '/' + user.userUid + '/' + key).update({ notify: "Reject" })

            }
            arr.push(obj)
            if (arr && arr.length) {
                this.setState({ notificationList: arr, notification: true })
            }
        })

        firebase.database().ref('history' + '/' + user.userUid).on('child_changed', snapshot => {
            var key2 = snapshot.key;
            var obj2 = {
                Name: snapshot.val().Sender_Name,
                _UID: snapshot.val()._UID,
                notify: snapshot.val().notify,
                time: snapshot.val().time,
                key: key2
            }
            arr.map((items, index) => {
                if (items.time === snapshot.val().time) {
                    arr.splice(index, 1, obj2)

                    this.setState({ notificationList: arr, notification: true })
                }
            })
            // firebase.database().ref('history' + '/' + user.userUid).on('child_added', snapshot => {
            //     arr.push(obj2)
            //     if (arr && arr.length) {
            //     }
            // })
        })
    }
    Accept(item) {
        const { user } = this.props;
        alert('Request Accept')
        firebase.database().ref('history' + '/' + user.userUid + '/' + item.key).update({ notify: "Accept" })
    }

    Reject(item) {
        const { user } = this.props;
        alert('Request Reject')
        firebase.database().ref('history' + '/' + user.userUid + '/' + item.key).update({ notify: "Reject" })
    }

    back() {
        this.props.navigation.navigate('Dashboard')
    }

    static navigationOptions = { header: null }

    render() {
        const { notificationList, notification } = this.state
        return (
            <View style={{ flex: 1 }}>
                <Header
                    placement="center"
                    // rightComponent={{ icon: 'add', color: 'white' }}
                    centerComponent={{ text: 'Notification', style: { color: '#fff' } }}
                    leftComponent={{ icon: 'arrow-back', color: '#fff', onPress: () => this.back() }}

                />
                {notification ?
                    <ScrollView >
                        {
                            notificationList.map((item, index) => {
                                return (
                                    <View key={index} style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: '#eff1f2', borderWidth: 0.3, borderColor: 'white' }} >
                                        <View style={{ padding: 8 }}>
                                            {/* <Image style={styles.icon} source={{ uri: item.item.data.Photo }} /> */}
                                            <Icon
                                                style={styles.icon}
                                                name={'verified-user'}
                                                color={item.notify === 'Pending' ? 'grey' : item.notify === 'Accept' ? 'green' : 'red'}
                                            />
                                        </View>
                                        <View style={{ flex: 1, paddingLeft: 5, marginRight: 0 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={styles.titleName} >{item.Name}</Text>
                                                <Text style={styles.price} >{moment(new Date(item.time)).fromNow()}</Text>
                                            </View>
                                            <Text style={{ color: '#424c59' }}>Sent You a Request</Text>
                                            {
                                                moment(item.time) < moment(Date.now()) ?
                                                    <View>
                                                        <Text style={styles.btnContact}>{item.notify}</Text>
                                                    </View>
                                                    :
                                                    item.notify === 'Pending' ?
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={styles.btnAccept} onPress={() => this.Accept(item)} >Accept</Text>
                                                            <Text style={styles.btnDlt} onPress={() => this.Reject(item)} >Reject</Text>
                                                        </View>
                                                        :
                                                        <View>
                                                            <Text style={styles.btnContact}>{item.notify}</Text>
                                                        </View>
                                            }
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </ScrollView>
                    :
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text>No Notification</Text>
                    </View>
                }
            </View >
        );
    }
}

const styles = StyleSheet.create({
    mainBtn: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#3498db",
        padding: 8,
        borderWidth: 2,
        marginTop: 8
    },
    icon: {
        height: 70,
        width: 70,
        borderRadius: 35,
        // paddingLeft: 30
    },
    titleName: {
        paddingTop: 8,
        paddingBottom: 2,
        fontSize: 16,
        fontWeight: '700',
    },
    btnAccept: {
        overflow: 'hidden',
        margin: 5,
        paddingHorizontal: 30,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: '#3498db',
        fontSize: 12,
        fontWeight: '700',
        // textDecorationLine: 'underline',
        color: '#ffffff',
        marginLeft: 0,
    },
    btnDlt: {
        margin: 5,
        borderWidth: 1,
        paddingHorizontal: 30,
        paddingVertical: 4,
        borderRadius: 6,
        borderColor: '#424c59',
        fontSize: 12,
        fontWeight: '700',
        // textDecorationLine: 'underline',
        color: '#424c59',
    },
    btnContact: {
        marginTop: 5,
        marginBottom: 5,
        // marginRight:30,
        // borderWidth: 1,
        // paddingHorizontal:/ 60,
        paddingVertical: 3,
        textAlign: 'left',
        // borderRadius: 6,
        // borderColor: '#3498db',
        fontSize: 14,
        fontWeight: '700',
        textDecorationLine: 'underline',
        color: '#3498db',
    },
    price: {
        paddingTop: 8,
        paddingBottom: 2,
        paddingRight: 8,
        fontSize: 16,
        fontWeight: '700',
        color: '#424c59'
    }
});

function mapStateToProps(states) {
    return ({
        user: states.authReducers.USER,
    })
}

function mapDispatchToProps(dispatch) {
    return ({

    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Notification);