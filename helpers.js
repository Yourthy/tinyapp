//function gathers email given userid in the user database...
const getEmailByUserID = (userID, userDatabase)=>{
  if(userDatabase[userID]){
    return userDatabase[userID].email;
  }
  return "";
};

//function gaters user given email in the user database...
const getUserByEmail = (email, database)=>{
    for (let user in database){
      if(database[user].email === email){
        return database[user].id;
      }
    }return null;
  };

  //function used to check if url belongs to user...
  const doesUrlBelongToUser = (user, database, shortURL)=>{
    for(let short in database){
      if(database[short]["userID"] === user && short === shortURL){
        return true;
      }
    }
    return false;  i
  };
 
  //function generates a random string of numbers/letters (6 char in length)
  function generateRandomString(){
    let r = Math.random().toString(36).substring(7);
    return "random", r;
  };


  module.exports = {getUserByEmail, generateRandomString, getEmailByUserID, doesUrlBelongToUser};