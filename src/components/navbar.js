import React, {useState} from 'react'
import SignOut from './signout'
import firebase from 'firebase/app'
import NoteBook from './notes'
import { Button, Pane, Heading, Avatar, Popover, Position, Menu, EditIcon, PersonIcon, SettingsIcon, AddIcon, PlusIcon, Text } from 'evergreen-ui'
import {Switch as SwitchUI} from 'evergreen-ui'
import { Route, Link, Switch } from 'react-router-dom';

export default function Navbar(props) {
    const auth = props.auth;
    const {uid, photoURL} = auth.currentUser;
    const name = props.auth.currentUser.displayName;
    const prefCol = props.store.collection('preferences').doc(uid);
    var prefs;
    let deletedisable = false;
    let autodelete = false;
    let avatarimage = true;

    async function promiseQueries(){
        prefs = await prefCol.get();
    }
    promiseQueries();

    return (
        <div>
            <Pane display="flex" padding={16} background="overlay">
                <Pane flex={1} alignItems="center" display="flex">
                <Link to="/" style={{textDecoration:'none'}}><Heading size={600} color="#fefefe" style={{fontFamily:'inherit'}}>noteback</Heading></Link>
                </Pane>
                <Pane display="flex" alignItems="center">
                    {/* Below you can see the marginRight property on a Button. */}
                    <Button marginRight={16} style={{fontFamily:'inherit'}} iconBefore={PlusIcon} appearance="minimal"><a href="#addNote" style={{textDecoration:'none', color:"#fefefe"}}>Create a new note</a></Button>
                    <Popover 
                        position={Position.BOTTOM_LEFT}
                        content={
                            <Menu>
                            <Menu.Group >
                                <Menu.Item icon={PersonIcon}><Text style={{fontFamily:'inherit'}}>{name}</Text></Menu.Item>
                                <Menu.Item disabled icon={AddIcon}><Text style={{fontFamily:'inherit'}}>Contribute?</Text></Menu.Item>
                                <Menu.Item disabled icon={EditIcon} style={{fontFamily:'inherit'}}><Text style={{fontFamily:'inherit', color:'inherit', backgroundColor:'inherit'}}>Report an issue</Text></Menu.Item>
                                <Link to="/preferences" style={{textDecoration:'none'}}><Menu.Item disabled secondaryText="⌘R" style={{ fontFamily:'inherit'}} icon={SettingsIcon}>
                                <Text style={{fontFamily:'inherit'}}>Preferences</Text>
                                </Menu.Item></Link>
                            </Menu.Group>
                            <Menu.Divider />
                            <Menu.Group> 
                                <Menu.Item intent="danger">
                                <SignOut auth={props.auth} style={{fontFamily:'inherit'}}/>
                                </Menu.Item>
                            </Menu.Group>
                            </Menu>
                        }
                        >
                        <Avatar
                            src={avatarimage ? photoURL : null}
                            name={name}
                            size={40}
                            cursor="pointer"
                        />
                    </Popover>
                </Pane>
            </Pane>
            <Switch>
                <Route path='/' exact><NoteBook store={props.store} auth={props.auth} delDisable={deletedisable}/></Route>
                <Route path='/preferences' exact><Preferences initialState={{ checked: true }}/></Route>
            </Switch>
            <Pane style={{backgroundColor: "#050505", color:"#fefefe", textAlign: 'center'}}>Created and owned by <a href="https://github.com/yashk398/">Yash Sandeep Kadam</a>.</Pane>
        </div>
    )

    function Preferences(){
        var prefData;
        if(prefs!==undefined){
            deletedisable = prefs.deletedisable;
            autodelete = prefs.autodelete;
            avatarimage = prefs.avatarimage;
            prefData = {
            uid: uid,
            createdAt: prefs.createdAt,
            deletedisable: deletedisable,
            autodelete: autodelete,
            avatarimage: avatarimage
            }  
            console.log(prefs);
        }
        const updatePrefs = async(e) =>{
            if(deleteDisable.checked!==undefined && autoDelete.checked!==undefined && avatarimage!==undefined){
                prefData.deletedisable = deleteDisable.checked;
                prefData.autodelete = autoDelete.checked;;
                prefData.autodelete = avatarImage.checked;
                deletedisable = deleteDisable.checked;
                autodelete = autoDelete.checked;
                avatarimage = avatarImage.checked;
                console.log(prefs.data);
                console.log(avatarimage);
                if(prefs.id===undefined||prefs.id===null){
                    await prefCol.doc(uid).set({
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        uid: uid,
                        deletedisable: deleteDisable.checked,
                        autodelete: autoDelete.checked,
                        avatarimage: avatarImage.checked
                    });
                }
                else{
                    prefData.createdAt = firebase.firestore.FieldValue.serverTimestamp()
                    props.store.collection('preferences').doc(uid).set(prefData);
                }
            }
            
        }

        const [avatarImage, setAvatarImage] = useState(false);
        const [deleteDisable, setDeleteDisable] = useState(false);
        const [autoDelete, setAutoDelete] = useState(false);
        return(
            <div>
                <br></br>
                <Pane margin="auto" alignItems="center" style={{width:'100%'}}>
                    <Heading>PREFERENCES</Heading>
                    <br></br>
                    <table style={{margin:"auto", textAlign:"left"}}>
                        <tbody>
                            <tr>
                                <td>
                                <Text>Delete disabled when not done task </Text>
                                </td>
                                <td>
                                <SwitchUI
                                checked={deleteDisable.checked}
                                onChange={e => setDeleteDisable({ checked: e.target.checked })}
                                height={24}
                                marginLeft={25}
                                />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                <Text>Auto delete when done</Text>
                                </td>
                                <td>
                                <SwitchUI
                                checked={autoDelete.checked}
                                onChange={e => setAutoDelete({ checked: e.target.checked })}
                                height={24}
                                marginLeft={25}
                                />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                <Text>Do not show profile image</Text>
                                </td>
                                <td>
                                <SwitchUI
                                checked={avatarImage.checked}
                                onChange={e => setAvatarImage({ checked: e.target.checked })}
                                height={24}
                                marginLeft={25}
                                />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <br></br>
                    <Button intent="primary" appearance="primary" onClick={updatePrefs}>Save</Button>
                </Pane>
                <Pane style={{textAlign: 'center'}}>Created and owned by <a href="https://github.com/yashk398/">Yash Sandeep Kadam</a>.</Pane>
            </div>
        );
    }
}
