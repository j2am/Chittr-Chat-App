import React, { Component } from 'react'
import { Text, View, TextInput, TouchableOpacity, StyleSheet, BackHandler, ScrollView } from 'react-native'
import { DumbTopBar, Loading } from '../Components'
import { API_BASE_URI } from '../Constants'
import { setLoginStore } from '../Authentication'
import { Toast, Root } from 'native-base'

/**
 * Login screen
 * @author Jamshid
 * @description class for login screen
 * 
 */
export default class Login extends Component {
    constructor (props) {
        super(props)
        this.state = {loading:false, email: '',pass: ''}
    }

    /**
     *  Click listener for login button: authecticates user, fetches token and stores it 
     */
    loginHandler = () =>{
        let data = {email:this.state.email,password:this.state.pass}
        this.setState({loading:true})   //indicate loading
        return fetch(API_BASE_URI + 'login',        //base+ '/login'
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
            if(response.ok && response.status==200)
            {
                Toast.show({
                    text: "Logged In!",
                    buttonText: "Okay",
                    duration: 1000
                    })
                //reponse looks good, parse to json
                return response.json()
            }
            else if(response.status===400){
                // invalid details
                Toast.show({
                    text: "Wrong email/password!",
                    buttonText: "Okay",
                    duration: 3000
                    })
            }
            else{
                // we ran in to unexpected issue
                throw new Error('Network problem')
            }
        }).then(dataJson =>{
            console.log('json')
            console.log(dataJson)

            // check if data needed is in the json object
            if(dataJson.id!==null && dataJson.token!==null)
            {
                //store the details
                setLoginStore(dataJson.id,dataJson.token)
                //Go to landing page router
                this.props.navigation.navigate({ routeName: 'Landing' })
            
            }
        }).catch((e)=>{console.log(e); this.setState({loading:false})})
    }
  
    /**
     * Click handler for sign up button
     */
    gotoSignUpHandler = ()=>{
        this.props.navigation.navigate('SignUp')
    }

  render () {
    return (
        
        <Root>  
            {/* Header with title and button  */}
        <DumbTopBar title="Login" smallText='Login with Email and password' buttonText='Exit' onPress={()=>BackHandler.exitApp()}/>
        <ScrollView contentContainerStyle={{ padding:5 }}>

                {/* Email feild */}
            <View style={[styles.container,{marginTop:40}]}>
                <TextInput
                autoCompleteType='email'
                style={styles.text}
                placeholder='Enter Email'
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
                />
            </View>

                {/* Password field */}
            <View style={[styles.container]}>
                <TextInput
                style={styles.text}
                placeholder='Enter password'
                onChangeText={pass => this.setState({ pass })}
                value={this.state.pass}
                />
            </View>
            {/*  Button container */}
            <View style={{justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={this.loginHandler} 
                    style={[styles.container,styles.loginButton]}>
                    <Text style={styles.loginText} >Login</Text>
                </TouchableOpacity>

                {/* Sign up button  */}
                <TouchableOpacity onPress={this.gotoSignUpHandler}>
                    <Text style={styles.signupText} >Sign up for Chittr</Text>
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
        elevation: 10, margin: 10, borderRadius: 30 
    },
  
    text: {
        flex: 1,
        flexWrap: 'wrap-reverse', 
        padding: 10, 
        paddingHorizontal: 15 
    },

    loginButton:{
        borderWidth:2,
        borderColor:'#F33B3B',
        paddingHorizontal:40
    },
    
    loginText:{
        textAlign:"center",
        color: '#d64a4a',
        padding:10,
        fontWeight: 'bold'
    },
    
    signupText:{
        textAlign: 'center',
        margin:30,
        fontSize: 20,
        color: '#d64a4a',
        fontWeight: 'bold'
    }
})

