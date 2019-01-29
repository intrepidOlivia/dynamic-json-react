import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash.clonedeep';
import Button from '@tools-ui/tools-ui-components/Button';

import MetadataEditor from "./metadata_editor";

export default class MetadataForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			metadata: cloneDeep(props.metadata),
		};

		this.addNewArrayItem = this.addNewArrayItem.bind(this);
		this.addNewField = this.addNewField.bind(this);
		this.editStringArray = this.editStringArray.bind(this);
		this.onChangeString = this.onChangeString.bind(this);
		this.removeField = this.removeField.bind(this);
		this.toggleField = this.toggleField.bind(this);
	}

	/**
	 * Changes the array of strings edited by the Chip List
	 * @param key
	 * @param tags
	 * @param parentKeys
	 */
	editStringArray(key, tags, parentKeys) {
		const stateMetadata = this.state.metadata;
		const arrayVals = tags.map(tag => tag.value);
		let subProperty = stateMetadata;
		if (parentKeys) {
			for (let i = 0; i < parentKeys.length; i++) {
				subProperty = subProperty[parentKeys[i]];
			}
		}
		subProperty[key] = arrayVals;
		this.setState({
			metadata: stateMetadata,
		});
	}

	/**
	 * Changes a string edited by a Text Field
	 * @param key
	 * @param value
	 * @param parentKeys
	 */
	onChangeString(key, value, parentKeys) {
		const stateMetadata = this.state.metadata;
		let subProperty = stateMetadata;

		if (parentKeys) {	// if value is nested
			for (let i = 0; i < parentKeys.length; i++) {
				subProperty = subProperty[parentKeys[i]];
			}
		}
		subProperty[key] = value;
		this.setState({
			metadata: stateMetadata,
		});
	}

	/**
	 * Flips the value of a boolean field
	 * @param key	The name of the boolean field
	 * @param parentKeys	The path of the field, if it is nested
	 */
	toggleField(key, parentKeys) {
		const stateMetadata = this.state.metadata;
		let subProperty = stateMetadata;

		if (parentKeys) {
			for (let i = 0; i < parentKeys.length; i++) {
				subProperty = subProperty[parentKeys[i]];
			}
		}
		subProperty[key] = !subProperty[key];
		this.setState({
			metadata: stateMetadata,
		});
	}

	/**
	 * Adds a new field to an object
	 * @param type	Type of field. One of: 'object', 'array', 'string', 'boolean'
	 * @param fieldName	The key of the new field
	 * @param parentKeys	The path of the field, if it is nested
	 */
	addNewField(type, fieldName, parentKeys) {
		const stateMetadata = this.state.metadata;
		let subProperty = stateMetadata;
		if (parentKeys) {
			for (let i = 0; i < parentKeys.length; i++) {
				subProperty = subProperty[parentKeys[i]];
			}
		}

		// Add the new field to the metadata
		switch (type) {
			case 'object':
				subProperty[fieldName] = {};
				break;
			case 'array':
				subProperty[fieldName] = [];
				break;
			case 'string':
				subProperty[fieldName] = '';
				break;
			case 'boolean':
				subProperty[fieldName] = false;
				break;
			default:
				subProperty[fieldName] = {};
		}

		this.setState({
			metadata: stateMetadata,
		});
	}

	removeField(fieldName, parentKeys) {
		const stateMetadata = this.state.metadata;
		let subProperty = stateMetadata;
		if (parentKeys) {
			for (let i = 0; i < parentKeys.length; i++) {
				subProperty = subProperty[parentKeys[i]];
			}
		}

		delete subProperty[fieldName];

		this.setState({
			metadata: stateMetadata,
		});
	}

	/**
	 * Adds a new item to an array
	 * @param type	{String}	Type of field. One of: 'object', 'array', 'string', 'boolean'
	 * @param arrayKey
	 * @param parentKeys	{Array<String>}	The path of the array, if it is nested
	 */
	addNewArrayItem(type, arrayKey, parentKeys) {
		const stateMetadata = this.state.metadata;
		let subProperty = stateMetadata;
		if (parentKeys) {
			for (let i = 0; i < parentKeys.length; i++) {
				subProperty = subProperty[parentKeys[i]];
			}
		}

		switch (type) {
			case 'object':
				subProperty.push({});
				break;
			case 'array':
				subProperty.push([]);
				break;
			case 'string':
				subProperty.type = 'string';
				break;
			case 'boolean':
				subProperty.push(false);
				break;
			default:
		}

		this.setState({
			metadata: stateMetadata,
		});
	}

	render() {
		return (
			<Fragment>
				<MetadataEditor
					metadata={this.state.metadata}
					addNewArrayItem={this.addNewArrayItem}
					addNewField={this.addNewField}
					editStringArray={this.editStringArray}
					onChangeString={this.onChangeString}
					removeField={this.removeField}
					toggleField={this.toggleField}
				/>
				<div>
					<Button onClick={this.props.onCancel}>Cancel</Button>
					<Button onClick={() => {this.props.onSave(this.state.metadata)}}>Save</Button>
				</div>
			</Fragment>
		);
	}
}

MetadataForm.defaultProps = {
	metadata: {},
};

MetadataForm.propTypes = {
	metadata: PropTypes.object,	// Initial values for the metadata
	onCancel: PropTypes.func,
	onSave: PropTypes.func,	// will be passed in the modified metadata object
};
