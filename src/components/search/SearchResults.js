import React from "react"
import { useLocation } from "react-router-dom";
import "./SearchResults.css"
import { AnimalListComponent } from "../animals/AnimalList";
import { Animal } from "../animals/Animal";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useState, useEffect } from "react";
import { useSimpleAuth} from "../../hooks/ui/useSimpleAuth";


export default () => {
    const history = useHistory()
    
    const location = useLocation()
    
    const {a, aa, aaa,aaaa, getCurrentUser} = useSimpleAuth();
    let usr =getCurrentUser()
    usr= JSON.stringify(usr)
    usr= JSON.parse(usr)
    const currentUserId = usr.id

    const [currentUserObj, setUsers] = useState([])

    useEffect(()=>{
        fetch(`http://localhost:8088/users`)
        .then(usrs=> usrs.json())
        .then(usrs=>usrs.find(user=>user.id === currentUserId))
        .then(usrs=> setUsers(usrs))
    }, [])
    

    const displayAnimals = () => {
       
        if (location.state?.animals.length) {
            console.log("curUs: " + currentUserObj.employee)
            if (currentUserObj?.employee === true)
            {
            return (
                <React.Fragment>
                    <h2>Matching Animals</h2>
                    <section className="animals">
                        {history.push(`/animals/${location.state.animals[0].id}`)}
                    </section>
                </React.Fragment>
            )
        }
        else
        {
        return <h2>only employees can search animals</h2>
        }
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
