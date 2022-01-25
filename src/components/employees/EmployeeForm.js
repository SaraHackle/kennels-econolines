import React, { useEffect, useState } from "react"
import EmployeeRepository from "../../repositories/EmployeeRepository";
import LocationRepository from "../../repositories/LocationRepository";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import Employee from "./Employee";
import "./EmployeeForm.css"


export default (props) => {
    const [employee, updateEmployee] = useState({})
    const [locations, defineLocations] = useState([])
    const [emps, setEmployees] = useState([])
    
    const history = useHistory()

    useEffect(
        () => {
            EmployeeRepository.getAll().then(setEmployees)
        }, []
    )
    useEffect(
        () => {
            LocationRepository.getAll().then(defineLocations)
        }, []
    )
    
    const constructNewEmployee = () => {
        if (employee.location === 0) {
            window.alert("Please select a location")
        } else {
            EmployeeRepository.assignEmployee({
                userId: parseInt(employee.employee),
                locationId: parseInt(employee.location)
            })
            .then(() => history.push("/employees"))
        }
    }
    

    const handleUserInput = (event) => {
        const copy = {...employee}
        copy[event.target.name] = event.target.value
        updateEmployee(copy)
    }

   



    return (
        <>
            <form className="employeeForm">
                <h2 className="employeeForm__title">New Employee</h2>
                <div className="form-group">
                    <label htmlFor="employeeName">Employee name</label>
                    <select onChange={handleUserInput}
                     defaultValue=""
                     name="employee"
                     className="form-control"
                     >
                         <option value="0">Select your name</option>

                         {emps.map(e => (
                             <option key={e.id} value={e.id}>
                                 {e.name}
                             </option>
                         ))}
                     </select>
                </div>
                <div className="form-group">
                    <label htmlFor="location">Assign to location</label>
                    <select onChange={handleUserInput}
                        defaultValue=""
                        name="location"
                        className="form-control"
                    >
                        <option value="0">Select a location</option>
                        {locations.map(l => (
                            <option key={l.id} value={l.id}>
                                {l.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit"
                    onClick={
                        evt => {
                            evt.preventDefault()
                            constructNewEmployee()
                        }
                    }
                    className="btn btn-primary"> Save Employee </button>
            </form>
        </>
    )
}
