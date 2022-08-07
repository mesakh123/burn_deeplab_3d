import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ResultRender from './ResultRender';

function ResultVisualize({datasetId}) {

    const [dataset,setDataset] = useState(null);
    const [datafiles,setDatafiles] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);
    const [loopMutex, setLoopMutex] = useState(true);
    const [curDatasetId, setCurDatasetID] = useState(1);
    const navigate = useNavigate();
    const base_url = "http://127.0.0.1:8080";
    const errorSwal = withReactContent(Swal);

    const [render_files_type,setRenderFilesType] = useState([]);
    const [render_files, setRenderFiles] = useState([]);

    const FILE_ALLOWED_TYPES = ["texture","obj","mtl"];

    useEffect(() => {
        console.log("datasetId: "+curDatasetId)
        if(curDatasetId == null){
            console.log("datasetId: "+curDatasetId)
            navigate("/upload/result/");
        }
        if(datafiles.length==0 || isError == false){
            axios.get(base_url+"/api/upload/"+curDatasetId+"/").
            then(function (response) {
                console.log("ResultVisualize response : " + JSON.stringify(response));
                setDatafiles(response.data.files);
                setDataset(response.data.dataset_uuid);
                setLoading(false);
            })
            .catch(
                (error) => {
                    console.log(error);
                    setError(true);
                    errorSwal.fire({
                        title: <strong>Prediction Error</strong>,
                        html: <i>`$error`</i>,
                        icon:'error',
                    })
                }

            );
        }
    },[loopMutex]);


    useEffect(() => {
        console.log("changed datafiles: "+JSON.stringify(datafiles));
        Object.values(datafiles).map(function(data) {

            let new_data = data;
            let isExist = render_files_type.some(element=> element==new_data['type'])
            if(new_data && isExist!=true) {
                console.log("newdata_type "+new_data['type'])
                if(FILE_ALLOWED_TYPES.includes(new_data['type'])) {
                    setRenderFiles(prevData=>{
                        return {
                            ...prevData,[new_data['type']]:new_data['file']}
                        }
                    )
                    setRenderFilesType(prevData=>[ ...prevData,new_data['type']])
                }
            }

        })

    },[datafiles]);


    if (isLoading || datafiles == null) {
        return <div className="App">Loading...</div>;
    }
    let data_array = {};

    Object.keys(render_files).map(function(key){
        let new_data =  render_files[key];
        if(!(key  in data_array)) {
            data_array[key]= new_data;
        }
    })


    return (
    <div className='row no-gutters  no-gutters'>
        <div className='col-12 text-center'>
                Dataset UUID : {
                    dataset
                }
        </div>
        <div  className="col-12 py-2 d-flex justify-content-center">
        {
            render_files && render_files_type.length==3 ?

            <ResultRender data_array={data_array}/>
            :

            <p>Can't render data</p>

        }
        </div>
    </div>
    )
}

export default ResultVisualize
