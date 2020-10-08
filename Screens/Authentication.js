import AsyncStorage from '@react-native-community/async-storage'
/**

*/
export async function getLoginStore () {
  try {
    const stores = await AsyncStorage.multiGet(['@id', '@token'])
    if (stores) {
      return { id: stores[0][1], token: stores[1][1] }
    }
  } catch (e) {
    console.log(e)
  }
}

export async function clearAuthenticationStore () {
  try {
    await AsyncStorage.clear()
    return true
  } catch (e) { return false }
}

export async function setLoginStore (id, token) {
  return await AsyncStorage.multiSet([['@id', id.toString()], ['@token', token]])
}
