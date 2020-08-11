import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'


class NewGroupModal extends Component {

    constructor(props) {
        super(props);
        this.state = { groupName: ''}

    }

    submitModal() {
        console.log(this.state.groupName);
        // this.setState({ httpMethod: data.text })
    }


    render() {
        return (
            <Form onSubmit={this.submitModal}>
                <Form.Input
                    label="Group Name"
                    placeholder='Group name'
                    onChange={(e) => this.setState({groupName:e.target.value})}
                />

            </Form>

        );
    }
}

export default NewGroupModal