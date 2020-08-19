import React, { Component } from 'react'
import { Input, Button, Accordion, Icon, TextArea, Message, Table, Form,Label, Divider, Segment, Dropdown } from 'semantic-ui-react'
import HTTPMethods from '../../static/data/HTTPMethods'
import JSONPretty from 'react-json-pretty';

class ApiSection extends Component {

    constructor(props) {
        super(props);
        this.state = { accordionOpen : false,originalEndpoint: this.props.endpointDetails.endpoint, saved: true, ...this.props.endpointDetails}
        this.updateEndpointURL = this.updateEndpointURL.bind(this);
        this.toggleAccordion = this.toggleAccordion.bind(this);
        this.updateJSONBox = this.updateJSONBox.bind(this)
    }
    
    componentDidMount(){
        this.setState({responseBody: this.state.responseBody})
        if(this.state.HTTPMethod === ''){
            this.setState({saved:false})
        }
    }
    toggleAccordion() {
        this.setState({ accordionOpen: !this.state.accordionOpen})
    }

    updateEndpointURL( data) {
        this.setState({ label: data.value, originalEndpoint: "",saved:false });
    }

    updateJSONBox(e,data){
        this.setState({responseBody:data.value, saved:false})
    }

    updateHTTPMethod = (e,data) => {
        this.setState({saved: false, HTTPMethod: data.text})

    }

    addResponseHeaderRow = () =>{
        this.setState({responseHeaders: [...this.state.responseHeaders, {}]})
    }

    handleDismiss = () => { }

    render() {
        return (
            <div style={{marginBottom: '20px'}} >
                
                <Message
                    onDismiss={this.handleDismiss}
                    color={HTTPMethods.HTTPMethodColorsSection[this.state.HTTPMethod]} >
                    <Input onChange={this.updateEndpointURL}
                        value={this.state.endpoint}
                        onChange={event => { this.setState({ saved: false, endpoint: event.target.value }) }}
                    />
                    <Dropdown  
                        text = {this.state.HTTPMethod} 
                        button
                        style={{ backgroundColor: HTTPMethods.HTTPMethodColors[this.state.HTTPMethod],  padding: '11px', color: 'white', marginRight: '10px' }}
                    >
                        <Dropdown.Menu>
                        <Dropdown.Header content='Select HTTP Method' />
                            <Dropdown.Divider />
                            {Object.keys(HTTPMethods.HTTPMethodColors).map((HTTPMethod, i) =>{
                                return <Dropdown.Item key = {i} onClick={this.updateHTTPMethod} text={HTTPMethod}/>
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Message
                            warning
                            header='Settings Not Saved'
                            content='Click the Save Button'
                            icon='warning sign'
                            hidden={this.state.saved}
                            />
                    {(this.state.description && this.state.description.length > 0) ? <Segment style={{color: 'grey'}}><b>Description:</b> {this.state.description}</Segment>: null}
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
                            
                                {this.state.responseHeaders.map((v,i) => {
                                    let headerKey = Object.keys(v)[0];
                                    return (
                                    <Table.Row key={i}>
                                        <Table.Cell><Input fluid value={headerKey}/></Table.Cell>
                                        <Table.Cell><Input fluid value={v[headerKey]}/></Table.Cell>
                                        <Table.Cell icon="delete"></Table.Cell>
                                    </Table.Row>)
                                })}
                            
                            </Table.Body>
                            </Table>
                            <Button onClick={this.addResponseHeaderRow}>Add </Button>    
                            <h3>Response Body <span style={{ backgroundColor:'grey', color: "white", padding: '3px' }}>{this.state.responseBodyType}</span></h3>
                            <Form.Group>
                                <TextArea style={{width: '50%', marginTop:'15px'}} placeholder='JSON Response...' value={String(this.state.responseBody)} onChange={this.updateJSONBox} />
                                <JSONPretty style={{width: '50%'}} data={this.state.responseBody}></JSONPretty>
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