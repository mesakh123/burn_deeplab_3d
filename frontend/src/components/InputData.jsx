import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function InputData() {
  // let curr_home = "http://localhost:8080/";
  let curr_home = "/";
  const navigate = useNavigate();

  const location = useLocation();
  const [curDatasetId, setCurDatasetID] = useState(
    location.state
      ? location.state.datasetId
        ? location.state.datasetId
        : null
      : null
  );
  useEffect(() => {
    if (curDatasetId == null || curDatasetId == undefined) {
      navigate("/upload/");
    } else {
      axios
        .get(curr_home + "api/upload/" + curDatasetId + "/")
        .then(function (response) {
          console.log(
            "useEffect[] response.data.upload_status " +
              response.data.upload_status
          );
          setDatasetStatus(response.data.upload_status);
        })
        .catch((error) => {
          console.log("ERROR");
          console.log(error);
        });
    }
  }, []);

  const [loopMutex, setLoopMutex] = useState(false);
  const [datasetStatus, setDatasetStatus] = useState(null);
  const [dataInfoId, setDataInfoId] = useState(-1);

  useEffect(() => {
    console.log("loopMutex " + loopMutex);
    console.log("datasetId " + curDatasetId);
    console.log("datasetStatus " + datasetStatus);

    if (curDatasetId != -1 && dataInfoId != -1) {
      axios
        .get(curr_home + "api/upload/" + curDatasetId + "/")
        .then(function (response) {
          if (response.data.upload_status === "completed") {
            console.log("done");
            console.log(
              "response.data.upload_status " + response.data.upload_status
            );
            setDatasetStatus(response.data.upload_status);
          } else {
            console.log("Here");
            console.log(
              "response.data.upload_status " + response.data.upload_status
            );
            setLoopMutex(!loopMutex);
          }
        })
        .catch((error) => {
          console.log("ERROR");
          console.log(error);
        });
    }
  }, [loopMutex]);

  useEffect(() => {
    if (dataInfoId != -1) {
      if (datasetStatus === "completed") {
        startSwal.close();
        console.log("curDatasetId " + curDatasetId);
        console.log("dataInfoId " + dataInfoId);
        navigate("/upload/result/", {
          state: { datasetId: curDatasetId, dataInfoId: dataInfoId },
        });
      } else {
        startSwal.close();
        errorSwal.fire({
          title: <strong>Prediction Error</strong>,
          html: <i>Error while predicting, please try again</i>,
          icon: "error",
        });
      }
    }
  }, [datasetStatus]);

  const [medicianid, setMedicianId] = useState("");
  const [patientid, setPatientId] = useState("");
  const [age, setAge] = useState(0);

  const [gender, setGender] = useState(0);
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [typeoption, setTypeOption] = useState("s");
  const [comments, setComments] = useState("");

  const startSwal = withReactContent(Swal);
  const errorSwal = withReactContent(Swal);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formField = new FormData();
    formField.append("burn_type", typeoption);
    formField.append("comments", comments);
    formField.append("patient_id", patientid);
    formField.append("medician_id", medicianid);
    formField.append("sex", gender);
    formField.append("age", age);
    formField.append("height", height);
    formField.append("weight", weight);

    console.log("medician_id " + medicianid);
    console.log("patient_id " + patientid);
    console.log("age " + age);
    console.log("sex " + gender);
    console.log("height " + height);
    console.log("weight " + weight);
    console.log("burn_type " + typeoption);
    console.log("comments " + comments);
    startSwal.fire({
      title: <strong>Input Data</strong>,
      html: <i>sending data, please wait</i>,
      showCancelButton: false,
      showConfirmButton: false,
      allowOutsideClick: false,
    });
    await axios
      .post(curr_home + "api/datainfo/", formField, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        console.log("post response data :" + JSON.stringify(response.data));
        setDataInfoId(response.data.id);
        setLoopMutex(!loopMutex);
      })
      .catch((error) => {
        console.log(error);
        startSwal.close();
        errorSwal.fire({
          title: <strong>Input data error</strong>,
          html: <i>{error.message}, please try again</i>,
          icon: "error",
        });
      });
  };

  return (
    <>
      <div className="col-12 my-2 text-center">
        <h2>?????????????????????</h2>
      </div>
      <div className="col-12 text-center my-3 d-flex justify-content-center">
        <Form onSubmit={handleSubmit} id="patientForm">
          <Form.Group className="mb-3 row mx-auto d-flex justify-content-center">
            <Form.Label className="col-5 font-weight-bold align-self-center">
              ????????????
            </Form.Label>
            <Form.Control
              required
              id="medicianid"
              className="col form-control"
              type="text"
              placeholder="??????????????????ID"
              onChange={(e) => setMedicianId(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3 row mx-auto  d-flex justify-content-center">
            <Form.Label className="col-5 font-weight-bold align-self-center">
              ?????????
            </Form.Label>
            <Form.Control
              required
              id="patientid"
              className="col form-control"
              type="text"
              placeholder="????????????ID"
              onChange={(e) => setPatientId(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3 row mx-auto  d-flex justify-content-center">
            <Form.Label className="col-5 font-weight-bold align-self-center">
              ??????
            </Form.Label>
            <Form.Control
              required
              id="age"
              name="age"
              className="col form-control"
              type="number"
              placeholder="????????????"
              onChange={(e) => setAge(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3 row mx-auto  d-flex justify-content-center">
            <Form.Label className="col-5 font-weight-bold align-self-center">
              ??????
            </Form.Label>
            <Form.Select
              required
              className="col form-control"
              id="gender"
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="f">??? (F)</option>
              <option value="m">??? (M)</option>
              <option value="o">?????? (Others)</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3 row mx-auto  d-flex justify-content-center">
            <Form.Label className="col-5 font-weight-bold align-self-center">
              ??????
            </Form.Label>
            <Form.Control
              required
              id="height"
              className="col form-control"
              type="number"
              placeholder="????????????(??????)"
              onChange={(e) => setHeight(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3 row mx-auto  d-flex justify-content-center">
            <Form.Label className="col-5 font-weight-bold align-self-center">
              ??????
            </Form.Label>
            <Form.Control
              required
              id="weight"
              name="weight"
              className="col form-control"
              type="number"
              placeholder="????????????(??????)"
              onChange={(e) => setWeight(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3 row mx-auto  d-flex justify-content-center">
            <Form.Label className="col-5 font-weight-bold align-self-center">
              ??????
            </Form.Label>
            <Form.Select
              required
              className="col form-control"
              id="typeoption"
              default={typeoption}
              onChange={(e) => setTypeOption(e.target.value)}
            >
              <option value="s">Scald</option>
              <option value="g">Grease</option>
              <option value="c">Contact</option>
              <option value="f">Flame</option>
              <option value="c">Chemical</option>
              <option value="e">Electric </option>
              <option value="o">Other</option>
            </Form.Select>
          </Form.Group>

          <InputGroup className="mb-3 row mx-auto  d-flex justify-content-center">
            <Form.Label className="col-5 font-weight-bold align-self-center">
              ??????
            </Form.Label>
            <Form.Control
              as="textarea"
              className="col"
              id="comments"
              name="comments"
              placeholder="??????"
              onChange={(e) => setComments(e.target.value)}
            />
          </InputGroup>

          <Form.Group className="mb-3 row mx-auto  d-flex justify-content-center">
            <Button variant="secondary mr-2"> ?????? </Button>
            <Button variant="primary" type="submit">
              ??????
            </Button>
          </Form.Group>
        </Form>
      </div>
    </>
  );
}

export default InputData;
