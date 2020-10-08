import React, { Component } from 'react'
import { View,  StyleSheet,  SafeAreaView, FlatList, Text, RefreshControl } from 'react-native'
import { Post, TopBar,  CustomDash } from '../Components'
import {  API_CHITS, API_USER, } from '../Constants'
import { Compose } from './Compose'

/**
 * Main tab, displays chits
 */
export default class Chits extends Component {
    constructor (props) {
        super(props)
        const { navigation } = this.props
        this.store = navigation.dangerouslyGetParent().dangerouslyGetParent().getParam('store')
        console.log(this.store)
        this.state = {
        loading: true,
        chits:[],

        }
    }
  componentDidMount () {
      this.getData()
  }
  
    getData = ()=>{
        return fetch( API_CHITS +'?count=100',{headers:{ 'X-Authorization':this.store.token    }})        //base+ '/user'+'/id')
        .then((response) =>{
            this.setState({loading:false})
            if(response.ok)  return response.json()
        }).then((dataJson)=>{
            this.setState({
                chits:dataJson
            })
            console.log(dataJson)
        }).catch((e)=>{console.log(e); this.setState({loading:false})})
    }

    onRefresh() {
        this.setState({ loading: true }, ()=> { this.getData() });
    }

    render () {
        return (
        <SafeAreaView style={{flex:1}} >
            <TopBar />            
            <FlatList 
                data={this.state.chits}  
                refreshControl={
                    <RefreshControl
                      refreshing={this.state.loading}
                      onRefresh={()=>this.onRefresh() }
                    />}
                  
                ListEmptyComponent={()=>(<View style={{justifyContent:'center',alignItems:'center'}}><Text>Empty!</Text></View> )}
                ListHeaderComponent={()=> (
                <View>
                    <Compose refresh={this.getData} navigation={this.props.navigation} store={this.store}/>
                    <CustomDash/>
                </View>)}
                renderItem={({item})=>
                (
                    <Post
                        image={API_CHITS + item.chit_id + '/photo'}
                        avatar={API_USER + item.user.user_id+ '/photo'+ '?'+Date.now().toString()}
                        username={item.user.given_name + ' ' + item.user.family_name}
                        timestamp = {item.timestamp}
                        content={item.chit_content}
                        location={item.location}
                    />
                )}
                keyExtractor={item=> item.chit_id.toString()}
            />
        </SafeAreaView>

    //   </View>
    )
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 36,
    color: '#d64a4a',
    fontWeight: 'bold',
    letterSpacing: 1
    // TODO: decide on ...
    // includeFontPadding:false,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 45 / 2
    // borderColor:'rgba(89,173,255,0.68)',
    // borderWidth:2,

    // overflow: 'hidden'

  },
  avatarSmall: {
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
    borderColor: '#fc4850',
    borderWidth: 2
    // overflow: 'hidden'
  },
  cardBase: {
    margin: 10,
    borderRadius: 25,
    backgroundColor: 'white',
    elevation: 5

  },
  username: {
    flexGrow: 1,
    color: 'rgba(197,75,75,0.8)',
    paddingHorizontal: 10,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.8,
    includeFontPadding: false // Fix for ... TODO:

  }

})
