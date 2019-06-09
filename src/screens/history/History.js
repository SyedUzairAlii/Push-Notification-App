import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase'
import { Header, Icon } from 'react-native-elements';
import moment from 'moment'


class History extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            historyList: [],
            history: false
        }
    }

    componentDidMount() {
        this.get()
        setTimeout(() => {
            this.get()
        }, 15100)
    }


    get = () => {
        const { user } = this.props
        var arr = [];
        firebase.database().ref('history').on('child_added', snapshot => {
            for (var key in snapshot.val()) {
                var val = snapshot.val()[key]
                // console.log(val,"ye first time chal chuka hy  hus hay")
                if (val.Sender_UID === user.userUid) {
                    arr.push(val)
                    if (arr && arr.length) {
                        this.setState({ historyList: arr, history: true })
                    }
                }
            }
        })
        firebase.database().ref('history').on('child_changed', snapshot => {
            for (var key in snapshot.val()) {
                var val = snapshot.val()[key]
                console.log(val,"yechange hus hay")
                if (val.Sender_UID === user.userUid) {
                    arr = []
                    firebase.database().ref('history').on('child_added', snapshot => {
                        for (var key in snapshot.val()) {
                            var val = snapshot.val()[key]
                            if (val.Sender_UID === user.userUid) {
                                arr.push(val)
                                if (arr && arr.length) {
                                    this.setState({ historyList: arr, history: true })
                                }
                            }
                        }
                    })
                }
            }
        })
    }


    back() {
        this.props.navigation.navigate('Dashboard')
    }

    static navigationOptions = { header: null }

    render() {
        const { historyList, history } = this.state
        return (
            <View style={{ flex: 1 }}>
                <Header
                    placement="center"
                    // rightComponent={{ icon: 'add', color: 'white' }}
                    centerComponent={{ text: 'History', style: { color: '#fff' } }}
                    leftComponent={{ icon: 'arrow-back', color: '#fff', onPress: () => this.back() }}
                />
                {history ?
                    <ScrollView >
                        {
                            historyList.map((item, index) => {
                                return (
                                    <View key={index} style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: '#eff1f2', borderWidth: 0.3, borderColor: 'white' }} >
                                        <View style={{ padding: 8 }}>
                                            <Icon
                                                style={styles.icon}
                                                name={'verified-user'}
                                            />
                                        </View>
                                        <View style={{ flex: 1, paddingLeft: 5, marginRight: 0 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={styles.titleName}>{item.Reciver_Name}</Text>
                                                <Text style={styles.price}>{moment(new Date(item.time)).fromNow()}</Text>
                                            </View>
                                            <Text style={{ color: '#424c59', paddingBottom: 10 }}>{moment(item.time) < moment(Date.now()) ? item.notify === 'Accept' ? 'Accept' : 'Reject' : item.notify}</Text>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </ScrollView>
                    :
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text>History Not Found</Text>
                    </View>
                }
            </View >
        );
    }
}


const styles = StyleSheet.create({
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

export default connect(mapStateToProps, mapDispatchToProps)(History);