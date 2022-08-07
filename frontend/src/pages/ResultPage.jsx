import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import ResultVisualize from '../components/ResultVisualize';
function ResultPage() {

    const location= useLocation();
    const [datasetStatus,setDatasetStatus] = useState(null);
    const [datasetId,setDatasetId] = useState(-1);
    const navigate = useNavigate();

    useEffect(() => {
        if("state" in location && location.state){
            setDatasetStatus(location.state.datasetStatus);
            setDatasetId(location.state.datasetId);
        }
        navigate(location.pathname, {});
    },[]);

    if (datasetStatus){

        return (
            <ResultVisualize datasetId={datasetId}> </ResultVisualize>
        )
    }
    else{
        return navigate("/upload");
    }

}

export default ResultPage
