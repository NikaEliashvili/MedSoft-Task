import { useEffect, useState } from "react";
import _ from "lodash";

function isGeorgian(text) {
  const georgianOrNumbersPattern = /^$|^[\u10A0-\u10FF.\s]+$/;
  return georgianOrNumbersPattern.test(text);
}

function isNumbers(string) {
  const numbersPattern = /^$|^[0-9\s]+$/;
  return numbersPattern.test(string);
}

function isNumbersForPhone(string) {
  const numbersPattern = /^$|^[0-9\s-]+$/;
  return numbersPattern.test(string);
}

function isValidDateDigits(dateString) {
  const dateFormatPattern = /^$|^[0-9.]+$/;
  return dateFormatPattern.test(dateString);
}

function formatPhone(string) {
  const newStr = string.replaceAll("-", "");
  let newFormat = [];
  for (let i = 0; i < newStr.length; i++) {
    if ((i + 1) % 3 === 0 && i + 1 < newStr.length) {
      newFormat.push(newStr[i]);
      newFormat.push("-");
    } else {
      newFormat.push(newStr[i]);
    }
  }

  return newFormat.join("");
}
/* 

-------

-------

-------

-------

*/

export default function TBody({
  patientsDataCopy,
  setPatientsDataCopy,
  hasEditor,
  isAdding,
  updatePatientsData,
  clickHandle,
  clickedID,
}) {
  if (!patientsDataCopy) {
    return null;
  }

  const [clickedPatient, setClickedPatient] = useState(
    patientsDataCopy?.filter((patient) => patient?.ID === clickedID)[0] || {}
  );

  useEffect(() => {
    setClickedPatient(
      patientsDataCopy?.filter((patient) => patient?.ID === clickedID)[0]
    );
    setPatientForm(
      patientsDataCopy?.filter((patient) => patient?.ID === clickedID)[0]
    );
  }, [clickedID]);

  const [patientForm, setPatientForm] = useState(clickedPatient || {});

  useEffect(() => {
    setPatientsDataCopy((prevArr) => {
      const updatePrevArr = prevArr?.map((patient) => {
        if (patient?.ID === clickedPatient?.ID) {
          return _.isEqual(patient, clickedPatient) ? patient : patientForm;
        } else {
          return patient;
        }
      });
      return updatePrevArr;
    });
    updatePatientsData(patientsDataCopy);
  }, [clickedPatient]);

  useEffect(() => {
    for (const name in patientForm) {
      if (patientForm[name]) {
        clickedPatient[name] = patientForm[name];
      }
    }
  }, [patientForm]);

  function handleChange(e) {
    switch (e.target.name) {
      case "Email":
        setPatientForm((prev) => ({
          ...prev,
          [e.target.name]: e.target.value,
        }));
        break;
      case "Phone":
        const inputPhoneNumber = e.target.value;
        const isValidPhoneNumber = /^[5]\d{8}$/.test(inputPhoneNumber);
        if (!isNumbersForPhone(e.target.value)) {
          alert("გამოიყენეთ მხოლოდ რიცხვები");
        } else if (e.target.value[0] !== "5") {
          alert("ნომერი უნდა იწყებოდეს 5-ით");
        } else if (isValidPhoneNumber || inputPhoneNumber === "") {
          setPatientForm((prev) => ({
            ...prev,
            [e.target.name]: formatPhone(inputPhoneNumber),
          }));
        } else {
          setPatientForm((prev) => ({
            ...prev,
            [e.target.name]: formatPhone(inputPhoneNumber),
          }));
          if (patientForm?.Phone?.length === 11) {
            alert("ნომერი უნდა იწყებოდეს 5-ით და შეიცავდეს 9 ციფრს");
          }
        }

        break;

      case "PersonalNumber":
      case "GenderID":
        if (!isNumbers(e.target.value)) {
          alert("გამოიყენეთ მხოლოდ რიცხვები");
        } else {
          setPatientForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }));
        }
        break;
      case "Dob":
        if (isValidDateDigits(e.target.value)) {
          setPatientForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }));
        } else {
          alert("შეიყვანეთ სწორი ფორმატი");
        }
        break;
      default:
        if (!isGeorgian(e.target.value)) {
          alert("გთხოვთ გამოიყენეთ ქართული სიმბოლოები");
        } else {
          setPatientForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }));
        }
        break;
    }
  }

  const patientsRows = patientsDataCopy?.map((patient) => {
    const patientGender =
      patient?.GenderID == 1
        ? "მამრობითი"
        : patient?.GenderID == 2
        ? "მდედრობითი"
        : "";
    if (
      (clickedID === patient?.ID && hasEditor) ||
      (clickedID === patient?.ID && isAdding)
    ) {
      return (
        <tr
          key={patient?.ID}
          id={patient?.ID}
          onClick={() => {
            if (clickedID !== patient.ID) {
              clickHandle(null);
            }
          }}
          className={`${
            clickedID === patient?.ID && "active"
          } cursor-default tr-inputs `}
        >
          <td>
            <input type="text" value={patient?.ID} disabled />
          </td>
          <td>
            <input
              name={`FullName`}
              type="text"
              value={patientForm?.FullName || ""}
              onChange={handleChange}
              required
            />
          </td>
          <td>
            <input
              name={`PersonalNumber`}
              type="text"
              value={patientForm?.PersonalNumber || ""}
              onChange={handleChange}
              maxLength={11}
            />
          </td>
          <td>
            <input
              name={`Dob`}
              placeholder="DD.MM.YYYY"
              type="text"
              value={patientForm?.Dob || ""}
              onChange={handleChange}
              required
              maxLength={10}
            />
          </td>
          <td>
            <select
              name={`GenderID`}
              value={patientForm?.GenderID === -1 ? 1 : patientForm?.GenderID}
              onChange={handleChange}
              onClick={handleChange}
            >
              <option value={1}>მამრობითი</option>
              <option value={2}>მდედრობითი</option>
            </select>
          </td>
          <td>
            <input
              name={`Email`}
              type="email"
              value={patientForm?.Email || ""}
              onChange={handleChange}
            />
          </td>
          <td>
            <input
              name={`Phone`}
              type="text"
              maxLength={11}
              value={
                patientForm?.Phone?.length === 0
                  ? "5"
                  : patientForm?.Phone || ""
              }
              onChange={handleChange}
            />
          </td>
          <td>
            <input
              name={`Address`}
              type="text"
              value={patientForm?.Address || ""}
              onChange={handleChange}
            />
          </td>
        </tr>
      );
    }
    return (
      <tr
        key={patient?.ID}
        id={patient?.ID}
        onClick={() => {
          if (clickedID === patient?.ID) {
            clickHandle(null);
          } else {
            clickHandle(patient?.ID);
          }
        }}
        className={`${
          clickedID === patient?.ID && "active"
        } cursor-default tr-inputs`}
      >
        <td>
          <p>{patient?.ID}</p>
        </td>
        <td>
          <p>{patient?.FullName}</p>
        </td>
        <td>
          <p>{patient?.PersonalNumber}</p>
        </td>
        <td>
          <p>{patient?.Dob}</p>
        </td>
        <td>
          <p>{patientGender}</p>
        </td>
        <td>
          <p>{patient?.Email}</p>
        </td>
        <td>
          <p>{patient?.Phone}</p>
        </td>
        <td>
          <p>{patient?.Address}</p>
        </td>
      </tr>
    );
  });

  return <tbody>{patientsRows}</tbody>;
}
