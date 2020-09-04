const initValue = localStorage.getObject('user') || {};

const userReducer = (state = initValue, action) => {
    switch(action.type){
        case "SET_USER":
            let data = localStorage.getObject('user') || {}
            let newData = {
                ...data,
                ...action.payload
            }
            localStorage.setObject('user', newData)
            return newData
        case "LOG_OUT":
            localStorage.clear();
            return {
                ...state,
            }
        default:
            return state
    }
}

export default userReducer;