import React, { Component } from 'react'
import { Text, View, TextInput, StyleSheet, ScrollView, TouchableOpacity} from 'react-native'
import { DumbTopBar, Loading } from '../Components'
import { API_CHITS, SEARCH_ICON,LOCATION_ICON,PHOTO_ICON ,SEND_ICON,REMOVE_PHOTO_ICON, DRAFT_ICON, SAVE_ICON, API_USER} from '../Constants'
import { Root, Toast } from 'native-base'

/**
 * sign up screen
 * @author Jamshid
 * @description class for sign up screen
 * 
 */
export default class SignUp extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            error:false,
            loading:false,
            given_name: '',
            family_name: '',
            email: '',
            pass: ''
        }
    }
    /**
     * post user detail to server 
     */
    signUpHandler = () =>{
        let data = {
            given_name:this.state.given_name,
            family_name:this.state.family_name,
            email:this.state.email,
            password:this.state.pass,
        }
        this.setState({loading:true})
        // check if any of the field are empty with some()
        let empty = Object.values(data).some((elem)=>elem==="" )
        if(empty)
        {
            Toast.show({
                text: "Error! empty fields",
                buttonText: "Okay",
                duration: 1000
            })
            this.setState({loading:false})
            return  // decline to do anythin
        }

        return fetch(API_USER,        //base+ '/user'
        {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then((response) =>{
            console.log('raw')
            console.log(response)
            this.setState({loading:false})
            if(response.ok && response.status==201)
            {
                Toast.show({
                    text: "Success!",
                    buttonText: "Okay",
                    duration: 1000
                })
                this.props.navigation.navigate({ routeName:'Landing'});
            }
            else if(response.status==400){

                Toast.show({
                    text: "Error, please check fields!",
                    buttonText: "Okay",
                    duration: 3000
                })

            }
        }).catch((e)=>console.log(e))
    }


    render () {
        return (
            <Root>
 
                <DumbTopBar title="Sign Up" smallText='Enter details below' buttonText='Back' onPress={()=>this.props.navigation.goBack()}/>
            <ScrollView>
                <View style={[styles.container,{marginTop:40}]}>
                    <TextInput
                        autoCompleteType='name'
                        style={ styles.text }
                        placeholder='Enter given name'
                        onChangeText={given_name => this.setState({ given_name })}
                        value={this.state.given_name}
                    />
                </View>
                <View style={[styles.container]}>
                    <TextInput
                        autoCompleteType='name'
                        style={ styles.text }
                        placeholder='Enter family name'
                        onChangeText={family_name => this.setState({ family_name })}
                        value={this.state.family_name}
                    />
                </View>
                <View style={[styles.container]}>
                    <TextInput
                        autoCompleteType='email'
                        style={ styles.text }
                        placeholder='Enter Email'
                        onChangeText={email => this.setState({ email })}
                        value={this.state.email}
                    />
                </View>
                <View style={[styles.container]}>
                    <TextInput
                        secureTextEntry={true}
                        textContentType='password'
                        style={ styles.text }
                        placeholder='Enter password'
                        onChangeText={pass => this.setState({ pass })}
                        value={this.state.pass}
                    />
                </View>

                
            <View style={{justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={this.signUpHandler}
                    style={[styles.container,styles.signUpButton]}>
                    <Text style={styles.signUpText} >Sign Up</Text>
                </TouchableOpacity>
            </View>
            {this.state.loading? (<Loading />):(null)}

        </ScrollView>
        </Root>    
    )
  }
}

const styles = StyleSheet.create({
    container: { 
        flexDirection: 'row',
        backgroundColor: 'white', 
        elevation:5, 
        margin: 10, 
        borderRadius: 30,
        marginHorizontal:20
    },
  
    text: {
        flex: 1,
        flexWrap: 'wrap-reverse', 
        padding: 10, 
        paddingHorizontal: 15 
    },
    signUpButton:{
        borderWidth:2,
        borderColor:'#F33B3B',
        paddingHorizontal:40
    },
    
    signUpText:{
        textAlign:"center",
        color: '#d64a4a',
        padding:10,
        fontWeight: 'bold'
    },
})