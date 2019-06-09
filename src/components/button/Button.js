import React from 'react';
import { StackActions, NavigationActions } from 'react-navigation';
import { Header, Icon } from 'react-native-elements';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, } from 'react-native';


class Button extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }

    }

    render() {
        const { name, textColor, color, buttonAction, background, border, icon } = this.props
        return (
            <TouchableOpacity
                onPress={buttonAction}
                activeOpacity={0.8}
                style={[styles.button,
                border && { borderWidth: 1, borderColor: '#4419e7' },
                background && { backgroundColor: '#6719E7' }
                ]}>
                <View style={{ flexGrow: 1, alignItems: icon ? 'flex-end' : 'center', paddingHorizontal: 3 }}>
                    <Text style={[{ fontSize: 18 },
                    color && { color: textColor }
                    ]}>
                        {name}
                    </Text>
                </View>
                {
                    icon ?
                        <View style={{ flexGrow: 1, alignItems: 'flex-start', paddingHorizontal: 3 }}>
                            <Icon
                                size={25}
                                color={color && textColor}
                                name={'arrow-forward'}
                            />
                        </View>
                        :
                        null
                }
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        width: '90%',
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 15,
        alignItems: 'center',
        flexDirection: 'row',
        alignContent: 'center'
    }
})

export default Button