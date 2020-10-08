import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Tab, Tabs, Toast, Root } from 'native-base'
import { API_USER, API_USER_PHOTO, ARROW_ICON } from '../Constants'

import { getLoginStore } from '../Authentication'
import { Followers } from '../Profile/Followers'
import { Following } from '../Profile/Following'
import { MyPosts } from '../Profile/MyPosts'
import Dash from 'react-native-dash'

/**
 * View a single user profile page, their posts, follower,followings 
 */
export class ViewProfile extends Component {
    constructor (props) {
        super(props)
        const { navigation } = this.props
        this.details = navigation.getParam('details')
        this.state = { 
            user_id: 0,
            given_name: '',
            family_name: '',
            email: '',
            recent_chits:{},
            followButton:'Follow',
            rootFollowing:false
        }
    }
    
    componentDidMount () {
        this.fetchProfile()
        this.isRootUserFollowing()
    }
    
    // checks if the logged in user is following this profile
    isRootUserFollowing = async ()=>  {
        //check if we are following the user
        let rootUser = await getLoginStore()
        console.log(rootUser)

        let response = await fetch(API_USER + rootUser.id+ '/following')
        if(response.ok){
            let dataJson = await response.json()
             let result =dataJson.some(following => following.user_id===this.details.id)
            this.setState({rootFollowing:result})
        }
    }   
    
    fetchProfile = () =>{
        return fetch( API_USER +this.details.id )        //base+ '/user'+'/id')
        .then((response) =>{
            if(response.ok)  
            return response.json()
        }).then((dataJson)=>{
            this.setState({
                user_id: dataJson.user_id,
                given_name: dataJson.given_name,
                family_name: dataJson.family_name,
                email: dataJson.email,
                recent_chits:dataJson.recent_chits,
                loading:false,

            })
            console.log('recent_chits')
            console.log(this.state)
        }).catch((e)=>{console.log(e);})
    }

    /**
     * unfollow we logged in user is following page, vice versa
     */
    toggleFollow = async()=> {
        if(this.state.rootFollowing)
        {
            console.log('unfollowing')

            let response = await fetch(API_USER + this.details.id +'/follow', {
                method:'DELETE',
                headers:{'X-Authorization': this.details.token}
            }).catch(e=>console.log(e))
            if(response.status===200)
                Toast.show({
                    text: "User unfollowed",
                    buttonText: "Okay",
                    duration: 3000
                })
        }else {
            console.log('following')
            let response = await fetch(API_USER + this.details.id +'/follow', {
                method:'POST',
                headers:{'X-Authorization': this.details.token}
            }).catch(e=>console.log(e))
            if(response.status===200)
                Toast.show({
                    text: "User followed",
                    buttonText: "Okay",
                    duration: 3000
                })
        }
        this.isRootUserFollowing()
    }
        

  render () {
    console.log(this.state)

    return (
      <Root>
        <View style={{backgroundColor:'white'}}>
          {/* <TopBar/> */}
          <TouchableOpacity 
          onPress={()=>this.props.navigation.pop()}         
          style={styles.headerButton}>
            <Text style={{ padding: 8, fontWeight: '700' }}>back</Text>
          </TouchableOpacity>

          <View style={{ justifyContent: 'center' }}>
            <Image
              source={{ uri: API_USER_PHOTO(this.details.id) + '?'+Date.now().toString() }}
              style={styles.picture}
            />
            <Text style={{ fontSize: 36, margin: 5, fontWeight: '700', textAlign: 'center' }}>{this.state.given_name} {this.state.family_name}</Text>
            <Dash dashGap={18} dashThickness={1.5} dashLength={18} dashColor='rgba(128,128,128,0.47)' style={{ marginHorizontal: 10, height: 1 }} />
            <TouchableOpacity 
            onPress={this.toggleFollow}      
            style={styles.buttonContainer}>
                <Text style={styles.buttonText}>{this.state.rootFollowing? "Unfollow":"Follow"}</Text>
                <Image style={{ alignSelf: 'center' }} source={ARROW_ICON} />
            </TouchableOpacity>
            <Dash dashGap={18} dashThickness={1.5} dashLength={18} dashColor='rgba(128,128,128,0.47)' style={{ marginHorizontal: 10, height: 1 }} />

          </View>
        </View>

        <Tabs>
            <Tab activeTextStyle={{ fontWeight: 'bold' }} textStyle={{ fontWeight: '100' }} tabStyle={{ backgroundColor: 'white' }} activeTabStyle={{ backgroundColor: 'white' }} heading='Posts'>
                <MyPosts user_id={this.state.user_id} recent_chits= {this.state.recent_chits}/>
            </Tab>
            <Tab activeTextStyle={{ fontWeight: 'bold' }} textStyle={{ fontWeight: '100' }} tabStyle={{ backgroundColor: 'white' }} activeTabStyle={{ backgroundColor: 'white' }} heading='Followers'>
                <Followers navigation={this.props.navigation} store={this.details} />
            </Tab>
            <Tab activeTextStyle={{ fontWeight: 'bold' }} textStyle={{ fontWeight: '100' }} tabStyle={{ backgroundColor: 'white' }} activeTabStyle={{ backgroundColor: 'white' }} heading='Following'>
                <Following navigation={this.props.navigation} store={this.details} />
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
