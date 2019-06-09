import React from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, KeyboardAvoidingView ,ActivityIndicator} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '../../components/button/Button'
import { UserSignUp } from '../../Store/actions/authAction'

class SignUp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            FirstName: '',
            LastName: '',
            email: '',
            address:'',
            password: '',
            select: false,
            loading:false
        }
    }

    create() {
        const { email, password, FirstName, LastName, select,address} = this.state
        var obj = {
            email, password, FirstName, LastName,address, status: select ? 'Delivery user' : 'User'
        }
        if (FirstName.length < 3 || LastName.length < 3) {
            alert('Something went wrong')
        }
        else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            alert('Invalid Email')
        }
        else if (password.length < 4) {
            alert('Week Password')
        }else if (address.length < 4) {
            alert('Input complete Address')
        }
        else {
            console.log('log');
            this.setState({
                loading:true
            })
            // this.props.userAuth(FirstName, LastName, email, password)
            const { UserSignUp } = this.props.actions

            UserSignUp(obj).then(() => {
                this.setState({
                    alert: true,
                    text: 'Registrering med succes'
                })
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'LogIn' }),
                    ]
                })
                this.props.navigation.dispatch(resetAction)
            }).catch((err) => {
                console.log(err, 'error here')
                alert(err)
                this.setState({
                    loading:false
                })
            })
        }
    }

    static navigationOptions = { header: null }

    render() {
        const { email, password, FirstName, LastName, select,address,loading} = this.state
        return (
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#3498db' }}>

                <KeyboardAvoidingView style={{ flex: 1, justifyContent: 'center' }} behavior={'padding'}>
                    <ScrollView style={{ flex: 1, marginTop: 24 }} >
                        <View style={{ alignItems: "center", justifyContent: 'center', width: '100%' }} >
                            <Text style={styles.heading}>Create Account</Text>
                            <View style={{ width: '90%' }} >
                                <Text style={styles.text}>First Name</Text>
                            </View>
                            <View style={styles.container}>
                                <TextInput
                                    value={FirstName}
                                    onChangeText={e => this.setState({ FirstName: e })}
                                    style={styles.input}
                                />
                            </View>
                            <View style={{ width: '90%' }} >
                                <Text style={styles.text}>Last Name</Text>
                            </View>
                            <View style={styles.container}>
                                <TextInput
                                    value={LastName}
                                    onChangeText={e => this.setState({ LastName: e })}
                                    style={styles.input}
                                />
                            </View>
                            <View style={{ width: '90%' }} >
                                <Text style={styles.text}>Email</Text>
                            </View>
                            <View style={styles.container}>
                                <TextInput
                                    value={email}
                                    onChangeText={e => this.setState({ email: e })}
                                    style={styles.input}
                                />
                            </View>
                            <View style={{ width: '90%' }} >
                                <Text style={styles.text}>Address</Text>
                            </View>
                            <View style={styles.container}>
                                <TextInput
                                    value={address}
                                    onChangeText={e => this.setState({ address: e })}
                                    style={styles.input}
                                />
                            </View>
                            <View style={{ width: '90%' }}>
                                <Text style={styles.text}>Password</Text>
                            </View>
                            <View style={styles.container}>
                                <TextInput
                                    value={password}
                                    onChangeText={e => this.setState({ password: e })}
                                    style={styles.input}
                                    secureTextEntry={true}
                                />
                            </View>
                            <View style={{ width: '90%', marginTop: 10, }}>
                                <Text onPress={() => this.setState({ select: false })} style={select ? { color: 'black', fontSize: 18, fontWeight: '300', paddingVertical: 8 } : { color: 'white', fontSize: 18, fontWeight: '400', borderColor: 'black', borderWidth: 1, paddingVertical: 8, paddingLeft: 4 }}>User</Text>
                            </View>
                            <View style={{ width: '90%', marginTop: 10, }}>
                                <Text onPress={() => this.setState({ select: true })} style={select ? { color: 'white', fontSize: 18, fontWeight: '400', borderColor: 'black', borderWidth: 1, paddingVertical: 8, paddingLeft: 4 } : { color: 'black', fontSize: 18, fontWeight: '300', paddingVertical: 8 }}>Delivery Boy</Text>
                            </View>
                            <View style={styles.button}>
                            {!loading &&
                                <Button
                                    color={true}
                                    border={true}
                                    name={'Create Account'}
                                    background={true}
                                    buttonAction={() => this.create()}
                                    textColor={'white'}
                                />}
                                {loading && <ActivityIndicator size="small" color="#00ff00" />}
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 4,
        width: '90%',
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 0.51,
        shadowRadius: 4.16,
        elevation: 5,
        shadowColor: 'grey',
        marginTop: 10,
        marginBottom: 20,
        alignItems: "center",
        justifyContent: 'space-between'
    },
    input: {
        color: 'black',
        height: 50,
        width: '95%',
        fontSize: 18,
        paddingVertical: 10,
    },
    button: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 15,
        opacity: 1,
        marginBottom: 10
    },
    text: {
        fontSize: 16,
        fontWeight: '500'
    },
    heading: {
        fontSize: 24,
        fontWeight: '600',
        color: "white",
        paddingVertical: 20
    },
    create: {
        fontSize: 16,
        fontWeight: '500',
        color: "white",
        marginTop: 20,
        textDecorationLine: 'underline'
    }
});

function mapStateToProps(states) {
    return ({
    })
}

function mapDispatchToProps(dispatch) {
    return ({
        actions: bindActionCreators({
            UserSignUp
        }, dispatch)
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);