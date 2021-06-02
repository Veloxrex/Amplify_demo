import  {Auth , API} from "aws-amplify";

let nextToken;
    
async function listUsers(){
  let apiName = 'AdminQueries';
  let path = '/listUsers';
  let myInit = { 
      queryStringParameters: {
        "token": nextToken
      },
      headers: {
        'Content-Type' : 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
      }
  }
  const { NextToken, ...rest } =  await API.get(apiName, path, myInit);
  nextToken = NextToken;
  return rest;
}

async function listGroups(){
    let apiName = 'AdminQueries';
    let path = '/listGroups';
    let myInit = { 
        queryStringParameters: {
          "token": nextToken
        },
        headers: {
          'Content-Type' : 'application/json',
          Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
        }
    }
    const { NextToken, ...rest } =  await API.get(apiName, path, myInit);
    nextToken = NextToken;
    return rest;
}


async function uersInGroups(groupname){
    let apiName = 'AdminQueries';
    let path = '/listUsersInGroup';
    let myInit = { 
        queryStringParameters: {
          "token": nextToken,
          groupname
        },
        headers: {
          'Content-Type' : 'application/json',
          Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
        }
    }
    const { NextToken, ...rest } =  await API.get(apiName, path, myInit);
    nextToken = NextToken;
    return rest;
}

async function addUserToGroup(username,groupname){
    let apiName = 'AdminQueries';
    let path = '/addUserToGroup';
    let myInit = { 
        body: {
          username,
          groupname
        },
        headers: {
          'Content-Type' : 'application/json',
          Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
        }
    }
    return await API.post(apiName, path, myInit);
}

async function removeUserFromGroup(username,groupname){
    let apiName = 'AdminQueries';
    let path = '/removeUserFromGroup';
    let myInit = { 
        body: {
          username,
          groupname
        },
        headers: {
          'Content-Type' : 'application/json',
          Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
        }
    }
    return await API.post(apiName, path, myInit);
}

export  {
    listUsers , listGroups , uersInGroups , addUserToGroup , removeUserFromGroup
}