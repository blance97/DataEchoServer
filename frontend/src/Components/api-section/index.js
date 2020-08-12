import React, { Component } from 'react'
import { Input, Button, Accordion, Icon, TextArea, Message, Table, Form,Label, Divider, Segment } from 'semantic-ui-react'
import HTTPMethods from '../../static/data/HTTPMethods'
import JSONPretty from 'react-json-pretty';

class ApiSection extends Component {

    constructor(props) {
        super(props);
        this.state = { accordionOpen : false, saved: true, ...this.props.endpointDetails}
        this.updateLabel = this.updateLabel.bind(this);
        this.toggleAccordion = this.toggleAccordion.bind(this);
        this.updateJSONBox = this.updateJSONBox.bind(this)
    }
    
    componentDidMount(){
        this.setState({ResponseBody: this.state.ResponseBody})
    }
    toggleAccordion() {
        this.setState({ accordionOpen: !this.state.accordionOpen})
    }

    updateLabel( data) {
        this.setState({ label: data.value,saved:false });
    }

    updateJSONBox(e,data){
        this.setState({ResponseBody:data.value, saved:false})
    }

    handleDismiss = () => { }

    render() {
        return (
            <div style={{marginBottom: '20px'}} >
                <Message
                    onDismiss={this.handleDismiss}
                    color={HTTPMethods.HTTPMethodColorsSection[this.state.HTTPMethod]} >
                    <Input onChange={this.updateLabel}
                        value={this.state.Endpoint}
                        onChange={event => { this.setState({ query: event.target.value }) }}
                    />
                    <span style={{ backgroundColor: HTTPMethods.HTTPMethodColors[this.state.HTTPMethod], color: 'white', padding: '7px', marginRight: '10px' }}>{this.state.HTTPMethod}</span>
                    <Message
                            warning
                            header='Settings Not Saved'
                            content='Click the Save Button'
                            icon='warning sign'
                            hidden={this.state.saved}
                            />
                    {(this.state.Desc && this.state.Desc.length > 0) ? <Segment style={{color: 'grey'}}>{this.state.Desc}</Segment>: null}
                    <Accordion styled>
                    <Accordion.Title active={this.state.accordionOpen} onClick={this.toggleAccordion}>
                        < Icon name='dropdown' />
                            More
                        </Accordion.Title>
                        <Accordion.Content active={this.state.accordionOpen}>
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
                            <h3>Response Body <span style={{ backgroundColor:'grey', color: "white", padding: '3px' }}>{this.state.ResponseBodyType}</span></h3>
                            <Form.Group>
                                <TextArea style={{width: '50%', marginTop:'15px'}} placeholder='JSON Response...' value={this.state.ResponseBody} onChange={this.updateJSONBox} />
                                <JSONPretty style={{width: '50%'}} data={this.state.ResponseBody}></JSONPretty>
                            </Form.Group>
                            </Form>
                        </Accordion.Content>
                    </Accordion>
                    <div style={{paddingTop: '20px'}}>
                    <Button>Cancel</Button>
                    <Button primary onClick={() => this.props.onSave( this.state)}>Save</Button>
                    </div>
                </Message>

            </div>
        );
    }
}

export default ApiSection