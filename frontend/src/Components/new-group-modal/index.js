import React, { Component } from 'react'
import { Form, Button, Icon, Divider } from 'semantic-ui-react'


class NewGroupModal extends Component {

    constructor(props) {
        super(props);
        this.state = { groupName: '' }

    }

    removeModal = () => {
        this.props.setGroupModal(null, false);
    }

    submitModal = ()  => {
        this.removeModal;
        this.props.onNewGroupModalSubmit(this.state.groupName);
    }

   


    render() {
        return (
            <Form onSubmit={this.submitModal}>
                <Form.Input
                    label="Group Name"
                    placeholder='Group name'
                    onChange={(e) => this.setState({ groupName: e.target.value })}
                />
                <Divider/>
                <div style ={{float:'right', padding:'20px'}}>
                <Button color='red' onClick={this.removeModal}>
                    <Icon name='remove' /> Cancel
                </Button>
                <Button color='green' type='submit'>
                    <Icon name='checkmark' /> Submit
                </Button>
                </div>
            </Form>

        );
    }
}

export default NewGroupModal