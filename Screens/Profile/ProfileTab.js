import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Container, Tab, Tabs, Toast, Root } from 'native-base'
import Dash from 'react-native-dash'
import { API_BASE_URI, API_USER, API_USER_PHOTO, ARROW_ICON } from '../Constants'
import { Loading } from '../Components'
import { Followers } from './Followers'
import { Following } from './Following'
import { clearAuthenticationStore } from '../Authentication'
import { MyPosts } from './MyPosts'
/**
 * Profile tab screen 
 * 
 */

export class Profile extends Component {
    constructor (props) {
        super(props)
        const { navigation } = this.props
        this.store = navigation.dangerouslyGetParent().dangerouslyGetParent().getParam('store')
        this.state = { 
            user_id: 0,
            given_name: '',
            family_name: '',
            email: '',
            recent_chits:[],
            loading:true,
        }
    }

    componentDidMount () {
        this.fetchProfile()
    }
    logoutHandler = ()=>{

        return fetch(API_BASE_URI + 'logout',        //base+ '/loout'
        {
            method: 'POST',
            headers:{ 'X-Authorization': this.store.token },
        })
        .then((response) =>{
            clearAuthenticationStore()
             
            console.log(response)
            if(response.ok && response.status==200)
            {
                Toast.show({
                    text: "Signed Out!",
                    buttonText: "Okay",
                    duration: 1000
                })             
                this.props.navigation.navigate({ routeName: 'Login' })

            }
            else if(response.status==400){
                Toast.show({
                    text: "Error, please try again!",
                    buttonText: "Okay",
                    duration: 3000
                })
            }
        }).catch((e)=>console.log(e))
    }
    fetchProfile = () =>{
        return fetch( API_USER +this.store.id )        //base+ '/user'+'/id')
        .then((response) =>{
            this.setState({loading:false})
            if(response.ok)  return response.json()
        }).then((dataJson)=>{
            this.setState({
                user_id: dataJson.user_id,
                given_name: dataJson.given_name,
                family_name: dataJson.family_name,
                email: dataJson.email,
                recent_chits:dataJson.recent_chits,
                loading:false,

            })
        }).catch((e)=>{console.log(e); this.setState({loading:false})})
    }

  render () {
    return (
      <Root>
        <View style={{backgroundColor:'white'}}>
          {/* <TopBar/> */}
          <TouchableOpacity 
          onPress={this.logoutHandler}         
          style={styles.headerButton}>
            <Text style={{ padding: 8, fontWeight: '700' }}>Log out</Text>
          </TouchableOpacity>

          <View style={{ justifyContent: 'center', }}>
            <Image
              source={{ uri: API_USER_PHOTO(this.store.id) + '?'+Date.now().toString() }}
              style={styles.picture}
            />
            <Text style={{ fontSize: 36, margin: 5, fontWeight: '700', textAlign: 'center' }}>{this.state.given_name} {this.state.family_name}</Text>
            <Dash dashGap={18} dashThickness={1.5} dashLength={18} dashColor='rgba(128,128,128,0.47)' style={{ marginHorizontal: 10, height: 1 }} />
            <TouchableOpacity 
            onPress={()=> this.props.navigation.navigate('MyAccount',
            {   store:this.store,
                details:{
                    given_name: this.state.given_name,
                    family_name: this.state.family_name,
                    email: this.state.email,
                }
                })
            }      
            style={styles.buttonContainer}>
              <Text style={styles.buttonText}>My Account</Text>
              <Image style={{ alignSelf: 'center' }} source={ARROW_ICON} />
            </TouchableOpacity>
            <Dash dashGap={18} dashThickness={1.5} dashLength={18} dashColor='rgba(128,128,128,0.47)' style={{ marginHorizontal: 10, height: 1 }} />
          </View>
        </View>

        <Tabs>
            <Tab activeTextStyle={{ fontWeight: 'bold' }} textStyle={{ fontWeight: '100' }} tabStyle={{ backgroundColor: 'white' }} activeTabStyle={{ backgroundColor: 'white' }} heading='Posts'>
            <MyPosts name={this.state.given_name + ' '+ this.state.family_name } user_id={this.state.user_id} recent_chits={this.state.recent_chits}/>
            </Tab>
            <Tab activeTextStyle={{ fontWeight: 'bold' }} textStyle={{ fontWeight: '100' }} tabStyle={{ backgroundColor: 'white' }} activeTabStyle={{ backgroundColor: 'white' }} heading='Followers'>
                <Followers navigation={this.props.navigation} store={this.store} />
            </Tab>
            <Tab activeTextStyle={{ fontWeight: 'bold' }} textStyle={{ fontWeight: '100' }} tabStyle={{ backgroundColor: 'white' }} activeTabStyle={{ backgroundColor: 'white' }} heading='Following'>
                <Following  navigation={this.props.navigation} store={this.store} />
            </Tab> 
        </Tabs>
      </Root>
    )
  }
}

const styles = StyleSheet.create({
    headerButton: { alignSelf: 'flex-end', borderRadius: 10, elevation: 10, backgroundColor: 'white', margin: 10 },
  buttonContainer: { flexDirection: 'row', padding: 10, marginHorizontal: 10 },
  buttonText: { flexGrow: 1, fontSize: 20, fontFamily: '400' },
  picture: { padding: 65, borderWidth: 3, borderColor: 'rgba(255,0,0,0.4)', borderRadius: 100, alignSelf: 'center', resizeMode: 'cover', height: undefined, aspectRatio: 1 },
  smallPicture: { borderRadius: 100, resizeMode: 'cover', height: undefined, aspectRatio: 1 }
})
