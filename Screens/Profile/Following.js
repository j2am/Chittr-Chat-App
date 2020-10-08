import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, RefreshControl} from 'react-native'
import { API_BASE_URI, API_USER, ARROW_ICON, API_USER_PHOTO } from '../Constants'
import { Loading, ProfileItem } from '../Components'
import { Toast } from 'native-base'


export class Following extends Component {
    constructor (props) {
      super(props)
      this.store = this.props.store
  
      this.state = {
        loading: false,
        followings: []
      }
    }
    componentDidMount () {
        this.getData()
    }
    
  
    getData = () =>{
      return fetch(API_USER + this.store.id + '/following',
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          }
        })
        .then((response) => {if(response.ok) return response.json()})
        .then((dataJson) => {
            this.setState({
                loading: false,
                followings: dataJson
            })
            console.log(dataJson)
        }).catch((error) => { console.log(error) })
    }

    unfollow = (idToUnfollow) => {
        console.log('unfollowing')

        fetch(API_USER + idToUnfollow +'/follow', {
            method:'DELETE',
            headers:{'X-Authorization': this.store.token}
        }).then( (response) =>{
        if(response.status===200)
            Toast.show({
                text: "User unfollowed",
                buttonText: "Okay",
                duration: 3000
            })   
            this.getData()
        }).catch(e=>console.log(e)) }

    render () {
        return (
        <SafeAreaView style={styles.container}>
            <FlatList 
                data={this.state.followings}
                refreshControl={
                    <RefreshControl
                      refreshing={this.state.loading}
                      onRefresh={()=>{ this.setState({ loading: true }, ()=> { this.getData() })}
                    }/>
                }
                ListEmptyComponent={()=>(<View style={{justifyContent:'center',alignItems:'center'}}><Text>Empty!</Text></View> )}
                renderItem={({item})=>  (
                    <ProfileItem onPress={()=>this.props.navigation.navigate('ViewProfile',{details:{id: item.user_id,token:this.store.token}})} user_id={item.user_id} given_name={item.given_name} family_name={item.family_name}/> 
                )}
                keyExtractor={item=> item.user_id.toString()}
            />
            {this.state.loading? (<Loading />):(null)}
        </SafeAreaView>)
    }
}
const styles = StyleSheet.create({
    container: {flex: 1,},
    buttonContainer: { flexDirection: 'row', padding: 10, marginHorizontal: 10 },
    smallPicture: { borderRadius: 100, resizeMode: 'cover', height: undefined, aspectRatio: 1 }
})
  
