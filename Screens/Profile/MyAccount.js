import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import {Toast, Root } from 'native-base'
import { API_BASE_URI, API_USER, API_USER_PHOTO, } from '../Constants'

import ImagePicker from 'react-native-image-picker';
import { ScrollView } from 'react-native-gesture-handler'

const options = {
  title: 'Select Image',
  mediaType:'photo',
  quality:.5,

};


/**
 *  edit my account
 */
export class MyAccount extends Component {
    constructor(props) {
        super(props)
        const { navigation } = this.props
        this.store = navigation.getParam('store')
        this.details = navigation.getParam('details')
        console.log(this.store)
        this.state = 
        {
            given_name: this.details.given_name,
            family_name: this.details.family_name,
            email: this.details.email,
            password: '',
            changePassword:false,
            photopicked:''
        }
        
    }

    updateAccount= ()=>{
        
        let data = {
            given_name:this.state.given_name,
            family_name:this.state.family_name,
            email:this.state.email,
        }
        this.setState({loading:true})

        let empty = Object.values(data).some((elem)=>elem==="" )
        if(empty)
        {
            Toast.show({
                text: "Error! empty fields",
                buttonText: "Okay",
                duration: 1000
            })
            this.setState({loading:false})
            return
        }
        if(this.state.changePassword){
            data.push({password:this.state.password})
        }
        return fetch(API_USER  +this.store.id,{
            method:'PATCH',
            headers:{'Content-Type': 'application/json', 'X-Authorization': this.store.token }, 
            body: JSON.stringify(data)
        }).then((response) =>{
            console.log('raw')
            console.log(response)
            this.setState({loading:false})
            if(response.ok && response.status==201)
            {
                this.gotoProfile()
                Toast.show({
                    text: "Success!",
                    buttonText: "Okay",
                    duration: 1000
                })
            }
            else {
                Toast.show({
                    text: "Error, please check fields or try again later!",
                    buttonText: "Okay",
                    duration: 3000
                })
            }
        }).catch((e)=>{this.setState({loading:false});console.log(e)})
    }



// image picker

    pickFile= ()=>{
        return ImagePicker.showImagePicker(options, (imageResponse) => {          
            if (imageResponse.didCancel) {
              console.log('User cancelled image picker');
            } else if (imageResponse.error) {
              console.log('ImagePicker Error: ', imageResponse.error);
            } else {

                fetch(API_USER + 'photo',
                {   
                    method:"POST",
                    headers: {
                        'X-Authorization':this.store.token,
                        'Content-Type': 'image/jpeg',
                    }, 
                    body:{'base_64':imageResponse.data,'uri':imageResponse.uri}
                }).then((response)=>{ 
                                      
                    if(response.status===201)
                    {
                        this.gotoProfile()
                        Toast.show({
                        text: "Uploaded!",
                        buttonText: "Okay",
                        duration: 1000
                        }) 
                    }
                    console.log(response)
                    // this.props
                    
                }).catch((error)=> {       console.log(error)        })
            }
        })
    } 

    togglePasswordField = () => {
        this.setState({changePassword:!this.state.changePassword})
        
    }

    gotoProfile = ()=>this.props.navigation.navigate('ProfileHome')

    render() {
        return (
        <Root>
          {/* <TopBar/> */}
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <TouchableOpacity 
                onPress={this.gotoProfile}
                style={{  borderRadius: 20, elevation: 10, backgroundColor: 'white', margin: 10 }}>
                    <Text style={{ padding: 8, paddingHorizontal:15, fontWeight: '700' }}>Back</Text>
            </TouchableOpacity>
            
          </View>
          
          <ScrollView contentContainerStyle={{justifyContent: 'center'}}>
            <View style={{ marginHorizontal:20,borderRadius:30,elevation:10, backgroundColor:'white' }}>
            <TouchableOpacity 
            onPress={this.pickFile} 
            style={[styles.buttonContainer,{alignItems:'center'}]}>
                <Image
                    source={{ uri: API_USER_PHOTO(this.store.id) + '?'+Date.now().toString()}}
                    style={styles.picture} />
                <Text style={{ fontSize: 18, color:'blue', margin: 10,  textAlign: 'center' }}>Change Photo </Text>
            </TouchableOpacity>
            </View>
           
            <Field 
                type='name'
                label='Given name'
                placeholder='Enter new name'
                value = {this.state.given_name}
                onChangeText={(given_name) => this.setState({ given_name })}
            />
            <Field 
                type='name'
                label='Family name'
                placeholder='Enter new name'
                value = {this.state.family_name}
                onChangeText={(family_name) => this.setState({ family_name })}
            />
            <Field 
                type='email'
                label='Email'
                placeholder='Enter new Email'
                value = {this.state.email}
                onChangeText={(email) => this.setState({ email })}
            />
            <TouchableOpacity 
                onPress={this.togglePasswordField} 
                style={[styles.buttonContainer,{alignItems:'center'}]}>
                <Text style={{ margin:10, color:'blue', textAlign: 'center' }}>Change Password </Text>
            </TouchableOpacity>
            
            {
                this.state.changePassword?(<Field 
                    type='password'
                    label='Password'
                    placeholder='Enter new password'
                    value = {this.state.password}
                    onChangeText={(password) => this.setState({ password })}
                />) : (null)
            }
            <View style={{flexDirection:'row',justifyContent:'center'}}>  
                <TouchableOpacity 
                    onPress={this.updateAccount}
                    style={{  borderRadius: 25, elevation: 5, backgroundColor: 'white', margin: 10 }}>
                    <Text style={{ padding: 12, paddingHorizontal:20, fontWeight: '700' }}>Save</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>        
        </Root>
        )
    }
}
function Field(props)
{
    return (<View style={[styles.container,{}]}>
        <View style={{justifyContent: 'center', }}>
            <Text style={{padding: 10, borderRightWidth:0.5}}>{props.label} 
            </Text>
        </View>
        <TextInput
            autoCompleteType={props.type?props.type:(null)}
            placeholder={props.placeholder}
            onChangeText={props.onChangeText}
            value={props.value}
        />
    </View>)
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
    buttonContainer: { flexDirection: 'row', padding: 10, marginHorizontal: 10 },
    buttonText: { flexGrow: 1, fontSize: 20, fontFamily: '400' },
    picture: {padding: 50, borderWidth: 3, borderColor: 'rgba(255,0,0,0.4)', borderRadius: 100, alignSelf: 'center', resizeMode: 'cover', height: undefined, aspectRatio: 1 },
    smallPicture: { borderRadius: 100, resizeMode: 'cover', height: undefined, aspectRatio: 1 }
  })
  