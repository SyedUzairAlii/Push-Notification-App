import React from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, KeyboardAvoidingView ,ActivityIndicator} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '../../components/button/Button'
import { Action, userAuth } from '../../Store/actions/authAction'


class LogIn extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            loading: false
        }
    }

    componentDidMount() {
        const { userAuth } = this.props.actions

        userAuth().then(() => {

            const resetAction = StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'Dashboard' }),
                ]
            })
            this.props.navigation.dispatch(resetAction)

        })
            .catch(() => {
                // const resetAction = StackActions.reset({
                //     index: 0,
                //     actions: [
                //         NavigationActions.navigate({ routeName: 'LogIn' }),
                //     ]
                // })
                // this.props.navigation.dispatch(resetAction)
            })
    }

    LoginAction() {
        console.log('=====');

        const { email, password, } = this.state
        if (email && password) {
            this.setState({
                loading:true
            })
            const { Action } = this.props.actions

            Action(email, password).then(() => {
                alert('Login Success')
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Dashboard' }),
                    ]
                })
                this.props.navigation.dispatch(resetAction)
            }).catch((err) => {
                alert(err)
                this.setState({
                    loading:false
                })
            })
        } else {
            alert('Please Enter Valid Email And Password')
        }
    }

    createAccount() {
        this.props.navigation.navigate('SignUp')
    }

    static navigationOptions = { header: null }
    render() {
        const { email, password,loading } = this.state
        return (
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#3498db' }}>

                {/* <ScrollView style={{ flexGrow: 1 }} > */}
                {/* <KeyboardAvoidingView behavior={'padding'}> */}
                <View style={{ alignItems: "center", justifyContent: 'center', width: '100%' }} >
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
                    <View style={styles.button}>
                     {!loading &&   <Button
                            color={true}
                            border={true}
                            name={'Log In'}
                            background={true}
                            buttonAction={() => this.LoginAction()}
                            textColor={'white'}
                        />}
                        {loading && <ActivityIndicator size="small" color="#00ff00" />}
                    </View>
                    <Text onPress={() => this.props.navigation.navigate('ForgetPassword')} style={styles.forgot}>Forgot Password?</Text>
                    <Text style={styles.create} onPress={() => this.createAccount()}>Create Account</Text>
                </View>
                {/* </KeyboardAvoidingView> */}
                {/* </ScrollView> */}
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
    forgot: {
        fontSize: 12,
        fontWeight: '400',
        color: "white",
        textDecorationLine: 'underline'
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
            Action,
            userAuth
        }, dispatch),
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(LogIn);