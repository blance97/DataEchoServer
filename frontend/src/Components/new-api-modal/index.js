import HTTPMethods from '../../static/data/HTTPMethods'
import React, { Component } from 'react'
import { Form, Button, Dropdown,Icon, Input, Table, TextArea } from 'semantic-ui-react'
import JSONPretty from 'react-json-pretty';
class NewAPIModal extends Component {

    constructor(props) {
        super(props);
        this.state = {endpoint: "", description: "", HTTPMethod: "GET", responseBodyType: "JSON", responseBody:"{}", groupName:"", responseHeaders:[] }
        console.log(this.props)
        this.selectHTTPMethod = this.selectHTTPMethod.bind(this)
        this.submitModal = this.submitModal.bind(this);
    }
    options = []

    selectHTTPMethod(e, data) {
        this.setState({ HTTPMethod: data.text })
    }

    submitModal(e) {
        e.preventDefault();
        console.log(this.state)
        this.props.onModalSubmit(this.state);
    }

    addResponseHeaderRow = (e) =>{
        e.preventDefault();
        this.setState({saved:false ,responseHeaders: [...this.state.responseHeaders, {}]})
    }

    deleteResponseHeader = (e, index) =>{
        this.setState({saved: false, responseHeaders: [...this.state.responseHeaders.slice(0,index), ...this.state.responseHeaders.slice(index+1)]})
    }

    updateKey(index,val, responseHeaderValue) {
        const rh = this.state.responseHeaders.slice();
        rh[index] = {[val.value]: responseHeaderValue}
        this.setState({responseHeaders: rh,saved:false})
    }

    updateValue(index,val, responseHeader) {
        const rh = this.state.responseHeaders.slice();
        rh[index] = {[responseHeader]:val.value}
        this.setState({responseHeaders: rh,saved:false})
    }


    render() {
        this.options = this.props.groups.map((val) => {
            return {key:val, text:val,value:val}
        })
        console
        return (
            <Form onSubmit={this.submitModal}>
                <Form.Field>
                    <label>HTTP Method</label>
                    <Dropdown text={this.state.HTTPMethod}>
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
                    onChange={event => {this.setState({endpoint: event.target.value})}}
                />

                <Form.Field>
                    <label>Description</label>
                    <input value={this.state.description} onChange={event => { this.setState({ description: event.target.value }) }} placeholder='Description of endpoint...' />
                </Form.Field>

                <Form.Dropdown
                    label='Group'
                    placeholder='Select Group'
                    options={this.options}
                    onChange={(e,data) => {console.log(data);this.setState({groupName: data.value})}}
                />

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
                                    let headerKey =  Object.keys(v)[0];
                                    return (
                                    <Table.Row key={i}>
                                        <Table.Cell><Input fluid value={headerKey} onChange={(e, val) => this.updateKey(i, val, v[headerKey])}/></Table.Cell>
                                        <Table.Cell><Input fluid value={v[headerKey]} onChange={(e, val) => this.updateValue(i, val, headerKey)}/></Table.Cell>
                                        <Table.Cell icon="delete" onClick={(e) =>{this.deleteResponseHeader(e,i)}}></Table.Cell>
                                    </Table.Row>)
                                })}
                            
                            </Table.Body>
                            </Table>
                            <Button onClick={this.addResponseHeaderRow}>Add </Button>    
                            <h3>Response Body <span style={{ backgroundColor:'grey', color: "white", padding: '3px' }}>{this.state.responseBodyType}</span></h3>
                            <Form.Group>
                                <TextArea style={{width: '50%', marginTop:'15px'}} placeholder='JSON Response...' value={String(this.state.responseBody)} onChange={(e,data) => this.setState({responseBody: data.value })} />
                                <JSONPretty style={{width: '50%'}} data={this.state.responseBody}></JSONPretty>
                            </Form.Group>


                        <Button color='red' onClick={() => { this.props.modalExit()}}>
                            <Icon name='remove' /> Cancel
                        </Button>
                        <Button color='green' >
                            <Icon name='checkmark' /> Submit
                        </Button>
            </Form>

        );
    }
}

export default NewAPIModal