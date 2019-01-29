import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextField from '@tools-ui/tools-ui-components/TextField';
import TextArea from '@tools-ui/tools-ui-components/TextArea';
import ChipList from '@tools-ui/tools-ui-components/ChipList';
import Toggle from '@tools-ui/tools-ui-components/Toggle';
import AddMetadataField from "./add_metadata_field";
import RemoveMetadataField from "./remove_metadata_field";

import Styles from './styles.css';

export default function MetadataEditor(props) {
	function parseMetadata(metadata, parentKeys) {
		// Iterate through each element of the metadata tree, displaying the correct component for each type of element
		const uiLayout = Object.keys(metadata).map((key) => {
			const val = metadata[key];
			const header = (<RemoveMetadataField
				fieldName={key}
				onDelete={() => {props.removeField(key, parentKeys)}}
			>
				<h3 className={Styles.keyLabel}>{key}</h3>
			</RemoveMetadataField>);

			// If field is a string
			if (typeof val === "string") {
				let textComponent;
				if (metadata[key].length > 50) {
					textComponent = <TextArea
						onChange={(value) => {props.onChangeString(key, value, parentKeys)}}
						value={metadata[key]}
					/>
				} else {
					textComponent = <TextField
						onChange={(event) => {props.onChangeString(key, event.target.value, parentKeys)}}
						value={metadata[key]}
					/>
				}

				return (
					<div key={key}>
						{header}
						{textComponent}
					</div>
				);
			}

			// If field is a boolean
			if (typeof val === "boolean") {
				return (
					<div key={key}>
						{header}
						<Toggle
							toggled={metadata[key]}
							onChange={(event) => {props.toggleField(key, parentKeys)}}
						/>
					</div>
				);
			}

			// If field is an array
			if (Array.isArray(val)) { // val = [ {arrayobj1..}, {arrayobj2...}], key=fourthKey
				return (
					<div key={key}>
						{parseArray(val, key, parentKeys)}
					</div>
				)
			}

			// If field is an object
			if (typeof val === "object") {
				let path = [ key ]
				if (parentKeys) {
					path = parentKeys.concat(path);
				}

				return(
					<React.Fragment
						key={key}
					>
						{header}
						<div className={Styles.nestedProperty}>
							{parseMetadata(val, path)}
						</div>
					</React.Fragment>
				);
			}
		})

		const parentKey = parentKeys ? parentKeys[parentKeys.length - 1] : null;
		const addFieldMessage = parentKey !== null ? `Add Field to ${parentKey}` : 'Add New Metadata Field';

		return (<React.Fragment key={parentKeys ? parentKeys[parentKeys.length - 1] : 'base_metadata'}>
			{uiLayout}
			<AddMetadataField
				addButtonText={addFieldMessage}
				addNewField={(type, fieldName) => {props.addNewField(type, fieldName, parentKeys)}}
			/>
		</React.Fragment>
		);
	}

	// Determines whether this is an array of strings or objects and returns the appropriate array of HTML elements
	function parseArray(array, key, parentKeys) {
		parentKeys = parentKeys || [];
		let stringArray = array.type && array.type === 'string';	// array can be empty but designated as a string array
		let arrayHeader = (<RemoveMetadataField
			fieldName={key}
			onDelete={() => {props.removeField(key, parentKeys)}}
		>
			<h3 className={Styles.keyLabel}>{key}</h3>
		</RemoveMetadataField>);

		// If array is currently empty:
		if (array.length < 1 && !stringArray) {
			return (
				<React.Fragment key={key}>
					{arrayHeader}
					<div className={Styles.nestedProperty}>
						<AddMetadataField
							addButtonText={`Add Element to ${key} Array`}
							addNewField={(type, fieldName) => {props.addNewArrayItem(type, fieldName, parentKeys.concat([key]))}}
							index={array.length}
						/>
					</div>
				</React.Fragment>
			);
		}

		// If it is an array of strings, return a chiplist
		if (typeof array[0] === "string") {
			stringArray = true;
		}

		if (stringArray) {
			const firstChips = array.map(tag => {
				return {
					text: tag,
					value: tag,
				}
			});
			return (
				<React.Fragment key={key}>
					{arrayHeader}
					<ChipList
						allowCustomChips={true}
						hintText="Add array element"
						onChipChange={(tags) => { props.editStringArray(key, tags, parentKeys) }}
						defaultChips={firstChips}
					/>
				</React.Fragment>)
		}

		// If it is an object, re-parse it again using the same function
		if (typeof array[0] === 'object') {
			return(
				<React.Fragment>
					{arrayHeader}
					<div className={Styles.nestedProperty}>
						{array.map((arrayObject, index) => parseMetadata(arrayObject, parentKeys.concat([key, index])))}
					</div>
					<AddMetadataField
						addButtonText={`Add Array Element to ${key}`}
						addNewField={(type, fieldName) => {props.addNewField(type, fieldName, parentKeys.concat([key]))}}
						index={array.length}
					/>
				</React.Fragment>
			);
		}
	}

	const thisMetadata = parseMetadata(props.metadata);
	const styles = Object.assign({}, Styles, props.styles);

	return (
		<React.Fragment>
			<div className={styles.metadataWrapper}>
				{thisMetadata}
			</div>
		</React.Fragment>
	);
}

MetadataEditor.propTypes = {
	addNewArrayItem: PropTypes.func,
	addNewField: PropTypes.func,
	metadata: PropTypes.object,	// original metadata object
	editNewFieldData: PropTypes.func,
	editStringArray: PropTypes.func,
	onChangeString: PropTypes.func,
	removeField: PropTypes.func,
	toggleField: PropTypes.func,
	styles: PropTypes.object,
};
