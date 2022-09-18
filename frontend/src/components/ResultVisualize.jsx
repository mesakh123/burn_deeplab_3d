import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ResultRender from "./ResultRender";
import { useLocation } from "react-router-dom";
function ResultVisualize() {
  const location = useLocation();
  const navigate = useNavigate();

  const [dataset, setDataset] = useState(null);
  const [gt_data, setGtData] = useState([]);
  const [predict_data, setPredictData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const [loopMutex, setLoopMutex] = useState(true);
  const [curDatasetId, setCurDatasetID] = useState(
    location.state
      ? location.state.datasetId
        ? location.state.datasetId
        : null
      : null
  );
  const [curDataInfoId, setCurDataInfoID] = useState(
    location.state
      ? location.state.dataInfoId
        ? location.state.dataInfoId
        : null
      : null
  );

  const base_url = "/";
  //   const base_url = "http://localhost:8080/";
  //   const [curDatasetId, setCurDatasetID] = useState(9);
  //   const [curDataInfoId, setCurDataInfoID] = useState(2);

  const errorSwal = withReactContent(Swal);

  const [render_files_type, setRenderFilesType] = useState([]);
  const [render_files, setRenderFiles] = useState([]);

  const FILE_ALLOWED_TYPES = ["texture", "obj", "mtl"];

  // if(location.state == null || location.state==undefined) {
  //     navigate("/upload/");
  // }

  // useEffect(() => {
  //     if (location.state == null || location.state==undefined) {
  //       navigate("/upload/");
  //     }
  //   }, []);

  let [patientId, setPatientId] = useState("");
  let [medicianId, setMedicianId] = useState("");
  let [patientAge, setPatientAge] = useState(0);
  let [patientSex, setPatientSex] = useState("");
  let [patientHeight, setPatientHeight] = useState(0);
  let [patientWeight, setPatientWeight] = useState(0);
  let [patientComments, setDataComments] = useState("");
  let [patientBurnType, setDataBurnType] = useState("");

  useEffect(() => {
    if (
      curDatasetId == -1 ||
      curDatasetId == null ||
      curDatasetId == undefined ||
      curDataInfoId == -1 ||
      curDataInfoId == null ||
      curDataInfoId == undefined
    ) {
      console.log("datasetId: " + curDatasetId);
      navigate("/upload/");
    } else {
      if (gt_data.length == 0 || isError == false) {
        console.log("curDatasetId " + curDatasetId);
        axios
          .get(base_url + "api/upload/" + curDatasetId + "/")
          .then(function (response) {
            console.log(
              "ResultVisualize response : " + JSON.stringify(response)
            );

            setGtData(response.data.gt_files);
            setPredictData(response.data.pt_files);
            setDataset(response.data.dataset_uuid);
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setError(true);
            errorSwal.fire({
              title: <strong>Prediction Error</strong>,
              html: <i>{error.message}, please try again</i>,
              icon: "error",
            });
          });

        axios
          .get(base_url + "api/datainfo/" + curDataInfoId + "/")
          .then(function (response) {
            console.log(
              "ResultVisualize response : " + JSON.stringify(response)
            );

            setPatientId(response.data.patient.patient_id);
            setMedicianId(response.data.medician.medician_id);
            setPatientAge(response.data.patient.age);
            setPatientSex(response.data.patient.sex);
            setPatientHeight(response.data.patient.height);
            setPatientWeight(response.data.patient.weight);
            setDataComments(response.data.comments);
            let burn_type = {
              s: "Scald",
              g: "Grease",
              c: "Contact",
              f: "Flame",
              c: "Chemical",
              e: "Electric",
              o: "Other",
            };
            setDataBurnType(burn_type[response.data.burn_type]);
          })
          .catch((error) => {
            console.log(error);
            setError(true);
            errorSwal.fire({
              title: <strong>Prediction Error</strong>,
              html: <i>{error.message}, please try again</i>,
              icon: "error",
            });
          });
      }
    }
  }, [loopMutex]);

  useEffect(() => {
    console.log("changed gt_data: " + JSON.stringify(gt_data));
    Object.values(gt_data).map(function (data) {
      let new_data = data;
      let isExist = render_files_type.some(
        (element) => element == new_data["type"]
      );
      if (new_data && isExist != true) {
        console.log("newdata_type " + new_data["type"]);
        if (FILE_ALLOWED_TYPES.includes(new_data["type"])) {
          setRenderFiles((prevData) => {
            return {
              ...prevData,
              [new_data["type"]]: new_data["file"],
            };
          });
          setRenderFilesType((prevData) => [...prevData, new_data["type"]]);
        }
      }
    });
  }, [gt_data]);

  useEffect(() => {
    console.log("changed predict_data: " + JSON.stringify(predict_data));
    Object.values(predict_data).map(function (data) {
      let new_data = data;
      console.log("data: " + JSON.stringify(new_data));
      setRenderFiles((prevData) => {
        return {
          ...prevData,
          ["texture"]: new_data["file"],
        };
      });
    });
  }, [predict_data]);

  if (isLoading || gt_data == null) {
    return <div className="App">Loading...</div>;
  }
  let data_array = {};

  Object.keys(render_files).map(function (key) {
    let new_data = render_files[key];
    if (!(key in data_array)) {
      data_array[key] = new_data;
    }
  });

  return (
    <div className="row no-gutters  no-gutters">
      <div className="col-12 text-center">Dataset UUID : {dataset}</div>
      <div className="col-12 py-2 d-flex justify-content-center">
        {render_files && render_files_type.length == 3 ? (
          <ResultRender data_array={data_array} />
        ) : (
          <p>Can't render data</p>
        )}
      </div>
      <div className="col text-center mt-3">
        <div className="col-lg-6 col-12 mx-auto ">
          <h4>Data Info</h4>
          <Table striped bordered hover>
            <tbody>
              <tr>
                <td>病歷號</td>
                <td>{patientId}</td>
              </tr>
              <tr>
                <td>員工編號</td>
                <td>{medicianId}</td>
              </tr>
              <tr>
                <td>年齡</td>
                <td>{patientAge}</td>
              </tr>
              <tr>
                <td>性別</td>
                <td>{patientSex}</td>
              </tr>
              <tr>
                <td>身高</td>
                <td>{patientHeight}</td>
              </tr>
              <tr>
                <td>體重</td>
                <td>{patientWeight}</td>
              </tr>
              <tr>
                <td>類別</td>
                <td>{patientBurnType}</td>
              </tr>
              <tr>
                <td>備註</td>
                <td>{patientComments}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default ResultVisualize;
