import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TextField from '@tools-ui/tools-ui-components/TextField';
import { KeyValueTable } from "../create_entity_form/key_value_table";

import Styles from './styles.css';

export default class AddMetadataField extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fieldName: props.index >= 0 ? props.index : '',
			showDialog: false,
		};
		this.addField = this.addField.bind(this);
		this.editFieldName = this.editFieldName.bind(this);
		this.resetDialog = this.resetDialog.bind(this);
		this.toggleDialog = this.toggleDialog.bind(this);
	}

	addField(type) {
		if (this.state.fieldName.length < 1) {
			// TODO: show error message for empty name
			return;
		}
		this.props.addNewField(type, this.state.fieldName);
		this.resetDialog();
	}

	editFieldName(value) {
		this.setState({
			fieldName: value,
		});
	}

	toggleDialog() {
		this.setState({
			showDialog: !this.state.showDialog,
		});
	}

	resetDialog() {
		this.setState({
			fieldName: '',
			showDialog: false,
		});
	}

	render() {
		let fieldName;
		if (this.props.index >= 0) {
			fieldName = this.props.index;
		} else {
			fieldName = <TextField
				labelText="Field Name:"
				onChange={(event) => {this.editFieldName(event.target.value)}}
				value={this.state.fieldName}
			/>;
		}
		if (this.state.showDialog) {
			return (
				<div className={Styles.addMetadataField}>
					{fieldName}
					<div>
						Field Type:
						<ul>
							<li><button onClick={() => { this.addField('object') }}>Object</button></li>
							<li><button onClick={() => { this.addField('array') }}>Array</button></li>
							<li><button onClick={() => { this.addField('string') }}>String</button></li>
							<li><button onClick={() => { this.addField('boolean') }}>Boolean</button></li>
						</ul>
					</div>
					<div className={Styles.addFieldButtons}>
						<button onClick={this.resetDialog}>Cancel</button>
					</div>
				</div>
			);
		}

		return (
			<button onClick={this.toggleDialog}>{this.props.addButtonText}</button>
		);
	}
}

AddMetadataField.propTypes = {
	addButtonText: PropTypes.string,
	addNewField: PropTypes.func,
	index: PropTypes.number,
};
