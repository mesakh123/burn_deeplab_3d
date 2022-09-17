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
let curr_home = "/"
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
    if (
      location.state == null ||
      location.state == undefined ||
      curDatasetId == null ||
      curDatasetId == undefined
    ) {
      navigate("/upload/");
    }
  }, []);

  const [loopMutex, setLoopMutex] = useState(false);
  const [datasetStatus, setDatasetStatus] = useState(null);
  const [dataInfoId,setDataInfoId] = useState(-1);

    useEffect( async () => {
        console.log("loopMutex "+loopMutex);
        console.log("datasetId "+curDatasetId);
        console.log("datasetStatus "+datasetStatus);
        if(curDatasetId!=-1 && (datasetStatus==null || datasetStatus==="processing")){
            await axios.get(curr_home+"api/upload/"+curDatasetId+"/").
            then(function (response) {
                if(response.data.upload_status!=="processing"){
                    console.log("response.data.upload_status "+response.data.upload_status)
                    setDatasetStatus(response.data.upload_status);
                }
                else{
                    setLoopMutex(!loopMutex);
                }
            })
            .catch((error) => console.log(error));
        }

    },[loopMutex])

    useEffect(() => {
        if(curDatasetId!==-1 && datasetStatus!=="processing" && datasetStatus!=null){
            console.log("datasetStatus datasetStatus "+datasetStatus)
            if(datasetStatus==="completed"){
                startSwal.close();
                navigate("/result",{state:{datasetId: curDatasetId,dataInfoId:dataInfoId}});
            }
            else{
                console.log("errorswall")
                startSwal.close();
                errorSwal.fire({
                    title: <strong>Prediction Error</strong>,
                    html: <i>Error while predicting, please try again</i>,
                    icon:'error',
                })
            }
        }

    },[datasetStatus])






  const [medicianid, setMedicianId] = useState("");
  const [patientid, setPatientId] = useState("");
  const [age, setAge] = useState(0);

  const [gender, setGender] = useState(0);
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [typeoption, setTypeOption] = useState("");
  const [comments, setComments] = useState("");

  const startSwal = withReactContent(Swal);
  const errorSwal = withReactContent(Swal);

  const handleSubmit = async (e) => {
    startSwal.fire({
      title: <strong>Input Data</strong>,
      html: <i>sending data, please wait</i>,
      showCancelButton: false,
      showConfirmButton: false,
      allowOutsideClick: false,
    });
    e.preventDefault();
    let formField = new FormData();
    formField.append("medician_id", medicianid);
    formField.append("patient_id", patientid);
    formField.append("age", age);
    formField.append("sex", gender);
    formField.append("height", height);
    formField.append("weight", weight);
    formField.append("burn_type", typeoption);
    formField.append("comments", comments);

    await axios({
      method: "POST",
      url: "http://localhost:8000/api/datainfo/",
      data: formField,
    })
      .then((response) => {
        console.log(response.data);
        setDataInfoId(response.data.id);
        setLoopMutex(!loopMutex);

      })
      .catch((error) => {
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
        <h2>請輸入病人資料</h2>
      </div>
      <div className="col-12 text-center my-3 d-flex justify-content-center">
        <Form onSubmit={handleSubmit} id="patientForm">
          <Form.Group className="mb-3 row mx-auto d-flex justify-content-center">
            <Form.Label className="col-5 font-weight-bold align-self-center">
              員工編號
            </Form.Label>
            <Form.Control
              required
              id="medicianid"
              className="col form-control"
              type="text"
              placeholder="輸入醫護人員ID"
              onChange={(e) => setMedicianId(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3 row mx-auto  d-flex justify-content-center">
            <Form.Label className="col-5 font-weight-bold align-self-center">
              病歷號
            </Form.Label>
            <Form.Control
              required
              id="patientid"
              className="col form-control"
              type="text"
              placeholder="輸入病人ID"
              onChange={(e) => setPatientId(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3 row mx-auto  d-flex justify-content-center">
            <Form.Label className="col-5 font-weight-bold align-self-center">
              年齡
            </Form.Label>
            <Form.Control
              required
              id="age"
              name="age"
              className="col form-control"
              type="number"
              placeholder="輸入年齡"
              onChange={(e) => setAge(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3 row mx-auto  d-flex justify-content-center">
            <Form.Label className="col-5 font-weight-bold align-self-center">
              性別
            </Form.Label>
            <Form.Select
              required
              className="col form-control"
              id="gender"
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="f">女 (F)</option>
              <option value="m">男 (M)</option>
              <option value="o">其他 (Others)</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3 row mx-auto  d-flex justify-content-center">
            <Form.Label className="col-5 font-weight-bold align-self-center">
              身高
            </Form.Label>
            <Form.Control
              required
              id="height"
              className="col form-control"
              type="number"
              placeholder="輸入身高(公分)"
              onChange={(e) => setHeight(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3 row mx-auto  d-flex justify-content-center">
            <Form.Label className="col-5 font-weight-bold align-self-center">
              體重
            </Form.Label>
            <Form.Control
              required
              id="weight"
              name="weight"
              className="col form-control"
              type="number"
              placeholder="輸入體重(公斤)"
              onChange={(e) => setWeight(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3 row mx-auto  d-flex justify-content-center">
            <Form.Label className="col-5 font-weight-bold align-self-center">
              類別
            </Form.Label>
            <Form.Select
              required
              className="col form-control"
              id="typeoption"
              onChange={(e) => setTypeOption(e.target.value)}
            >
              <option value="scald">Scald</option>
              <option value="grease">Grease</option>
              <option value="contact">Contact</option>
              <option value="flame">Flame</option>
              <option value="chemical">Chemical</option>
              <option value="electric">Electric </option>
              <option value="other">Other</option>
            </Form.Select>
          </Form.Group>

          <InputGroup className="mb-3 row mx-auto  d-flex justify-content-center">
            <Form.Label className="col-5 font-weight-bold align-self-center">
              備註
            </Form.Label>
            <Form.Control
              as="textarea"
              className="col"
              id="comments"
              name="comments"
              placeholder="備註"
              onChange={(e) => setComments(e.target.value)}
            />
          </InputGroup>

          <Form.Group className="mb-3 row mx-auto  d-flex justify-content-center">
            <Button variant="secondary mr-2"> 清除 </Button>
            <Button variant="primary" type="submit">
              送出
            </Button>
          </Form.Group>
        </Form>
      </div>
    </>
  );
}

export default InputData;
