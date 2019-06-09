import React from 'react';
import { StackActions, NavigationActions } from 'react-navigation';
import { Header, Icon } from 'react-native-elements';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, } from 'react-native';
import IconFont from 'react-native-vector-icons/FontAwesome'


class InputField extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }

    }

    render() {
        const { name, label, type, placeholder, secure, disabled, value, fontAwesome, PlaceholderColor, TextColor, iconColor } = this.props
        return (
            <View style={styles.form}>
                <View style={styles.label}>
                    <View style={{ paddingLeft: 20, paddingRight: 10 }}>
                        {
                            fontAwesome ?
                                <IconFont
                                    color={iconColor}
                                    size={25}
                                    name={name}
                                />
                                :
                                <Icon
                                    color={iconColor}
                                    size={25}
                                    name={name}
                                />
                        }
                    </View>
                    <View style={{ alignSelf: 'center' }}>
                        <Text style={{ fontSize: 17, fontWeight: '500', color: TextColor }}>
                            {label}
                        </Text>
                    </View>
                </View>
                <View style={styles.field}>
                    <TextInput
                        keyboardType={type}
                        style={styles.input}
                        editable={disabled ? false : true}
                        value={value ? value : null}
                        secureTextEntry={secure ? secure : false}
                        placeholder={placeholder}
                        onChangeText={(text) => this.props.change(text)}
                        placeholderTextColor={PlaceholderColor}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    form: {
        width: '90%',
        // borderWidth: 1,
        paddingVertical: 2
    },
    label: {
        flexDirection: 'row',
        paddingVertical: 3
    },
    input: {
        width: '100%',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 4,
        borderColor: 'lightgrey',
        backgroundColor: 'white'
    }
})

export default InputField