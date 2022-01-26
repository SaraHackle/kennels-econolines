import React from "react"
import { useLocation } from "react-router-dom";
import "./SearchResults.css"
import { AnimalListComponent } from "../animals/AnimalList";
import { Animal } from "../animals/Animal";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useState, useEffect } from "react";


export default () => {
    const history = useHistory()
    
    const location = useLocation()
    
    

    const displayAnimals = () => {
        if (location.state?.animals.length) {
            return (
                <React.Fragment>
                    <h2>Matching Animals</h2>
                    <section className="animals">
                        {history.push(`/animals/${location.state.animals[0].id}`)}
                    </section>
                </React.Fragment>
            )
        }
    }

    const displayEmployees = () => {
        if (location.state?.employees.length) {
            return (
                <React.Fragment>
                    <h2>Matching Employees</h2>
                    <section className="employees">
                        {history.push(`/employees/${location.state.employees[0].id}`)}
                    </section>
                </React.Fragment>
            )
        }
    }

    const displayLocations = () => {
        if (location.state?.locations.length) {
            return (
                <React.Fragment>
                    <h2>Matching Locations</h2>
                    <section className="locations">
                    {history.push(`/locations/${location.state.locations[0].id}`)}
                    </section>
                </React.Fragment>
            )
        }
    }

    
    return (
        <React.Fragment>
            <article className="searchResults">
                {displayAnimals()}
                {displayEmployees()}
                {displayLocations()}
            </article>
        </React.Fragment>
    )
}
