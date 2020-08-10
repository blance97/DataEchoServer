import React, { Component } from 'react'
import { List, Header, Icon, Button } from 'semantic-ui-react'
class Sidebar extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <List divided>
                <Header as='h2' icon>
                    <Icon name='settings' />
    Account Settings
    <Header.Subheader>
                        Manage your account settings and set e-mail preferences.
    </Header.Subheader>
                </Header>
                <List.Item>
                    <List.Icon name='github' size='large' verticalAlign='middle' />
                    <List.Content>
                        <List.Header>Add HTTP Request</List.Header>
                        <Button>Add HTTP Request</Button>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Icon name='github' size='large' verticalAlign='middle' />
                    <List.Content>
                        <List.Header>Add Group</List.Header>
                        <Button>Add Group</Button>
                    </List.Content>
                </List.Item>
            </List>

        );
    }
}

export default Sidebar