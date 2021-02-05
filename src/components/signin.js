import React from 'react'
import firebase from 'firebase/app'
import { Button, LogInIcon, Pane, Heading, Text } from 'evergreen-ui'

export default function SignIn(props) {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        props.auth.signInWithPopup(provider);
    }
    return (
        <div style={{height:"100%"}}>
            <br></br><br></br><br></br><br></br>    
            <Pane display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center">
                <Heading size={70}>Welcome to Noteback</Heading>
                <Text size = {50}>a cloud based note taking app.</Text>
                <br></br><br></br>
                <Button height={48} iconBefore={LogInIcon} style={{fontFamily:'inherit'}} intent="primary" appearance="primary" onClick={signInWithGoogle}>Sign in with Google</Button>
            </Pane>
        </div>
    )
}