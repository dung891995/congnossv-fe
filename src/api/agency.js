import {get, post, destroy, patch} from '../utils/FetchAPI';

export const createAgency = (data) => post("/agency", data);
export const getAllAgency = () => get("/agency");
export const getDetailAgency = (idAgency) => get("/agency/"+idAgency);
export const updateAgency = (idAgency, body) => patch("/agency/"+idAgency, body);
export const payCredit = (idAgency) => patch("/agency/pay-credit/"+idAgency);
export const payDebit = (idAgency) => patch("/agency/pay-debit/"+idAgency);
export const deleteAgency = (idAgency) => destroy(`/agency/${idAgency}`);