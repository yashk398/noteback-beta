import React, { useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { Pane, Button, TextInput, Dialog, Text, Heading, TrashIcon, TickIcon, PlusIcon, Textarea } from 'evergreen-ui'

export default function NoteBook(props) {
    const firestore = props.store;
    const noteRef = firestore.collection('notes'); 
    const auth = props.auth;
    const {uid, photoURL} = auth.currentUser;
    const query = noteRef.where("uid", "==", uid);
    const [notes] = useCollectionData(query, {idField: 'id'});
    const [titleValue, setTitleValue] = useState('');
    const [formValue, setFormValue] = useState('');

    const sendNote = async(e) => {
        e.preventDefault();
        if(formValue!=='' && titleValue!==''){
            await noteRef.add({
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                note: formValue,
                title: titleValue,
                status: false,
                photoURL: photoURL,
                uid: uid
            });
        }
        else{
            alert("Blank fields not allowed");
        }
        setFormValue('');
        setTitleValue('');
    }

    return (
        <div style={{ margin:"auto", justifyContent:"center", alignItems:"center"}}>
            <Pane width="80%" clearfix style={{margin:"auto", justifyContent:"center", alignItems:"center"}}>
                <Pane style={{margin:"auto", justifyContent:"center", alignItems:"center"}} >
                    {notes && notes.map(note => <Note key={note.id} text={note}/>)}
                </Pane>
                
            </Pane>
            <br></br>
            <center>
                <Pane id="addNote" width="80%" textAlign="center" alignItems="center" style={{backgroundColor:"#f1f1f1"}}>
                    <form onSubmit={sendNote}>
                        <br></br><br></br>
                        <Heading>ADD A NOTE</Heading><br></br>
                        <TextInput width="80%" type="text" name="text-input" placeholder="Enter a note Title" style={{fontFamily:'inherit'}} autoComplete="off" value={titleValue} onChange={(e)=>setTitleValue(e.target.value)}/><br></br>
                        <Textarea width="80%" type="text" name="text-input" placeholder="Description (Optional)" style={{fontFamily:'inherit'}} autoComplete="off" value={formValue} onChange={(e)=>setFormValue(e.target.value)}/><br></br><br></br>
                        <Button marginRight={16} style={{fontFamily:'inherit'}} appearance="primary" intent="success" type='submit'>Create a new note</Button>
                        <Button marginRight={16} appearance="primary" style={{fontFamily:'inherit'}} type='reset'>Clear</Button><br></br><br></br>
                    </form>
                </Pane>
            </center>
        </div>
    );

    function Note(props){
        const { id, uid, title, note, createdAt, status } = props.text;
        let timestamp;
        if(createdAt!==null){
            timestamp = createdAt.toDate(createdAt).toString();
        }
        const noteClass = uid === auth.currentUser.uid ? 'sent' : 'recieved';
        const deleteNote = async(e) =>{
            console.log(title," was removed from firestore");
            await firestore.collection('notes').doc(props.text.id).delete();
        }

        var noteData = {
            id : id,
            uid : uid,
            createdAt: createdAt,
            photoURL: photoURL,
            title: title,
            note: note,
            status: status
        }      

        const taskDone = async(e) =>{
            if(noteData.status===false){
                noteData.status = true;
            }
            else{
                noteData.status = false;
            }
            firestore.collection('notes').doc(id).set(noteData);
        }

        const [state, setState] = useState(false);

        return(
            <div className={`note ${noteClass}`} initialState={{ isShown: false }}>
                <Dialog
                    isShown={state.isShown}
                    title="Delete note"
                    intent="danger"
                    onCloseComplete={() => setState({ isShown: false })}
                    confirmLabel="Delete Note"
                    onConfirm={deleteNote}
                >
                    Are you sure you want to delete this note with title "{title}"?
                </Dialog>
                <Pane
                    elevation={status?0:3}
                    float="left"
                    width={300}
                    height={400}
                    margin={12}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                    style={{ backgroundColor:status ? '#F0F0F0' : '#FFEECC' }} 
                >
                    <Heading style={{fontFamily:'inherit'}}>{title}</Heading>
                    <br></br>
                    <Text overflowY="auto" style={{fontFamily:'inherit'}}>{note}</Text>
                    <br></br>
                    <Pane>
                        {status ? <Button intent="primary" appearance="minimal" iconBefore={PlusIcon} onClick={taskDone} id="taskDoneChecker" style={{fontFamily:'inherit'}}>Do it over again</Button> : <Button appearance="warning" iconBefore={TickIcon} onClick={taskDone} id="taskDoneChecker" style={{fontFamily:'inherit'}}>Mark done</Button>}
                        <Button disabled={!status&&props.delDisable} intent="danger" iconBefore={TrashIcon} onClick={() => setState({ isShown: true })} style={{fontFamily:'inherit'}}>Delete</Button>
                    </Pane>
                    <hr width="100"></hr>
                    <Text size={300} style={{fontFamily:'inherit'}} color="#CECECE">{timestamp}</Text>
                </Pane>
                
                
                <div></div>
            </div>
        );
    }
}


