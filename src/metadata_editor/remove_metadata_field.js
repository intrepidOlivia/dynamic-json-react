import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from '@tools-ui/tools-ui-components/Button';

import Styles from './styles.css';

export default class RemoveMetadataField extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showDialog: false,
		};
		this.toggleDialog = this.toggleDialog.bind(this);
	}

	toggleDialog() {
		this.setState({
			showDialog: !this.state.showDialog,
		});
	}

	render() {
		const children = (<div
			onClick={this.toggleDialog}
			className={Styles.fieldName}
		>
			{this.props.children}
		</div>);

		if (!this.state.showDialog) {
			return children;
		}
		return (
			<React.Fragment>
				<div
					className={Styles.addMetadataField}
				>
					<p>Remove field {this.props.fieldName}?</p>
					<div><Button onClick={this.toggleDialog}>Cancel</Button> <Button onClick={this.props.onDelete}>Confirm</Button></div>
				</div>
				{children}
			</React.Fragment>
		);
	}
}

RemoveMetadataField.propTypes = {
	children: PropTypes.any,
	fieldName: PropTypes.string,	// The name of the field to be removed
	onDelete: PropTypes.func,
};
