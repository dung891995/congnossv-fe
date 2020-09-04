import {get, post, destroy, patch} from '../utils/FetchAPI';

export const signup = (data) => post('/sign-up', data)
export const getAllUser = () => get('/users')
export const getInfoUser = (idUser) => get(`/users/${idUser}`)
export const deleteUser = (idUser) => destroy(`/users/${idUser}`)
export const updateUser = (idUser, data) => patch(`/users/${idUser}`, data)