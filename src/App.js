import React, { useCallback, useEffect, useState } from "react";
import Amplify , {Auth}  from "aws-amplify";
import {AmplifyAuthenticator, AmplifySignOut} from "@aws-amplify/ui-react";
import awsconfig from "./aws-exports";
import 'antd/dist/antd.css';
import { Layout , Table , Dropdown , Menu , Button} from 'antd';
import "./App.css"
import  * as services from "./service"
import moment from "moment"


const { Header, Content } = Layout;
Amplify.configure(awsconfig);

function App ()  {
    const [users , setUsers] = useState([])
    const [groups , setGroups] = useState([])
    const [groupUser , setGroupUser] = useState([])
    const [groupSelected , setGroupSelected] = useState()
    const [currentSession , setCurrentSession] = useState({})
    useEffect(() => {
      const getUsers = services.listUsers();
      const getGroups = services.listGroups()

      Promise.all([getUsers , getGroups]).then((values) => {
        // console.log(values );
        setUsers(values && values[0].Users)
        setGroups(values && values[1].Groups)
      });
    }, [])


    const getUserGroup = useCallback((groupname)  => {
      const getGroupUser = services.uersInGroups(groupname ? groupname : groups[0].GroupName)
      Promise.all([getGroupUser]).then((values) => {
        setGroupUser(values && values[0].Users)
      });
    }, [groups])

    useEffect(() => {
      if(groups && groups.length !== 0 ){
        getUserGroup()
      }
    }, [groups, getUserGroup])

    useEffect(() => {
      Auth.currentSession()
  .then(data => setCurrentSession(data.accessToken.payload))
    }, [])


  
const handleMenuClick = (e, type , record) => {
  
  if(type === "selection"){
    setGroupSelected(e.key)
    getUserGroup(e.key)
  }else{
    services.addUserToGroup(record.Username,e.key).then(value => value.message && getUserGroup(e.key))
  }
  
}

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const ActionMenu = ({type , record})  => (
  <Menu onClick={(e) => handleMenuClick(e, type , record)}>
    {groups.map((item) => {
        return (
          <Menu.Item key={item.GroupName}>Add to {item.GroupName} group</Menu.Item>
        )
    })}
  </Menu>
);



  const columns = (type) =>  [
    {
      title: 'Username',
      dataIndex: 'Username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'Attributes',
      render: Attributes => {
        return (
          <span>{Attributes[4].Value}</span>
        )
      },
    },
    {
      title: 'Account status',
      dataIndex: 'UserStatus',
      key: 'userStatus',
    },
    {
      title: "Create",
      dataIndex: 'UserCreateDate',
      render: UserCreateDate => {
        return <span>{moment(UserCreateDate).format("MM-DD-YYYY | hh:mm")}</span>
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        currentSession.username === record.Username ? null : type === 'userlist' ? 
        <div>
          <Dropdown.Button overlay={ActionMenu({record})}>Add group</Dropdown.Button>
        </div> :  <Button type="primary" onClick={() => {
          services.removeUserFromGroup(record.Username,groupSelected ? groupSelected :  groups[0].GroupName).then(value =>
            value.message &&  
            getUserGroup(groupSelected ? groupSelected :  groups[0].GroupName)
          )
         
        }}>Remove</Button>
      ),
    },
  ];

  const TableUserGroup = () => {
    return <Table dataSource={groupUser} columns={columns()} /> 
  }

   return (
    <AmplifyAuthenticator>
       <Layout className="layout">
        <Header>
            <AmplifySignOut/>
        </Header>
        <Content style={{ padding: '24px' , height: '100%' , overflowY: "scroll" }}>
          <h2>List User</h2>
          <Table dataSource={users} columns={columns("userlist")} />
          <hr></hr>
          
          <br></br>
          <div style={{marginBottom: "8px"}}>
          {groups && groups.length !== 0  && 
          <Dropdown.Button overlay={ActionMenu({type :'selection'})}>{capitalizeFirstLetter(groupSelected ? groupSelected :  groups[0].GroupName)} Group Table</Dropdown.Button>}
          </div>
          
          {groupUser && groupUser.length !== 0 && <TableUserGroup/>} 
      
         
        </Content>
      </Layout>
    </AmplifyAuthenticator>
  )
};

export default App