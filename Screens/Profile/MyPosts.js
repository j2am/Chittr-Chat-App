import React from 'react'
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { Post } from '../Components'
import { API_CHITS, API_USER } from '../Constants'


/**
 * displays chits
 * @param {*} props 
 */
export function MyPosts (props) {
  console.log(props)
  return (
    <SafeAreaView style={styles.container}>

      <FlatList
        data={props.recent_chits}
        ListEmptyComponent={() => (<View style={{ justifyContent: 'center', alignItems: 'center' }}><Text>Empty!</Text></View>)}
        renderItem={({ item }) =>
          (
            <Post
              image={API_CHITS + item.chit_id + '/photo'}
              avatar={API_USER + props.user_id + '/photo' + '?' + Date.now().toString()}
              username={props.name}
              timestamp={item.timestamp}
              content={item.chit_content}
              location={item.location}
            />
          )}
        keyExtractor={item => item.chit_id.toString()}
      />

    </SafeAreaView>)
}

const styles = StyleSheet.create({
  container: { flex: 1 }

})
