const getEmailByUserID = (userID, userDatabase)=>{
  if(userDatabase[userID]){
    return userDatabase[userID].email;
  }
  return "";
};
const getUserByEmail = (email, database)=>{
    for (let user in database){
      if(database[user].email === email){
        return database[user].id;
      }
    }return null;
  };
 
  function generateRandomString(){
    let r = Math.random().toString(36).substring(7);
    return "random", r;
  };


  module.exports = {getUserByEmail, generateRandomString, getEmailByUserID};