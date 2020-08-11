import React, { Component } from 'react'
import { Input, Button, Accordion, Icon, TextArea, Message, Table, Form,Label } from 'semantic-ui-react'
import HTTPMethods from '../../static/data/HTTPMethods'
import JSONPretty from 'react-json-pretty';

class ApiSection extends Component {

    constructor(props) {
        super(props);
        this.state = { query: '', apiLabels: [], accordionOpen: false, responseJSON: "" }

        this.updateJSONBox(this.props.endpointDetails.ResponseBody)
        this.updateLabel = this.updateLabel.bind(this);
        this.toggleAccordion = this.toggleAccordion.bind(this);
        this.updateJSONBox = this.updateJSONBox.bind(this)
    }

    toggleAccordion() {
        this.setState({ accordionOpen: !this.state.accordionOpen})
    }

    updateLabel( data) {
        this.setState({ label: data.value });
    }

    updateJSONBox(data){
        console.log(data);
        this.setState({responseJSON: data})
    }

    handleDismiss = () => { }

    render() {

        const {Desc, Endpoint, HTTPMethod, ResponseBody, ResponseHeader} = this.props.endpointDetails;
        return (
            <div style={{marginBottom: '20px'}} >
                <Message
                    onDismiss={this.handleDismiss}
                    color={HTTPMethods.HTTPMethodColorsSection[HTTPMethod]} >
                    <Input onChange={this.updateLabel}
                        value={Endpoint}
                        onChange={event => { this.setState({ query: event.target.value }) }}
                    />
                    <span style={{ backgroundColor: HTTPMethods.HTTPMethodColors[HTTPMethod], color: 'white', padding: '7px', marginRight: '10px' }}>{HTTPMethod}</span>
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
                                    <Input fluid/>
                                </Table.Cell>
                                <Table.Cell><Input fluid/></Table.Cell>
                                <Table.Cell icon="delete"></Table.Cell>
                            </Table.Row>
                            </Table.Body>
                            </Table>
                            <Button>Add </Button>    
                           
                            <h3>Response Body</h3>
                            <Form.Group widths='equal'>
                                <TextArea placeholder='JSON Response...' value={JSON.stringify(ResponseBody)} onChange={this.updateJSONBox} />
                                <JSONPretty id="json-pretty" data={ResponseBody}></JSONPretty>
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