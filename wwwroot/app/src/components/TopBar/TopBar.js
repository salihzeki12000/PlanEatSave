import React, { Component } from 'react';
import { Link } from 'react-router';
import logo from './logo.svg';

export default class TopBar extends Component {

    renderAddButton() {
        if (this.props.addButton) {
            return (
                <button
                    className="top-bar__side top-bar__side--right top-bar__add-button"
                    onClick={this.props.addButtonOnClick}>
                    ADD
                </button>
            );
        }

        return null;
    }

    renderSaveButton() {
        if (this.props.saveButton) {
            return (
                <div
                    className="top-bar__side top-bar__side--right top-bar__save-button"
                    onClick={this.props.saveButtonOnClick}>
                    SAVE
                </div>
            );
        }

        return null;
    }

    renderEditButton() {
        if (this.props.editButton) {
            return (
                <div
                    className="top-bar__side top-bar__side--right top-bar__edit-button"
                    onClick={this.props.editButtonOnClick}>
                    EDIT
                </div>
            );
        }

        return null;
    }

    renderBackButton() {
        if (this.props.backButton) {
            return (
                <div className="top-bar__side top-bar__side--left" onClick={this.props.backButtonOnClick}>
                    <i className="fa fa-arrow-left" aria-hidden="true"></i>
                    &nbsp; {this.props.backButtonText}
                </div>
            );
        }

        return null;
    }

    renderLogo() {
        if (this.props.hideLogo) {
            return null;
        }

        return (
            <Link to="/" className="top-bar__logo">
                <img src={logo} alt="logo" />
            </Link>
        );
    }

    render() {
        return (
            <div className="top-bar">

                {this.renderBackButton()}

                {this.renderLogo()}

                {this.renderAddButton()}
                {this.renderSaveButton()}
                {this.renderEditButton()}
            </div>
        );
    }
}
