import React, { Component } from 'react';
import { ApiRequest } from '../../services/ApiRequest';
import Routes from '../../services/Routes';
import TopBar from '../TopBar/TopBar';
import Recipe from './Recipe';

export default class AddNewRecipe extends Component {

    constructor(props) {
        super(props);

        this.state = {
            recipe: this.createEmptyRecipe(),
            isRecipeVisible: true,
            message: null
        };
    }

    createEmptyRecipe() {
        return {
            name: '',
            ingredients: [],
            preparation: ''
        }
    }

    getLoadingMsg() {
        return (<h3> Adding your recipe... </h3>);
    }

    getErrorMessage() {
        return (
            <h3 style={{ color: 'red' }}> There was an error with our server. Please try again! </h3>
        );
    }

    saveRecipe() {
        this.setState({ isRecipeVisible: false, message: this.getLoadingMsg() });

        const ingredients = this.state.recipe.ingredients
            .map(ingredient => ingredient.name)
            .filter(ingredientName => ingredientName.trim().length > 0);

        const recipe = { ...this.state.recipe, ingredients };


        ApiRequest
            .saveRecipe(recipe)
            .then(
            rsp => {
                this.props.router.push(Routes.myRecipes());
            },
            err => {
                console.log(err);
                this.setState({ message: this.getErrorMessage(err), isRecipeVisible: true });
            });
    }

    onRecipeChange(recipe) {
        this.setState({ recipe });
    }

    renderRecipe() {
        if (this.state.isRecipeVisible) {
            return (
                <Recipe
                    recipe={this.state.recipe}
                    onChange={recipe => this.onRecipeChange(recipe)} />
            );
        }

        return null;
    }

    render() {
        return (
            <div>
                <TopBar
                    backButton backButtonText="Add recipe" backButtonOnClick={() => this.props.router.push(Routes.myRecipes())}
                    saveButton saveButtonOnClick={() => this.saveRecipe()} />
                <div className="row">
                    {this.state.message}

                    {this.renderRecipe()}
                </div>
            </div>
        );
    }
}