import HTTPMethods from '../../static/data/HTTPMethods'
import React, { Component } from 'react'
import { Form, Button, Dropdown } from 'semantic-ui-react'
class NewAPIModal extends Component {

    constructor(props) {
        super(props);
        this.state = { httpMethod: "GET", description: "" }

        this.selectHTTPMethod = this.selectHTTPMethod.bind(this)
        this.submitModal = this.submitModal.bind(this);
    }

    selectHTTPMethod(e, data) {
        this.setState({ httpMethod: data.text })
    }

    submitModal(e) {
        e.preventDefault();
        this.props.onModalSubmit(this.state);
    }
    options = [
        { key: 'g', text: 'General', value: 'General' },
        { key: 'f', text: 'Female', value: 'female' },
        { key: 'o', text: 'Other', value: 'other' },
    ]

    render() {
        return (
            <Form onSubmit={this.submitModal}>
                <Form.Field>
                    <label>HTTP Method</label>
                    <Dropdown text={this.state.httpMethod}>
                        <Dropdown.Menu>
                            {Object.keys(HTTPMethods.HTTPMethodColors).map((method, i) => {
                                return <Dropdown.Item style={{ backgroundColor: '#e4e6df', color: HTTPMethods.HTTPMethodColors[method] }} onClick={this.selectHTTPMethod} key={i} text={method} />
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Field>

                <Form.Input
                    label="Endpoint"
                    placeholder='/api/*'
                />

                <Form.Field>
                    <label>Description</label>
                    <input value={this.state.description} onChange={event => { this.setState({ description: event.target.value }) }} placeholder='Desciption of endpoint...' />
                </Form.Field>

                <Form.Dropdown
                    label='Group'
                    placeholder='Select Group'
                    options={this.options}
                />
            </Form>

        );
    }
}

export default NewAPIModal