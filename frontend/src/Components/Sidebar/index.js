import React, { Component } from 'react'
import { List, Header, Icon, Button, Modal, Divider } from 'semantic-ui-react'
import NewAPIModal from '../new-api-modal';
import NewGroupModal from '../new-group-modal';
import { ToastContainer, toast } from 'react-toastify';
class Sidebar extends Component {

    constructor(props) {
        super(props);
        this.state = { showNewAPIModal: false, showNewGroupModal: false }
        
        this.onNewGroupModalSubmit = this.onNewGroupModalSubmit.bind(this)
    }

    setAPIModal(e, value) {
        e.stopPropagation();
        this.setState({ showNewAPIModal: value });
    }

    setGroupModal = (e, value) => {
        this.setState({ showNewGroupModal: value });
    }

    modalSubmit = (e,data) => {
        console.log(data);
      
    }

    upload = () => {}

    onNewGroupModalSubmit(groupName) {
       console.log(groupName)
        this.props.addGroup(groupName)
    }

    render() {
        return (
            <div>
                <List divided>
                    <Header as='h2' textAlign="center" icon >
                        <Icon name='settings' />
                        Settings
                        <Header.Subheader>
                            Manage API Settings
                        </Header.Subheader>
                    </Header>
                    <Divider />
                    <Header as='h4' textAlign='center' icon>
                        Add API Commands
                    </Header>

                    <List.Item>
                        <List.Content>
                            <Button primary fluid onClick={(e) => this.setAPIModal(e, true)}><Icon name='add' />Add HTTP Request  </Button>
                        </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content >
                            <Button primary fluid onClick={(e) => this.setGroupModal(e, true)}><Icon name='add' />Add Group</Button>
                        </List.Content>
                    </List.Item>
                    <Divider />
                    <Header as='h4' textAlign='center' icon>
                        Export or Upload Existing API File
                    </Header>
                    <List.Item>
                        <List.Content>
                            <Button primary fluid onClick={this.upload} ><Icon name='upload' />Export  </Button>
                        </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content>
                            <Button primary fluid><Icon name='download' />Import  </Button>
                        </List.Content>
                    </List.Item>

                </List>
                <Modal open={this.state.showNewAPIModal} onClose={(e) => this.setAPIModal(e, false)}>
                    <Modal.Content>
                        <NewAPIModal onModalSubmit={this.modalSubmit} />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='red' onClick={(e) => this.setAPIModal(e, false)}>
                            <Icon name='remove' /> Cancel
                        </Button>
                        <Button color='green' onClick={(e) => this.setAPIModal(e, true)}>
                            <Icon name='checkmark' /> Submit
                        </Button>
                    </Modal.Actions>
                </Modal>

                <Modal open={this.state.showNewGroupModal} onClose={(e) => this.setGroupModal(e, false)}>
                    <Modal.Content>
                        <NewGroupModal setGroupModal={this.setGroupModal} onNewGroupModalSubmit={this.onNewGroupModalSubmit} />
                    </Modal.Content>
                </Modal>
            </div>

        );
    }
}

export default Sidebar