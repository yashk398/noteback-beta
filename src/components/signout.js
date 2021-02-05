import React from 'react'

import { Text, Icon, LogOutIcon } from 'evergreen-ui'

export default function SignOut(props) {
    return props.auth.currentUser && (
        <Text color="danger" icon={LogOutIcon} style={{fontFamily:'inherit'}} onClick={()=>props.auth.signOut() }><Icon icon={LogOutIcon} size={12} /> Signout</Text>
    );
}