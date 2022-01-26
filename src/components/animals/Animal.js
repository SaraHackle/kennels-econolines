import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router";
import AnimalRepository from "../../repositories/AnimalRepository";
import AnimalOwnerRepository from "../../repositories/AnimalOwnerRepository";
import OwnerRepository from "../../repositories/OwnerRepository";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import useResourceResolver from "../../hooks/resource/useResourceResolver";
import { Link} from "react-router-dom"
import "./AnimalCard.css"

export const Animal = ({ animal, syncAnimals,
    showTreatmentHistory, owners }) => {
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [isEmployee, setAuth] = useState(false)
    const [animalOwner,setOwner]=useState([])
    const [myOwners, setPeople] = useState([])
    const [allOwners, registerOwners] = useState([])
    const [classes, defineClasses] = useState("card animal")
    const { getCurrentUser } = useSimpleAuth()
    const history = useHistory()
    const { animalId } = useParams()
    const { resolveResource, resource: currentAnimal } = useResourceResolver()
    const [treatment,upDateTreatment ]=useState({
        description:"",
        timestamp:new Date()
    })
    
const submitTrearment=()=>{
    const newTreatment={
        description:treatment.description,
        animalId:parseInt(animalId),
        timestamp:new Date()
    }

    const postTreatment={
        
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newTreatment)
    

    }
   return fetch("http://localhost:8088/treatments",postTreatment)
        .then(response=>response.json())
        .then(()=>{
            history.push("/animals/")
        })
}

    const [animalName, updateAnName] = useState([])

    //updates animal name when animal or current animal change to be the animalcaretaker object
    useEffect(()=>{
        return updateAnName(currentAnimal.animalCaretakers)
    },[animal, currentAnimal])

    //updates animal owner to the value of currentAnimal.animalOwners when animal or current animal changes
    useEffect(()=>{
            return setOwner((currentAnimal.animalOwners),[animal,currentAnimal])
    })

    //upon initial render will set value of isEmployee and run resolve resource using animal param
    // animal id use params and the value of the animal repository
    useEffect(() => {
        setAuth(getCurrentUser().employee)
        resolveResource(animal, animalId, AnimalRepository.get)
    }, [])

    //pretty sure this handles a new registered owner
    useEffect(() => {
        if (owners) {
            registerOwners(owners)
        }
    }, [owners])

    //this sets the myOwners var
    const getPeople = () => {
        return AnimalOwnerRepository
            .getOwnersByAnimal(currentAnimal.id)
            .then(people => setPeople(people))
    }

    // will update the myOwners var when current animal changes
    useEffect(() => {
        getPeople()
    }, [currentAnimal])

//when animalId changes sets myOwners to getOwnersbyAnimal then runs register owner
    useEffect(() => {
        if (animalId) {
            defineClasses("card animal--single")
            setDetailsOpen(true)

            AnimalOwnerRepository.getOwnersByAnimal(animalId).then(d => setPeople(d))
                .then(() => {
                    OwnerRepository.getAllCustomers().then(registerOwners)
                })
        }
    }, [animalId])

    // this deletes a pet from the db
    const deletePets = (id) => {
        fetch(`http://localhost:8088/animals/${id}`, {
            method: "DELETE"
        })
        .then(
            ()=>{
                history.go("/animals/")
            }
        )
    }

    // this assigns  pet a new owner
    
    const addOwner = (ownerObj) =>{
        

        const postOp = (obj) =>
        ({
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
        })

       return fetch(`http://localhost:8088/animalOwners`, postOp(ownerObj))
        .then(()=>history.go("/animals"))
    }
  
    return (
        <>
            <li className={classes}>
                <div className="card-body">
                    <div className="animal__header">
                        <h5 className="card-title">
                            <button className="link--card btn btn-link"
                                style={{
                                    cursor: "pointer",
                                    "textDecoration": "underline",
                                    "color": "rgb(94, 78, 196)"
                                }}
                                onClick={() => {
                                    if (isEmployee) {
                                        showTreatmentHistory(currentAnimal)
                                    }
                                    else {
                                        history.push(`/animals/${currentAnimal.id}`)

                                    }
                                }}> {currentAnimal.name} </button>
                        </h5>
                        <span className="card-text small">{currentAnimal.breed}</span>
                    </div>

                    <details open={detailsOpen}>
                        <summary className="smaller">
                            <meter min="0" max="100" value={Math.random() * 100} low="25" high="75" optimum="100"></meter>
                        </summary>

                        <section>
                            <h6>Caretaker(s)</h6>
                            <span className="small">
                            <p>{`${animalName?.map(users=>{
                                return `${users.user.name}`
                            })}`}</p>
                            </span>


                            <h6>Owners</h6>
                            <span className="small">
                               Owner {animalOwner?.map((owner)=>{
                                   return <p>{owner.user.name}</p>
                               })}
                            </span>

                            {
                                animalOwner?.length < 2
                                    ? <select defaultValue=""
                                        name="owner"
                                        className="form-control small"
                                        onChange={(e) => {

                                           let animalOwnerObj =
                                           {
                                               animalId: currentAnimal.id,
                                               userId: parseInt(e.target.value)
                                           }

                                           getPeople();
                                        
                                           
                                          addOwner(animalOwnerObj)
                                            
                                          
                                        }} >
                                        <option value="">
                                            Select {myOwners.length === 1 ? "another" : "an"} owner
                                        </option >
                                        {
                                            allOwners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)
                                        }
                                    </select>
                                    : null
                            }

                            
                            {
                                detailsOpen && "treatments" in currentAnimal
                                    ? 
                                        <div>
                                            {
                                       isEmployee ? <div className="small">
                                        <h6>Treatment Input</h6>
                                        <input type="text" className="form-control small"  onChange={(event)=>{
                                                const copy={...treatment}
                                                copy.description=event.target.value
                                                upDateTreatment(copy)
                                                
                                        }}/>                                   
                                        <button className="btn btn-warning mt-3 form-control small" onClick={()=>{
                                            submitTrearment()
                                        }}>Add treatment</button> 
                                            
                                        </div> :""
                                        }
                                        {                      
                                            currentAnimal.treatments.map(t => (
                                                <div key={t.id}>
                                                    <h6>Treatment History</h6>  
                                                    <p style={{ fontWeight: "bolder", color: "grey" }}>
                                                        {new Date(t.timestamp).toLocaleString("en-US")}
                                                    </p>
                                                    <p>{t.description}</p>
                                                </div>
                                            ))
                                            
                                        }
                                        
                                    </div>
                                    : ""
                            }

                        </section>
                        

                        {
                            isEmployee
                                ?  <Link to={ '/animals'}><button className="btn btn-warning mt-3 form-control small" onClick={() =>
                                    AnimalOwnerRepository
                                        .removeOwnersAndCaretakers(currentAnimal.id)
                                        .then(() => {deletePets(currentAnimal.id)}) // Remove animal
                                        .then(() => {}) // Get all animals
                                }>Discharge</button> </Link>
                                : ""
                        }

                    </details>
                </div>
            </li>
        </>
    )
}
