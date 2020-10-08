import React, { Component } from 'react'
import { Text, View, TextInput, StyleSheet, Image ,TouchableOpacity} from 'react-native'
import { SEARCH_ICON, API_BASE_URI } from '../Constants'
import { CustomDash, Loading, ProfileItem } from '../Components'
import { FlatList } from 'react-native-gesture-handler'

export class Search extends Component {
  constructor (props) {
    super(props)
    const { navigation } = this.props
    this.store = navigation.dangerouslyGetParent().dangerouslyGetParent().getParam('store')
    console.log(this.store)
    this.state = {
      query: '',
      loading:false,
      found:[]
    }
  }

  searchUser = ()=>{
    this.setState({loading:true})
    return fetch(API_BASE_URI + 'search_user?q='+this.state.query)
    .then((response) =>{
        this.setState({loading:false})
        if(response.ok)  return response.json()
    }).then((dataJson)=>{
        this.setState({
            found:dataJson
        })
        console.log(dataJson)
    }).catch((e)=>{console.log(e); this.setState({loading:false})})

  }
  render () {
    return (
        <View style={{ flex: 1 }}>
            <View style={{marginBottom:10}}>
                <View style={{ flexDirection: 'row',}}>
                    {/* Search bar */}
                    <View style={[styles.container, { flexGrow: 1 }]}>
                        <TextInput
                        style={styles.text}
                        placeholder='Search ...'
                        onChangeText={query => this.setState({ query })}
                        value={this.state.query}
                        />
                    </View>
                    {/* Search button */}
                    <TouchableOpacity 
                    onPress={this.searchUser}
                    style={styles.container}>
                    <View style={{ margin: 10 }}>
                        <Image source={SEARCH_ICON} style={{ margin:5,padding: 15 }} />
                    </View>
                    </TouchableOpacity>
                </View>
                <CustomDash/>
                {this.state.loading? (<Loading />):(null)}

            </View>
            {/* Search results */}
            <FlatList 
                data={this.state.found}  
                ListEmptyComponent={()=>(<View style={{justifyContent:'center',alignItems:'center'}}><Text>Empty!</Text></View> )}   
                renderItem={({item})=>(
                    <ProfileItem  onPress={()=>this.props.navigation.navigate('ViewProfile',{details:{id: item.user_id,token:this.store.token}})} user_id={item.user_id} given_name={item.given_name} given_name={item.given_name} />
                )}
                keyExtractor={item=> item.user_id.toString()}
            />

        </View>
    )}
}


const styles = StyleSheet.create({
    buttonText: { flexGrow: 1, fontSize: 20, fontFamily: '400' },
    container: { flexDirection: 'row', backgroundColor: 'white', elevation: 10, margin: 10, borderRadius: 30 },
    text: { flex: 1, flexWrap: 'wrap-reverse', padding: 10, fontSize:20, paddingHorizontal: 15 }
})
