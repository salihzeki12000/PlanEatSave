import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import PantryPage from './PantryPage';
import { ApiRequest } from '../../services/ApiRequest';
import TopBar from '../TopBar/TopBar';
import Routes from '../../services/Routes';
import ConfirmModal from '../base/modal/ConfirmModal';
import { PantryService, filterOptions } from '../../services/PantryService';
import SearchInput from '../base/search/SearchInput';
import NavigationMenu from '../NavigationMenu';
import pages from '../../constants/pages';

export default class PantryPageContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pantry: null,
            errorMsg: null,
            removeItemId: null,
            filterOption: filterOptions.ALL_ITEMS,
            searchTerm: ''
        };

        this.onRemoveItem = this.onRemoveItem.bind(this);
    }

    populatePantry(pantryDb) {
        const pantry = {
            id: pantryDb.id,
            lists: PantryService.separatePantryInCategories(pantryDb)
        };

        this.setState({ pantry });
    }

    onRemoveItem(itemId) {
        this.setState({ removeItemId: itemId });
    }

    removeItem(itemId) {
        this.setState({ removeItemId: null });

        ApiRequest.removePantryItem(itemId).then(response => {
            const {isSuccess, message} = response.body;
            if (!isSuccess) {
                console.log(message);
            }

            this.retrievePantryFromServer();
        }, err => {
            // TODO: also make sure to treat the forbidden requests
            console.log(err);
            this.setState({ errorMsg: 'There was an error with our servers. Please try again later!' });
        });
    }

    retrievePantryFromServer() {
        this.setState({ pantry: null });

        ApiRequest.getPantry().then(response => {
            const pantryDb = response.body;
            this.populatePantry(pantryDb);
        }, err => {
            console.log(err);
            this.setState({ errorMsg: 'There was an error with our servers. Please try again later!' });
        });
    }

    componentDidMount() {
        this.setState({ errorMsg: null });
        this.retrievePantryFromServer();
    }

    renderPantry() {
        if (this.state.errorMsg) {
            return <h3> {this.state.errorMsg} </h3>
        }

        if (this.state.pantry == null) {
            return (<h3> Loading... </h3>);
        }

        return (
            <PantryPage
                pantryId={this.state.pantry.id}
                items={PantryService.filterPantry(this.state.pantry, this.state.filterOption, this.state.searchTerm)}
                onRemoveItem={this.onRemoveItem}
                router={this.props.router} />
        );
    }

    renderRemoveModal() {
        const isAnItemToBeDeleted = !!this.state.removeItemId;
        const modalTitle = 'Remove this item from the pantry?';

        return (
            <ConfirmModal
                isOpen={isAnItemToBeDeleted}
                title={modalTitle}
                cancelButtonText="Cancel"
                onCancel={() => this.setState({ removeItemId: null })}
                actionButtonText="Remove"
                onAction={() => this.removeItem(this.state.removeItemId)}
            />
        );
    }

    renderFilterOptions() {
        const options = [
            { value: filterOptions.ALL_ITEMS, label: 'ALL' },
            { value: filterOptions.EXPIRED_ITEMS, label: 'EXPIRED' },
            { value: filterOptions.EXPIRE_SOON_ITEMS, label: 'EXPIRES SOON' },
        ];

        return (
            <div className="pantry-page-container__filter">
                <Select
                    options={options}
                    value={this.state.filterOption}
                    onChange={option => this.setState({ filterOption: option.value })}
                    clearable={false}
                    searchable={false}
                />
            </div>
        );
    }

    render() {
        return (
            <div className="pantry-page-container">
                <TopBar addButton addButtonOnClick={() => this.props.router.push(Routes.addPantryItem(this.state.pantry.id))} />

                <div className="pes-row">
                    <SearchInput onChange={searchTerm => this.setState({ searchTerm })} />
                    {this.renderFilterOptions()}
                    {this.renderPantry()}
                </div>

                {this.renderRemoveModal()}
                <NavigationMenu activeItem={pages.PANTRY} />
            </div>
        );
    }
}