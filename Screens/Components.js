import React, { Component } from 'react'
import { Text, View, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Linking } from 'react-native'
import Dash from 'react-native-dash'
import { DOTS_ICON, HEARTH_ICON, LOCATION_ICON, API_USER_PHOTO, ARROW_ICON } from './Constants'

import TimeAgo from 'react-native-timeago'


/**
 * Reusable components store here
 */


 export function CustomDash () {
  return (<Dash dashGap={18} dashThickness={1.5} dashLength={18} dashColor='rgba(128,128,128,0.47)' style={{ marginHorizontal: 10, paddingTop: 5, height: 1 }} />)
}

export function DumbTopBar (props) {
  return (
    <View>
        <TouchableOpacity onPress={props.onPress} style={{ alignSelf: 'flex-start', borderRadius: 15, elevation: 10, backgroundColor: 'white', margin: 10, paddingHorizontal:10}}>
            <Text style={{ padding: 8, fontWeight: 'bold' }}>{props.buttonText}</Text>
        </TouchableOpacity>
      <Text style={[props.style, { textAlign: 'center', padding: 5,paddingTop:0 ,fontSize: 36, color: '#d64a4a', fontFamily: 'Segoe UI', fontWeight: 'bold' }]}>{props.title}</Text>
  <Text style={{ textAlign: 'center',color: 'grey', includeFontPadding: false, paddingBottom:10,fontSize: 14 }}>{props.smallText}</Text>

      <CustomDash />
    </View>)
}

export function Loading () {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' color='#000000' />
      </View>
    )
  }

export function ProfileItem ({user_id,given_name, family_name,onPress}){
    return(
    <TouchableOpacity 
        onPress={onPress}
        style={styles.itemBase}>
        <Image
        source={{ uri: API_USER_PHOTO(user_id) + '?'+Date.now().toString()}}            
        style={[styles.smallPicture, { padding: 22, margin: 5 }]}/>

        <Text style={{ flex:1, marginHorizontal: 15, fontWeight: 'bold' }}>
            {given_name} 
            <Text style={{fontWeight:'100'}}> {family_name}</Text>
        </Text>
        
        <TouchableOpacity style={styles.buttonContainer}>
            <Image style={{ alignSelf: 'center' }} source={ARROW_ICON} />
        </TouchableOpacity>
        {/* TODO: */}
    {/* <TouchableOpacity onPress={()=>buttonPress(user_id)} style={{ alignSelf: 'flex-start', borderRadius: 15,  backgroundColor: 'lightblue', margin: 10, paddingHorizontal:10}}>
            <Text style={{ padding: 8, fontWeight: 'bold' }}>View</Text>
        </TouchableOpacity> */}
    {/* //     {/* <TouchableOpacity onPress={()=>buttonPress(userId)} style={{ alignSelf: 'flex-start', borderRadius: 15,  backgroundColor: 'lightblue', margin: 10, paddingHorizontal:10}}>
    //         <Text style={{ padding: 8, fontWeight: 'bold' }}>Unfollow</Text>
    //     </TouchableOpacity> */} 
     </TouchableOpacity>

    )
}
export class TopBar extends Component {

  render () {
    return (
      <View>
        <View style={{backgroundColor:'white', fontFamily: 'Segoe UI', justifyContent: 'center', height: 61, flexDirection: 'row' }}>


          {/* This Title and online status */}
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.titleText}>Chittr</Text>
            <Text style={{ color: 'grey', includeFontPadding: false, fontSize: 14 }}>ONLINE</Text>
          </View>

          {/* 3 Dots */}
          <View style={{ borderRadius: 25, padding: 10, marginHorizontal: 10, backgroundColor: 'rgba(248,200,34,0.24)', alignSelf: 'center' }}>
            <Image source={DOTS_ICON} style={{  }} />
          </View>
        </View>
        <Dash dashGap={18} dashThickness={1.5} dashLength={18} dashColor='rgba(128,128,128,0.47)' style={{ marginHorizontal: 10, paddingTop: 5, height: 1 }} />
      </View>
    )
  }
}

export class Post extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             imageStyle:{ width: '95%', borderRadius: 25, alignSelf: 'center', marginVertical: 10, resizeMode: 'cover', height: undefined, aspectRatio: 1 }
        }
    }
    openMap = () =>
    {
        let url = 'geo:'+this.props.location.latitude+','+this.props.location.longitude
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
              Linking.openURL(url);
            }
        }) 
    }
    
  render () {
    return (
      <View style={styles.cardBase}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderContent}>
            {/* User Icon */}
            <Image source={{ uri: this.props.avatar }} style={styles.avatarSmall} />
            {/* Username */}
            <Text style={styles.username}>{this.props.username} </Text>

            {/* Heart Icon */}
             { 
            this.props.location?
                (<TouchableOpacity style={{alignSelf:'center'}}
                onPress={this.openMap}>   
                    <Image source={LOCATION_ICON} style={{ tintColor:'red', marginHorizontal: 10, alignSelf: 'center' }} />
                </TouchableOpacity>):(null)
            }
          </View>
        </View>

        <View>
          <Text style={{ paddingHorizontal: 20, paddingVertical: 15, fontSize: 16 }}>
            {this.props.content}
          </Text>
        </View>

        <View>
            <Image source={{ uri: this.props.image }} style={this.state.imageStyle} onError={()=>this.setState({imageStyle:{}})} />
        </View>
        <View style={{alignSelf:'center'}}>
          <TimeAgo time={new Date(this.props.timestamp)}/>
          </View>
    </View>
    )
  }
}


const styles = StyleSheet.create({
  titleText: {
    fontSize: 36,
    color: '#d64a4a',
    fontWeight: 'bold',
    letterSpacing: 1
  },
  avatar: {
    width: 45,
    height: 45,
    marginHorizontal:10,
    borderRadius: 45 / 2
  },
  buttonContainer: { 
        flexDirection: 'row', 
    padding: 10, 
    marginHorizontal: 10
    },
  smallPicture: { 
      borderRadius: 100, 
      resizeMode: 'cover', 
      height: undefined, 
      aspectRatio: 1 
    },
  avatarSmall: {
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
    borderColor: '#fc4850',
    borderWidth: 1
  },
  itemBase:{
        flexDirection: 'row',
        justifyContent: 'center', 
        alignItems: 'center', 
        elevation: 5, 
        backgroundColor: 'white', 
        marginVertical: 5, 
        marginHorizontal: 20, 
        borderRadius: 100 
    },
  cardBase: {
    margin: 10,
    borderRadius: 25,
    backgroundColor: 'white',
    elevation: 5

  },
  cardHeader:{ 
        height: 40, 
        borderTopLeftRadius: 25, 
        borderTopRightRadius: 25, 
        backgroundColor: 'rgba(248,200,34,0.3)' 
    },
    cardHeaderContent:{ 
        flexDirection: 'row', 
        justifyContent: 'center', 
        margin: 10, 
        alignItems: 'center' 
    },
    username: {
        flexGrow: 1,
        color: 'rgba(197,75,75,0.8)',
        paddingHorizontal: 10,
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.8,
        includeFontPadding: false 
    }

})
