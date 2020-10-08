import React, { Component } from 'react'
import { Text, View, StyleSheet,SafeAreaView,TextInput ,FlatList, TouchableOpacity, Image, ToastAndroid} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { API_CHITS, SEARCH_ICON,LOCATION_ICON,PHOTO_ICON ,SEND_ICON,DELETE_ICON, DRAFT_ICON, SAVE_ICON} from '../Constants'
import { TopBar, DumbTopBar } from '../Components'



export class Drafts extends Component {
    constructor(props) {
        super(props)
        this.store = this.props.navigation.getParam('store')

        this.state = {
             drafts:[{content:'asdfasdf'}] //time content id 
        }
    }
    componentDidMount () {
        this.getData()
    }
    getData =() =>{
        AsyncStorage.getItem('@drafts',(err,result)=>{
            if(err) console.log(err)
            this.setState({drafts:JSON.parse(result)},()=>{
                
            })
        })
    }
    
    save = () => {
            AsyncStorage.setItem('@drafts',JSON.stringify(this.state.drafts));
            ToastAndroid.show("saved",ToastAndroid.SHORT)
    }
    
    remove =(index)=>{
        let copy = this.state.drafts;
        copy.splice(index,1); 
        this.setState({drafts:copy},()=>this.save())
    }


    compose = (index)=>{
        console.log('composing...')
        let data = {
            timestamp: Date.now(),
            chit_content: this.state.drafts[index].content,
            location:  {longitude: this.state.drafts[index].lon, latitude:this.state.drafts[index].lat }
        }
        console.log(data)
        return fetch( API_CHITS, {        //base+ '/loout'
            method: 'POST',
            headers:{ 
                'X-Authorization': this.store.token,                
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body:JSON.stringify(data)
        })
        .then((response) =>{if(response.status==201) return response.json() ;else{ ToastAndroid.show("Error!",ToastAndroid.SHORT)}})
        .then((dataJson)=>{
            if(dataJson.chit_id)
            {
                this.getData()
                ToastAndroid.show("Uploaded!", ToastAndroid.SHORT) 

            }    
            else{
                ToastAndroid.show("Error!",ToastAndroid.SHORT) 
            }

            console.log(dataJson)
        }).catch((e)=>{console.log(e)})
    }



    render() {
        return (
            <View>

            {/* <DumbTopBar title="Drafts" top={0} smallText='Manage drafts' buttonText='Go back' onPress={()=>this.props.navigation.goBack()}/> */}
           
           
           
            <View style={{flexDirection:'row',alignItems:'center'}}>
                <TouchableOpacity 
                onPress={()=>this.props.navigation.navigate('Chits')}         
                style={[styles.headerButton,{alignSelf:'center'}]}>
                    <Text style={{ padding: 8, fontWeight: '700' }}>Go Back</Text>
                </TouchableOpacity>
                <View 
                style={[styles.headerButton,{flexGrow:1}]}>
                    <Text style={{ padding: 10, fontSize:20, fontWeight: '700' }}>Drafts</Text>
                </View>
          </View>
            <SafeAreaView >
            


            <FlatList 
                data={this.state.drafts}
                ListEmptyComponent={()=>(<View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>Empty!</Text></View> )}
                renderItem={({item,index})=>  (
                    
                <View style={[styles.container,{ flexDirection: 'row',margin:10 , justifyContent:"flex-start"}]}>
                    <TextInput
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        maxLength ={141}
                        style={styles.text}
                        placeholder='Post a chit...'
                        onChangeText={
                            value =>{ let copy = this.state.drafts;
                                copy[index].content = value; this.setState({drafts:copy})}}
                        value={item.content}
                    />
                <View style={[styles.container,{flexDirection:'column'}]}>
                    <TouchableOpacity 
                        onPress={()=> this.remove(index)}
                        style={{ margin: 10 }}>
                        <Image source={DELETE_ICON} style={{ margin:5,padding:10 }} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={this.save}
                        style={{ margin: 10 }}>
                        <Image source={SAVE_ICON} style={{ margin:5,padding: 5 }} />
                    </TouchableOpacity>

                     <TouchableOpacity 
                        onPress={()=> this.compose(index)}
                        style={{ margin: 10 }}>
                        <Image source={SEND_ICON} style={{ padding: 15 }} />
                        </TouchableOpacity>
                </View>
            </View>
                    // <ProfileItem onPress={()=>this.props.navigation.navigate('ViewProfile',{details:{id: item.user_id,token:this.store.token}})} user_id={item.user_id} given_name={item.given_name} family_name={item.family_name}/> 
                )}
                keyExtractor={(item,index) => index.toString()}
            />
     
            
            </SafeAreaView>
            </View>




        )
    }
}

const styles = StyleSheet.create({
    headerButton: { alignSelf: 'flex-start', borderRadius: 10, elevation: 10, backgroundColor: 'white', margin: 10 },

    container: { flexDirection: 'row', backgroundColor: 'white', elevation: 10, margin: 8, borderRadius: 30},
    text: { flex: 1, flexWrap: 'wrap-reverse', padding: 10, fontSize:18, paddingHorizontal: 15 }
  })
  