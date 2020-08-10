import React, { Component } from 'react'
import { List, Header, Icon, Button, Modal } from 'semantic-ui-react'
import NewAPIModal from '../new-api-modal';
class Sidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {showNewAPIModal: false}
        this.addApi = this.addApi.bind(this);
        this.modalSubmit = this.modalSubmit.bind(this);
    }

    addApi(e) {
        e.stopPropagation();
        this.setState({ showNewAPIModal: true });
        
    }

    modalSubmit(data){
        this.setState({ showNewAPIModal: false });
        // this.setState({apiSections: [...this.state.apiSections, data]})
    }

    render() {
        return (
            <div>

                <List divided>
                    <Header as='h2' icon>
                        <Icon name='settings' />
                        Account Settings
    <Header.Subheader>
                            Manage your account settings and set e-mail preferences.
    </Header.Subheader>
                    </Header>
                    <List.Item>
                        <List.Content>
                            <Button primary fluid onClick={this.addApi}><Icon name='add' />Add HTTP Request  </Button>
                        </List.Content>
     
                    </List.Item>
                    <List.Item>
                        <List.Content >
                            <Button primary fluid><Icon name='add' />Add Group</Button>
                        </List.Content>
                    </List.Item>
                </List>
                <Modal open={this.state.showNewAPIModal} onClose={() => this.setState({showNewAPIModal: false})}>
                    <Modal.Content>
                        <NewAPIModal onModalSubmit={this.modalSubmit} />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='red' onClick={() => this.setState({showNewAPIModal: false})}>
                        <Icon name='remove' /> Cancel
                        </Button>
                        <Button color='green' onClick={() => this.setState({showNewAPIModal: false})}>
                        <Icon name='checkmark' /> Submit
                        </Button>
                    </Modal.Actions>
                </Modal>
            </div>

        );
    }
}

export default Sidebar