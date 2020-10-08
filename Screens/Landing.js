import React from 'react'
import { getLoginStore } from './Authentication'
import { Loading } from './Components'

/**
 * component checks if authenticated and routes approperiately
 * @param {*} props
 */
export function Landing (props) {
  getLoginStore().then(store =>
    props.navigation.navigate(store.id ? 'AppRoute' : 'AuthRoute', { store }))
  return (<Loading />)
}
