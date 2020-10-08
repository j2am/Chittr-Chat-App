import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, RefreshControl} from 'react-native'
import { API_BASE_URI, API_USER, ARROW_ICON } from '../Constants'
import { Loading, ProfileItem } from '../Components'


export class Followers extends Component {
    constructor (props) {
      super(props)
      this.store = this.props.store
  
      this.state = {
        loading: true,
        followers: []
      }
    }
    componentDidMount() {
        this.getData()
    }
    getData = () => {
      console.log('followers fetch')
      return fetch(API_USER + this.store.id + '/followers',
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
            followers: dataJson
          })
          console.log(dataJson)
        }).catch((error) => { console.log(error) })
    }
  
    render () {
      return (
        <SafeAreaView style={styles.container}>
            
            <FlatList 
            data={this.state.followers}
            refreshControl={
                <RefreshControl
                    refreshing={this.state.loading}
                    onRefresh={()=>{ this.setState({ loading: true }, ()=> { this.getData() })}
                }/>
            }
            ListEmptyComponent={()=>(<View style={{justifyContent:'center',alignItems:'center'}}><Text>Empty!</Text></View> )}   
            renderItem={ ({item})=>
            
                <ProfileItem onPress={()=>this.props.navigation.navigate('ViewProfile',{details:{id: item.user_id,token:this.store.token}})} user_id={item.user_id} given_name={item.given_name} given_name={item.given_name}/>
            }
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
  

  {/* TODO: REmove */}
  {/* /*
                      <View style={{flexDirection:'row', justifyContent:'center',alignItems:'center', elevation:5, backgroundColor:'white',margin: 10, marginHorizontal:60,borderRadius:25,}}>
                          <Image source={{uri:'https://randomuser.me/api/portraits/women/18.jpg'}}
                              style={[styles.smallPicture,{padding:20,margin:5}]}/>
                          <Text style={{flexGrow:1,marginHorizontal:15,fontWeight:'400'}}>Home!</Text>
                          <TouchableOpacity style={styles.buttonContainer}>
                                  <Text style={{}}>My Posts</Text>
                                  <Image style={{alignSelf:'center'}} source={require('../assets/Arrow.png')}/>
                          </TouchableOpacity>
  
                  </View> */}
  
          {/* <View style={{flexDirection:'row', justifyContent:'center',alignItems:'center', elevation:5, backgroundColor:'white',padding:0, marginHorizontal:30,borderRadius:100,}}>
                      <Image source={{uri:'https://randomuser.me/api/portraits/women/18.jpg'}}
                          style={[styles.smallPicture,{padding:20,margin:5}]}/>
                      <Text style={{flexGrow:1,marginHorizontal:15,fontWeight:'400'}}>Home!</Text>
                      <TouchableOpacity style={styles.buttonContainer}>
                                  <Text style={{}}>My Posts</Text>
                                  <Image style={{alignSelf:'center'}} source={require('../assets/Arrow.png')}/>
                          </TouchableOpacity>
  
                  </View> */} 