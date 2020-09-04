import {get, post, patch} from '../utils/FetchAPI';

export const getAllCartOfUser = (idUser) => get(`/cart/get-cart-of-user/${idUser}`)
export const searchCartOfUserFollowTime = (query) => get(`/cart/selecttime`, query)
export const createCartDirect = (data) => post(`/cart/giao-truc-tiep`, data)
export const createCartAgencyDelivery = (data) => post(`/cart`, data)
export const updateNoteCartOfUser = (idCart, data) => patch(`/cart/note/${idCart}`, data)
export const updateStatusSuccessCart = (idCart) => patch(`/cart/change-status/${idCart}`);
export const updateStatusFailCart = (idCart) => patch(`/cart/chang-status-fail/${idCart}`);
export const paySalaryUser = (idUser, data) => patch(`/cart/pay-salary/${idUser}`, data);
export const getAllCartFollowUser = (idUser) => get(`/cart/get-cart-follow-user/${idUser}`);
export const getCartofAgency = (idAgency) => get("/cart/get-cart-of-agency/"+idAgency);
export const searchCartOfAgencyFollowTime = (query) => get(`/cart/select-time-cart-agency`, query)




