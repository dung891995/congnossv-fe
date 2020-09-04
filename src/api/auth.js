import {get, post} from '../utils/FetchAPI';

export const signup = (data) => post('/signup', data)
export const login = (data) => post('/login', data)
export const logout = (data) => get('/logout', data)
