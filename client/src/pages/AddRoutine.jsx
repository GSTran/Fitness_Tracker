import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const AddRoutine = () => {
    const [routine, setRoutine] = useState({
      routinename:""
    });

    const [workouts, setworkouts] = useState([]);
    const [checkedWorkoutIds, setCheckedWorkoutIds] = useState([])

    // Fetch all workouts  to add to routine
    useEffect(()=>{
      const fetchAllWorkouts = async () =>{
          try{
              const res = await axios.get("http://localhost:8800/workouts");
              console.log(res);
              setworkouts(res.data);
          }catch(err){
              console.log(err);
          }
      }
      fetchAllWorkouts();
    },[])

    const navigate = useNavigate()

    const handleChange = (e) =>{
        setRoutine(prev=>({...prev, [e.target.name]: e.target.value}))
    };

    const handleCheckboxChange = (id) => {
      // Toggle the workout ID in the list of checked IDs
      console.log("Checkbox with ID", id, "changed");
      setCheckedWorkoutIds(prevIds => {
          if (prevIds.includes(id)) {
              return prevIds.filter(workoutId => workoutId !== id);
          } else {
              return [...prevIds, id];
          }
      });
  };

    const handleClick = async (e) => {
      e.preventDefault();
      try {
        // Create routine and get the new routine ID
        const routineResponse = await axios.post(
          "http://localhost:8800/routines",
          routine
        );
        console.log(routineResponse);
        const routineId = routineResponse.data.id;

        // Assuming you are associating workouts immediately after creating the routine
        if (checkedWorkoutIds.length > 0) {
          await axios.post(
            `http://localhost:8800/routines/${routineId}/workouts`,
            { workoutIds: checkedWorkoutIds }
          );
        }

        navigate("/routines");
      } catch (err) {
        console.error("Error creating routine or adding workouts: ", err);
      }
    };

    console.log(routine);

  return (
    <div>
        <h1>Create New Routine</h1>
        <input type="text" placeholder='name' onChange={handleChange} name="routinename"/>
        <div className="workouts">
            <table>
                <tr>
                <th>Workout Name</th>
                <th>Type</th>
                <th>Muscle Group</th>
                <th>Difficulty</th>
                <th>Instructions</th>
                <th>Reps</th>
                <th>Sets</th>
                <th>Add to Routine?</th>
                </tr>
            {workouts.map((val,key)=>{
                return (
                    <tr key={key}>
                        <td>{val.name}</td>
                        <td>{val.type}</td>
                        <td>{val.muscle}</td>
                        <td>{val.difficulty}</td>
                        <td>{val.instructions}</td>
                        <td>{val.reps}</td>
                        <td>{val.sets}</td>
                        <td><input type="checkbox" onChange={() => handleCheckboxChange(val.workoutid)}/> Add to Routine</td>
                    </tr>
                )
            })}
            </table>
        </div>
        <button onClick={handleClick}>Create Routine</button>
        <div>
                {/* Display checked workout IDs for debugging */}
                Checked workout IDs: {checkedWorkoutIds.join(", ")}
        </div>
    </div>
  )
  
}

export default AddRoutine