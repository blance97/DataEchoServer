import React, { Component } from 'react'
import { Input, Button, Accordion, Icon, TextArea, Message, Table, Form,Label } from 'semantic-ui-react'
import HTTPMethods from '../data/HTTPMethods.json'
import JSONPretty from 'react-json-pretty';

class ApiSection extends Component {

    constructor(props) {
        super(props);
        console.log(this.props)
        this.state = { query: '', apiLabels: [], accordionOpen: false, responseJSON: "" }
        this.updateLabel = this.updateLabel.bind(this);
        this.toggleAccordion = this.toggleAccordion.bind(this);
        this.updateJSONBox = this.updateJSONBox.bind(this)
    }

    toggleAccordion() {
        this.setState({ accordionOpen: !this.state.accordionOpen})
    }

    updateLabel(event, data) {
        this.setState({ label: data.value });
    }

    updateJSONBox(_, data){
        console.log(data);
        this.setState({responseJSON: data.value})
    }

    handleDismiss = () => { }

    render() {
        return (
            <div >
                <Message
                    onDismiss={this.handleDismiss}
                    color={"blue"} >
                    <Input onChange={this.updateLabel}
                        value={this.state.query}
                        onChange={event => { this.setState({ query: event.target.value }) }}
                    />
                    <span style={{ backgroundColor: HTTPMethods.HTTPMethodColors[this.props.httpMethod], color: 'white', padding: '7px', marginRight: '10px' }}>{this.props.httpMethod}</span>
                    <Accordion styled>
                    <Accordion.Title active={this.state.accordionOpen} onClick={this.toggleAccordion}>
                        < Icon name='dropdown' />
                            More
                        </Accordion.Title>
                        <Accordion.Content active={this.state.accordionOpen}>
                        <Message
                            warning
                            header='Settings Not Saved'
                            content='Click the Save Button'
                            icon='warning sign'
                            />
                            <Form>
                            <h3> 
                                Response Headers
                            </h3>
                            <Table size="small" celled compact>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Key</Table.HeaderCell>
                                    <Table.HeaderCell>Value</Table.HeaderCell>
                                    <Table.HeaderCell></Table.HeaderCell>
                                </Table.Row>
                                </Table.Header>    
                                <Table.Body>
                            <Table.Row>
                                <Table.Cell>
                                    Cell
                                </Table.Cell>
                                <Table.Cell>Cell</Table.Cell>
                                <Table.Cell icon="delete"></Table.Cell>
                            </Table.Row>
                            </Table.Body>
                            </Table>
                            <Button>Add </Button>    
                           
                            <h3>Response Body</h3>
                            <Form.Group widths='equal'>
                                <TextArea placeholder='JSON Response...' onChange={this.updateJSONBox} />
                                <JSONPretty id="json-pretty" data={this.state.responseJSON}></JSONPretty>
                            </Form.Group>
                            <Form.Group>
                            <Button>Cancel</Button>
                            <Button positive>Save</Button>
                            </Form.Group>
                            </Form>
                        </Accordion.Content>
                    </Accordion>
                </Message>

            </div>
        );
    }
}

export default ApiSection