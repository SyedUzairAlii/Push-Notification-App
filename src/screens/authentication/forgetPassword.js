import React from 'react';
import { StackActions, NavigationActions } from 'react-navigation';
import { Header, Icon } from 'react-native-elements';
import {
    View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView,
    Image, ScrollView, ActivityIndicator
} from 'react-native';
import IconFont from 'react-native-vector-icons/FontAwesome'
// import BackIcon from '../../../assets/back.png'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ForgetPasswordAction } from '../../Store/actions/authAction'
import InputField from '../../components/inputField/InputField';
import Button from '../../components/button/Button';
import { Snackbar } from 'react-native-paper'


class ForgetPassword extends React.Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);

        this.state = {
        }

    }

    onChange(value, text) {
        this.setState({
            [text]: value
        })
    }

    goBack() {
        const { navigate } = this.props.navigation

        navigate('LogIn')
    }

    forgetPassword() {
        const { email } = this.state
        this.setState({
            loading: true
        })
        if (email) {
            const { ForgetPasswordAction } = this.props.actions
            ForgetPasswordAction(email).then(() => {
                this.setState({
                    alert: true,
                    checkEmail: true,
                    loading: false,
                    text: 'Please check your email'
                })
            })
                .catch((err) => {
                    this.setState({
                        alert: true,
                        text: err.message,
                        loading: false,
                    })
                })
        } else {
            this.setState({
                alert: true,
                text: 'Please enter your email',
                loading: false,
            })
        }
        this.setState({
            checkEmail: false,
            email: '',
        })
    }

    render() {
        const { email, text, checkEmail, loading } = this.state
        return (
            <KeyboardAvoidingView style={{ flex: 1, position: 'relative', backgroundColor: '#3498db' }} behavior={'padding'} enabled>
                {/* <View> */}
                {/* <View style={styles.header}>
                    <TouchableOpacity onPress={() => this.goBack()} activeOpacity={0.7}>
                        <View style={styles.Icon}>
                            <Image
                                style={{ width: '100%', height: '100%' }}
                                source={BackIcon}
                            />
                        </View>
                    </TouchableOpacity>
                    <View style={{ alignSelf: 'center', paddingRight: 20, flexGrow: 1, alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: '400' }}>
                            {'Glemt dit password?'}
                        </Text>
                    </View>
                </View> */}
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 40 }}>
                    <View>
                        <View style={styles.form}>
                            <InputField
                                label={'E-mail'}
                                name={'email'}
                                type={'email-address'}
                                placeholder={'Enter e-mail...'}
                                value={email}
                                secure={false}
                                fontAwesome={false}
                                change={(value) => this.onChange(value, 'email')}
                            />
                            {
                                checkEmail &&
                                <View style={{ width: '90%', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 12, color: 'white' }}>
                                        {'Please check your email'}
                                    </Text>
                                </View>
                            }
                        </View>
                        <View style={styles.button}>
                            <Button
                                color={true}
                                border={true}
                                name={'send'}
                                background={true}
                                buttonAction={() => this.forgetPassword()}
                                textColor={'white'}
                            />
                        </View>
                    </View>
                </ScrollView>
                {/* </View> */}
                <Snackbar
                    visible={this.state.alert}
                    onDismiss={() => this.setState({ alert: false })}
                    action={{
                        label: 'Ok',
                        onPress: () => {
                            // Do something
                        },
                    }}
                >
                    {text}
                </Snackbar>
                <View style={{ position: 'absolute', bottom: '50%', left: '45%' }}>
                    {
                        loading &&
                        <ActivityIndicator size="large" color="blue" />
                    }
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        // borderWidth: 1,
        paddingVertical: 30,
        flexDirection: 'row'
    },
    Icon: {
        width: 40,
        height: 40,
        alignItems: 'center',
        // borderWidth: 1
    },
    button: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 15
    },
    form: {
        // borderWidth: 1,
        width: '100%',
        paddingVertical: 10,
        alignItems: 'center'
    },
})


function mapStateToProps(states) {
    return ({
    })
}

function mapDispatchToProps(dispatch) {
    return ({
        actions: bindActionCreators({
            ForgetPasswordAction
        }, dispatch)
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPassword);