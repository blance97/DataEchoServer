import HTTPMethods from '../data/HTTPMethods.json'
import React, { Component } from 'react'
import { Form, Button, Dropdown } from 'semantic-ui-react'
class NewAPIModal extends Component {

    constructor(props) {
        super(props);
        this.state = { httpMethod: "GET", description: ""}

        this.selectHTTPMethod = this.selectHTTPMethod.bind(this)
        this.submitModal = this.submitModal.bind(this);
    }
    
    selectHTTPMethod(e, data) {
        this.setState({httpMethod: data.text})
    }

    submitModal(e){
        e.preventDefault();
        this.props.onModalSubmit(this.state);
    }
    
    render() {
        return (
            <Form onSubmit={this.submitModal}>
                <Form.Field>
                    <label>HTTP Method</label>
                    <Dropdown text={this.state.httpMethod}>
                        <Dropdown.Menu>
                        {Object.keys(HTTPMethods.HTTPMethodColors).map((method, i) =>{
                          return  <Dropdown.Item style={{backgroundColor: '#e4e6df', color:HTTPMethods.HTTPMethodColors[method]}} onClick={this.selectHTTPMethod} key={i} text={method}/>
                        })}
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Field>
                <Form.Field>
                    <label>Description</label>
                    <input value={this.state.description} onChange={event => { this.setState({ description: event.target.value }) }} placeholder='Desciption' />
                </Form.Field>
                <Button type='submit'>Submit</Button>
            </Form>

        );
    }
}

export default NewAPIModal