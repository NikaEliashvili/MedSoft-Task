import { useEffect, useState } from "react";
import axios from "axios";
import TBody from "./TBody";
import THead from "./THead";
import TableButtons from "./TableButtons";
function formatDate(curDate) {
  const dateFromServer = new Date(curDate); // Received from the server
  const patientDob = dateFromServer
    .toLocaleDateString("en-GB")
    .replaceAll("/", ".");
  return patientDob === "Invalid Date" ? curDate : patientDob;
}

function formatDateForSQL(curDate) {
  const inputDateString = curDate;
  const [day, month, year] = inputDateString.split(".");

  const parsedDate = new Date(`${year}-${month}-${day}`);
  // Format the date as YYYY-MM-DD
  const formattedDate = parsedDate.toISOString().split("T")[0];
  return formattedDate;
}

export default function Table() {
  const [patientsData, setPatientsData] = useState([]);
  const [addedPatients, setAddedPatients] = useState([]);
  const [hasEditor, setHasEditor] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [clickedID, setClickedID] = useState(null);

  function clickHandle(id) {
    setClickedID(id);
  }

  useEffect(() => {
    axios.get("http://localhost:8080/patients").then((data) => {
      const patientsData = data.data.map((patient) => ({
        ...patient,
        Dob: formatDate(patient.Dob),
      }));

      setPatientsData(patientsData);
    });
  }, []);
  const [patientsDataCopy, setPatientsDataCopy] = useState([]);
  useEffect(() => {
    setPatientsDataCopy([...patientsData, ...addedPatients]);
  }, [patientsData, addedPatients]);

  function updatePatientsData(newData) {
    setPatientsDataCopy(newData);
  }

  function handleAddBtn() {
    setIsAdding(true);
    setAddedPatients((prev) => [
      ...prev,
      {
        ID: patientsDataCopy[patientsDataCopy.length - 1].ID + 1,
        FullName: "",
        Dob: "",
        GenderID: -1,
        Phone: null,
        Address: "",
        PersonalNumber: "",
        Email: "",
      },
    ]);
  }

  function handleEditorBtn() {
    setHasEditor((prev) => !prev);
  }
  function handleAddingBtn() {
    setIsAdding(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsAdding(false);
    const ModifedPatientsData = [...patientsDataCopy]?.map((patient) => {
      const newDate = formatDateForSQL(patient?.Dob);
      const modifyGenderID =
        patient?.GenderID === -1 ? 1 : parseInt(patient?.GenderID);
      const validPhoneNumber =
        patient?.Phone?.length === 11 && patient?.Phone[0] === "5"
          ? patient?.Phone
          : null;

      return {
        ...patient,
        GenderID: modifyGenderID,
        Dob: newDate,
        Phone: validPhoneNumber,
      };
    });
    const patientData = ModifedPatientsData[ModifedPatientsData.length - 1];
    try {
      const response = await axios.post(
        "http://localhost:8080/patients",
        patientData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error adding patient:", error);
    }

    window.location.reload();
  }

  async function handleUpdatePatients() {
    const modifyData = [...patientsDataCopy]?.map((patient) => {
      const newDate = formatDateForSQL(patient?.Dob);
      const modifyGenderID =
        patient?.GenderID === -1 ? 1 : parseInt(patient?.GenderID);
      const validPhoneNumber =
        patient?.Phone?.length === 11 && patient?.Phone[0] === "5"
          ? patient?.Phone
          : null;

      return {
        ...patient,
        GenderID: modifyGenderID,
        Dob: newDate,
        Phone: validPhoneNumber,
      };
    });
    try {
      const response = await axios.put(
        "http://localhost:8080/patients",
        modifyData
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error updating patients:", error);
    }
  }

  async function handleDelete(id) {
    axios
      .delete(`http://localhost:8080/patients/${id}`)
      .then((response) => {
        console.log(response.data.message);
        setPatients(patients.filter((patient) => patient.ID !== id));
      })
      .catch((error) => {
        console.error("Error deleting patient:", error);
      });
    window.location.reload();
  }

  if (!patientsData) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="relative w-100% flex flex-col gap-5">
      {hasEditor && (
        <div className="absolute bottom-full left-0 right-0 mb-5 w-fit mx-auto text-center bg-orange-500 px-5 py-2 rounded-lg text-white font-bold ">
          თქვენ ხართ რედაქტირების რეჟიმში
        </div>
      )}
      <TableButtons
        handleEditorBtn={handleEditorBtn}
        handleAddBtn={handleAddBtn}
        handleDelete={handleDelete}
        handleAddingBtn={handleAddingBtn}
        clickedID={clickedID}
      />
      <form action="">
        <table className="table text-xs sm:text-sm ">
          <THead />
          <TBody
            patientsDataCopy={patientsDataCopy}
            setPatientsDataCopy={setPatientsDataCopy}
            hasEditor={hasEditor}
            isAdding={isAdding}
            updatePatientsData={updatePatientsData}
            clickHandle={clickHandle}
            clickedID={clickedID}
          />
        </table>
        {hasEditor && (
          <button
            className={` absolute top-full right-0 my-5 px-4 py-2  text-white font-semibold rounded-md hover:scale-95  duration-200 
        bg-green-500 disabled:bg-zinc-200 disabled:text-zinc-500 disabled:cursor-default disabled:hover:scale-100
        
        `}
            onClick={handleUpdatePatients}
            type="submit"
          >
            {hasEditor && "შენახვა"}
          </button>
        )}
        {isAdding && (
          <button
            className={` absolute top-full right-0 my-5 px-4 py-2  text-white font-semibold rounded-md hover:scale-95  duration-200 
        bg-green-500 disabled:bg-zinc-200 disabled:text-zinc-500 disabled:cursor-default disabled:hover:scale-100
        
        `}
            onClick={handleSubmit}
            type="submit"
          >
            {isAdding && "დამატება"}
          </button>
        )}
      </form>
    </div>
  );
}
