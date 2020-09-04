const handleDate = (date)=>{
    let newDate = new Date(date).toLocaleDateString();
    let value = newDate.split("/")
    return {
        day: value[1],
        month: value[0],
        year: value[2]
    }
}
module.exports.handleDate = handleDate