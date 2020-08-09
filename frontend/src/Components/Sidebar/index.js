import React, { Component } from 'react'
import { List, Header, Icon } from 'semantic-ui-react'
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
                        <List.Header as='a'>Semantic-Org/Semantic-UI</List.Header>
                        <List.Description as='a'>Updated 10 mins ago</List.Description>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Icon name='github' size='large' verticalAlign='middle' />
                    <List.Content>
                        <List.Header as='a'>Semantic-Org/Semantic-UI-Docs</List.Header>
                        <List.Description as='a'>Updated 22 mins ago</List.Description>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Icon name='github' size='large' verticalAlign='middle' />
                    <List.Content>
                        <List.Header as='a'>Semantic-Org/Semantic-UI-Meteor</List.Header>
                        <List.Description as='a'>Updated 34 mins ago</List.Description>
                    </List.Content>
                </List.Item>
            </List>

        );
    }
}

export default Sidebar