import React, { Component } from 'react';
import {
    Form as CarbonForm, Button, TextInput, DatePicker, Select, SelectItem, Grid, Row, Column,
    DatePickerInput, TextArea, NumberInput, SelectSkeleton
} from 'carbon-components-react';


class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show,
            fields: this.props.fields
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }


    onChange = (fieldName, e) => {
        let fields = this.state.fields;
        const field = fields.find(f => f.name === fieldName);
        if (['number'].includes(field.type)) {
            field.value = e.imaginaryTarget.value;
        } else if (['date'].includes(field.type)) {
            field.value = new Date(e[0]).toLocaleString();
        } else {
            field.value = e.target.value;
        }
        this.setState({ fields });
    }

    validInputs = () => {
        for (const fieldName of this.props.requiredFields) {
            const val = this.state.fields.find(f => f.name === fieldName).value;
            if (val <= 0 || val === "" || val === undefined) return false;
        }
        return true;
    }

    onSubmit = (event) => {
        event.preventDefault();
        if (this.validInputs()) {
            const body = {};
            for (const field of this.state.fields) {
                switch (field.type) {
                    case 'number':
                        body[field.name] = Number(field.value);
                        break;
                    case 'date':
                        body[field.name] = new Date(field.value).toISOString()
                        break
                    default:
                        body[field.name] = field.value;
                        break;
                }
            }
            this.props.handleSubmit(body);
        } else {
            this.props.toast("error", "Invalid Inputs", "You must set required inputs.");
        }
    }

    render() {
        return (
            <Grid fullWidth condensed>
                <Row condensed>
                    <Column lg={{ span: 12 }}>
                        <CarbonForm name="Form">
                            {this.state.fields.map(field => {
                                switch (field.type) {
                                    case 'number':
                                        return <NumberInput
                                            id={field.name}
                                            name={field.name}
                                            key={field.name}
                                            disabled={this.props.disabledFields?.includes(field.name) ? true : false}
                                            required
                                            invalidText="Please Enter The Value"
                                            onChange={this.onChange.bind(this, field.name)}
                                            value={field.value}
                                            label={field.label}
                                            placeholder={field.placeholder}
                                        />
                                    case 'text-input':
                                        return <TextInput
                                            id={field.name}
                                            name={field.name}
                                            key={field.name}
                                            disabled={this.props.disabledFields?.includes(field.name) ? true : false}
                                            required
                                            invalidText="Please Enter The Value"
                                            onChange={this.onChange.bind(this, field.name)}
                                            value={field.value}
                                            labelText={field.label}
                                            placeholder={field.placeholder}
                                        />
                                    case 'text-area':
                                        return <TextArea
                                            id={field.name}
                                            name={field.name}
                                            key={field.name}
                                            rows={2}
                                            disabled={this.props.disabledFields?.includes(field.name) ? true : false}
                                            required
                                            invalidText="Please Enter The Value"
                                            onChange={this.onChange.bind(this, field.name)}
                                            value={field.value}
                                            labelText={field.label}
                                            placeholder={field.placeholder}
                                        />
                                    case 'select':
                                        return field.options?.length > 0 ? <Select id={field.name} name={field.name}
                                            key={field.name}
                                            labelText={field.label}
                                            disabled={this.props.disabledFields?.includes(field.name) ? true : false}
                                            required
                                            defaultValue={field.value}
                                            invalidText="Please Enter The Value"
                                            onChange={this.onChange.bind(this, field.name)}>
                                            {field.options?.map(option => (
                                                <SelectItem value={option.value} text={option.text} key={option.value} />
                                            ))}
                                        </Select> : <SelectSkeleton />
                                    case 'date':
                                        return <DatePicker
                                            key={field.name}
                                            datePickerType="single"
                                            size="md"
                                            allowInput={false}
                                            onChange={this.onChange.bind(this, field.name)}
                                        >
                                            <DatePickerInput
                                                id={field.name}
                                                labelText={field.label}
                                                placeholder="mm/dd/yyyy"
                                                defaultValue={new Date(field.value).toISOString()}
                                                disabled={this.props.disabledFields?.includes(field.name) ? true : false}
                                                required
                                            />
                                        </DatePicker>
                                    default:
                                        return <></>
                                }
                            })}
                        </CarbonForm>
                        <Button
                            className='form-button'
                            size='xl'
                            kind='secondary'
                            onClick={() => { this.props.handleClose() }}>
                            Cancel
                        </Button>
                        <Button
                            className='form-button'
                            size='xl'
                            disabled={!this.validInputs()}
                            onClick={this.onSubmit}>
                            {this.props.primaryButtonText ? this.props.primaryButtonText : 'Create'}
                        </Button>
                    </Column>
                </Row>
            </Grid>
        );
    }
}
export default Form;
