import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Table from 'react-bootstrap/Table';


function ResultVisualize({datasetId}) {

    const [dataset,setDataset] = useState(null);
    const [datafiles,setDatafiles] = useState([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("/api/upload/"+datasetId+"/datafiles/").
        then(function (response) {
            console.log("ResultVisualize response : " + JSON.stringify(response));
            setDatafiles(response.data.files);
            setDataset(response.data.dataset.dataset_uuid);
            setLoading(false);
        })
        .catch((error) => console.log(error));
    },[]);

    useEffect(() => {
        console.log("changed datafiles: "+datafiles);
    },[datafiles]);


    if (isLoading || !datafiles) {
        return <div className="App">Loading...</div>;
    }
    return (
    <>
        <div className="row pt-2">
            <div className='col-12 text-center'>
                Dataset UUID : {
                    dataset
                }
            </div>
            <Table striped bordered hover>
                <tr>
                    <img src={datafiles.texture.file}></img>
                </tr>
{/*
                {
                    Object.keys(datafiles).map(keys => {
                        return (
                            <tr>
                                {
                                    datafiles[keys] && Object.keys(datafiles[keys]).map(keyInternal => {

                                        return (
                                            <td>{keyInternal} : {datafiles[keys][keyInternal]}</td>
                                        )
                                        })
                                }
                            </tr>

                        )

                    })
                } */}
            </Table>

        </div>
    </>
    )
}

export default ResultVisualize
