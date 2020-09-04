import {get, patch} from './../utils/FetchAPI';

export const getProfile = () => get(`/users/profile`)