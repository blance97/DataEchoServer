import React, { Component } from 'react'
import { List, Header, Icon, Button, Modal, Divider, Form } from 'semantic-ui-react'
import NewAPIModal from '../../Components/new-api-modal';
import NewGroupModal from '../../Components/new-group-modal';
import { connect } from 'react-redux';
import {fetchTemplateFromApp, addHTTPEndpoint} from '../../store/side-bar/actions';

class Sidebar extends Component {

    constructor(props) {
        super(props);
        this.state = { showNewAPIModal: false, showNewGroupModal: false }

        this.fileInputRef = React.createRef();
    }

    setAPIModal( value) {
        console.log(value);
        this.setState({ showNewAPIModal: value });
    }

    setGroupModal = (e, value) => {
        this.setState({ showNewGroupModal: value });
    }

    modalSubmit = (data) => {
        console.log(data);
        this.props.addEndpoint(data);
    }

    upload = () => {
        console.log(this.props.fetchTemplateFromApp())
        console.log(this.fileInputRef)
        this.props.fetchTemplateFromApp();
        // this.fileInputRef.current.click()
    }

    onNewGroupModalSubmit = (groupName) => {
       console.log(groupName)
        this.props.addGroup(groupName)
    }

 
    render() {

        const groups = this.props.jsonData.groups? Object.keys(this.props.jsonData.groups) : [];
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
                            <Button primary fluid onClick={this.upload} ><Icon name='upload' />Upload  </Button>
                            <input
                                ref={this.fileInputRef}
                                type="file"
                                hidden
                                // onChange={this.fileChange}
                            />
                        </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content>
                            <Button primary fluid><Icon name='download' />Export  </Button>
                        </List.Content>
                    </List.Item>

                </List>
                <Modal open={this.state.showNewAPIModal} onClose={(e) => this.setAPIModal(e, false)}>
                    <Modal.Content>
                        <NewAPIModal groups={groups} modalExit={() => this.setAPIModal(false)} onModalSubmit={this.modalSubmit} />
                    </Modal.Content>
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

function mapStateToProps(state){
    return{
        jsonData: state.sideBar.jsonData
    }
}

function mapDispatchToProps(dispatch){
    return ({
        fetchTemplateFromApp: () => {dispatch(fetchTemplateFromApp())},
        addEndpoint: (HTTPEndpointDetails) => {dispatch(addHTTPEndpoint(HTTPEndpointDetails))}
    })
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
) (Sidebar)