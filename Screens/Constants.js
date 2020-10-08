/**
 * File contains all the Constants used in the application
 */

export const API_BASE_URI = 'http://10.0.2.2:3333/api/v0.0.5/'
export const API_USER = API_BASE_URI + 'user/'
export const API_CHITS = API_BASE_URI + 'chits/'

export function API_USER_PHOTO (userId) {
  return API_USER + userId + '/photo/'
}
export const ARROW_ICON = require('../assets/arrow.png')
export const DOTS_ICON = require('../assets/dots.png')
export const SEARCH_ICON = require('../assets/search.png')
export const HEARTH_ICON = require('../assets/heart.png')
export const CHITS_ICON = require('../assets/chits.png')
export const LOCATION_ICON = require('../assets/location.png')
export const PHOTO_ICON = require('../assets/photo.png')
export const REMOVE_PHOTO_ICON = require('../assets/remove-photo.png')
export const SEND_ICON = require('../assets/send.png')
export const DRAFT_ICON = require('../assets/draft.png')
export const SAVE_ICON = require('../assets/save.png')
export const DELETE_ICON = require('../assets/delete.png')
