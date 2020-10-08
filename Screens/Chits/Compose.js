import React, { Component } from 'react'
import { Text, View, TextInput, TouchableOpacity, Image, StyleSheet, Alert, PermissionsAndroid, ToastAndroid, AsyncStorage } from 'react-native'
import { API_CHITS, SEARCH_ICON,LOCATION_ICON,PHOTO_ICON ,SEND_ICON,REMOVE_PHOTO_ICON, DRAFT_ICON, SAVE_ICON} from '../Constants'

import Geolocation from 'react-native-geolocation-service';
import ImagePicker from 'react-native-image-picker';

const imagePickerConfig = {
    title: 'Select Image',
    mediaType:'photo',
    quality:1,
  
  };

export class Compose extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chit_id:0,
            imageBase64:'',
            imageUri:'',
            chit_content:'',
            location:undefined,
            hasLocationPermission:false,

        }
        console.log(this.props.store)
    }
    
    async getLocationPermission () { 
        try{ 
            const result = await PermissionsAndroid.request(  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
                if (result == PermissionsAndroid.RESULTS.GRANTED)
                    this.setState({hasLocationPermission:true})
        }
        catch(e){ console.warn(e)    }
    }
    componentDidMount () {
        this.getLocationPermission()
    }
    

    compose = ()=>{
        console.log('composing...')
        let data = {
            timestamp: Date.now(),
            chit_content: this.state.chit_content,
            location: this.state.location? this.state.location : {longitude: 0, latitude: 0}
        }
        console.log(data)
        return fetch( API_CHITS, {        //base+ '/loout'
            method: 'POST',
            headers:{ 
                'X-Authorization': this.props.store.token,                
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body:JSON.stringify(data)
        })
        .then((response) =>{if(response.status==201) return response.json() ;else{ ToastAndroid.show("Error!",ToastAndroid.SHORT)}})
        .then((dataJson)=>{
            if(dataJson.chit_id)
            {
                if(this.state.imageBase64!=='')
                {
                    console.log(dataJson)
                    //upload image if there is one
                    this.composeImage(dataJson.chit_id)
                }
                
                this.props.refresh()
                ToastAndroid.show("Uploaded!", ToastAndroid.SHORT) 
            }    
            else{
                ToastAndroid.show("Error!",ToastAndroid.SHORT) 
            }

            console.log(dataJson)
        }).catch((e)=>{console.log(e)})
    }

    
    composeImage = async (id)=> {
        let response = await fetch(API_CHITS + id + '/photo',
        {   
            method:"POST",
            headers: {
                'X-Authorization':this.props.store.token,
                'Content-Type': 'image/jpeg',
            }, 
            body:{'base_64':this.state.base_64, 'uri':this.state.imageUri}
        }) 

        if(response.status!==201)
            ToastAndroid.show("Error posting!",ToastAndroid.SHORT) 
        
        return response.status 
    }

    locationHandler = () => {
        if(this.state.location){
            this.setState({location:undefined})
        }else if (this.state.hasLocationPermission){
            Geolocation.getCurrentPosition(
                (pos) => {
                    this.setState({location:{longitude: pos.coords.longitude, latitude: pos.coords.latitude} });
                    ToastAndroid.show("Location tagged ",ToastAndroid.SHORT)
                    },
                (err) => { Alert.alert(err.message);},
                { enableHighAccuracy:true,timeout: 15000, maximumAge: 10000 }
            )
            console.log(this.state)
        }
    }

    imageToggleHandler = () => {
        if(this.state.imageBase64 ==='') {
            ImagePicker.showImagePicker(imagePickerConfig, (imageResponse) => {          
                if (imageResponse.didCancel) {
                    console.log('User cancelled image picker');
                } else if (imageResponse.error) {
                    console.log('ImagePicker Error: ', imageResponse.error);
                } else {
                    console.log(imageResponse.uri)
                    this.setState({imageBase64:imageResponse.data,imageUri:imageResponse.uri })
                    
                }
            })
        } 
        //Toggle
        else  {
            this.setState({imageBase64:''})
        }
    } 
    saveDraft = () =>{
        let data= []
        AsyncStorage.getItem('@drafts',(err,result)=>{
            if(err) console.log(err)
            let drafts = data.concat(JSON.parse(result))
            drafts.push({time:Date.now().toString(),content:this.state.chit_content,lon:this.state.location?this.state.location.longitude:0,lat:this.state.location?this.state.location.latitude:0})
            AsyncStorage.setItem('@drafts',JSON.stringify(drafts));
            ToastAndroid.show("saved",ToastAndroid.SHORT)
        })
    }


    render () {
        return (
        <View>
            <View style={{ flexDirection: 'row' }}>
                <View style={[styles.container, { flexGrow: 1 }]}>
                    <TextInput
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        maxLength ={141}
                        style={styles.text}
                        placeholder='Post a chit...'
                        onChangeText={chit_content => this.setState({ chit_content })}
                        value={this.state.chit_content}
                    />
                </View>
                <View style={[styles.container,{flexDirection:'column'}]}>
                    <TouchableOpacity 
                    onPress={this.locationHandler}
                    style={this.state.location? {margin:10,tintColor:'#ff0000'}:{ margin: 10 }}>
                        <Image source={LOCATION_ICON} style={this.state.location?{tintColor:'#ff0000', margin:5,padding:10 }:{ margin:5,padding:10 }} />
                    </TouchableOpacity>

                    {this.state.imageBase64===''?
                    (
                        <TouchableOpacity 
                            onPress={this.imageToggleHandler}
                            style={{ margin: 10 }}>
                            <Image source={PHOTO_ICON} style={{ margin:5,padding: 10 }} />
                        </TouchableOpacity>)
                    :(  
                        <TouchableOpacity 
                            onPress={this.imageToggleHandler}
                            style={{ margin: 10 }}>
                            
                            <Image source={REMOVE_PHOTO_ICON} style={{ margin:5,padding: 10 }} />
                        </TouchableOpacity>
                    )}

                        {/* TODO: Drafat button */}
                    <TouchableOpacity 
                        onPress={()=> this.props.navigation.navigate('Drafts',{store:this.props.store})}
                        style={{ margin: 10 }}>
                        <Image source={DRAFT_ICON} style={{ margin:5,padding: 10 }} />
                    </TouchableOpacity>
                </View>
               
            </View> 
             
            
            {this.state.location!==undefined || this.state.imageBase64!=='' || this.state.chit_content!=='' ? 
                (<View>
                    <View style={{flexDirection:'row', flex:1, justifyContent:'center'} }>
                        <View style={styles.container}>
                            <TouchableOpacity 
                            onPress={this.saveDraft}
                            style={{ margin: 10 }}>
                            <Image source={SAVE_ICON} style={{ margin:5,padding: 5 }} />
                            </TouchableOpacity>

                        </View>
                        <View style={[styles.container,]}>
                            <TouchableOpacity 
                                onPress={this.compose}
                                style={{ flexDirection:'row',alignItems:'center',margin: 10 }}>
                                <Text style={{fontSize:18,marginHorizontal:10,fontWeight:'600'}}>Compose</Text>
                                <Image source={SEND_ICON} style={{ padding: 15 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                ):(null)
            }
            </View>
      )
    }
}
const styles = StyleSheet.create({
    container: { flexDirection: 'row', backgroundColor: 'white', elevation: 10, margin: 8, borderRadius: 30},
    text: { flex: 1, flexWrap: 'wrap-reverse', padding: 10, fontSize:18, paddingHorizontal: 15 }
  })
  