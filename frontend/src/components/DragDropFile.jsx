import React, {useCallback, useEffect, useState} from 'react';
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import { getDroppedOrSelectedFiles } from 'html5-file-selector'
import styled from 'styled-components';
import axios from "axios";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useNavigate } from 'react-router-dom';
import {AiOutlinePause,AiOutlinePlayCircle,AiOutlineCloseCircle,AiOutlineFileDone} from "react-icons/ai";


const iconByFn = {
    cancel: { backgroundImage: `url(${AiOutlinePause})` },
    remove: { backgroundImage: `url(${AiOutlineCloseCircle})` },
    restart: { backgroundImage: `url(${AiOutlinePlayCircle})` },
}


function DragDropFile() {
    const navigate = useNavigate();
    const startSwal = withReactContent(Swal);
    const errorSwal = withReactContent(Swal);
    const [datasetStatus, setDatasetStatus] = useState(null);
    const [datasetId, setDatasetId] = useState(-1);
    const [loopMutex, setLoopMutex] = useState(false);

    let curr_home = "/";
    // useEffect(() => {
    //     if(datasetId!==-1 && datasetStatus!=="processing" && datasetStatus!=null){
    //         console.log("datasetStatus datasetStatus "+datasetStatus)
    //         if(datasetStatus==="completed"){
    //             startSwal.close();
    //             navigate("/upload/inputdata",{state:{datasetId: datasetId}});
    //         }
    //         else{
    //             console.log("errorswall")
    //             startSwal.close();
    //             errorSwal.fire({
    //                 title: <strong>Prediction Error</strong>,
    //                 html: <i>Error while predicting, please try again</i>,
    //                 icon:'error',
    //             })
    //         }
    //     }

    // },[datasetStatus])

    useEffect(() => {
        if(datasetId!==-1){
            navigate("/upload/inputdata",{state:{datasetId: datasetId}});
            // axios.get(curr_home+"api/upload/"+datasetId+"/").
            // then(function (response) {

            //     console.log("getdataset response: " + JSON.stringify(response));
            //     setDatasetStatus(response.data.upload_status);
            //     setLoopMutex(!loopMutex);
            // })
            // .catch((error) => console.log(error));
        }

    },[datasetId]);


    // useEffect(() => {
    //     console.log("loopMutex "+loopMutex);
    //     console.log("datasetId "+datasetId);
    //     console.log("datasetStatus "+datasetStatus);
    //     if(datasetId!=-1 && (datasetStatus==null || datasetStatus==="processing")){
    //         axios.get(curr_home+"api/upload/"+datasetId+"/").
    //         then(function (response) {
    //             console.log("getdataset response datasetStatus: " + JSON.stringify(response));
    //             if(response.data.upload_status!=="processing"){
    //                 console.log("response.data.upload_status "+response.data.upload_status)
    //                 setDatasetStatus(response.data.upload_status);
    //             }
    //             else{
    //                 setLoopMutex(!loopMutex);
    //             }
    //         })
    //         .catch((error) => console.log(error));
    //     }

    // },[loopMutex])

    const fileParams = ({ meta }) => {
        return { url: 'https://httpbin.org/post' }
    }

    const onFileChange = ({ meta, file }, status) => {
        console.log(status, meta, file)
    }

    const onSubmit = async (files, allFiles) => {

        let formData = new FormData();


        if(files.length <3) {
            console.log("Need 3 files ( Image, .obj and .mtl files)")
            startSwal.fire({
                title: <strong>File Count Error!</strong>,
                html: <i>Need 3 files ( Image, .obj and .mtl files)!</i>,
                icon: 'error'
            })
            return;
        }
        files.map( f=>{
                formData.append("files", f.file)
            }
        );

        allFiles.forEach(f => f.remove());

        // startSwal.fire({
        //     title: <strong>Prediction started</strong>,
        //     html: <i>prediction is running, please wait</i>,
        //     showCancelButton: false,
        //     showConfirmButton: false,
        //     allowOutsideClick: false,
        // })

        await axios.post(
            // "https://httpbin.org/post",
            curr_home+'api/upload/',
            formData,
            {headers:{
                'Content-Type': 'multipart/form-data',
            }}
        )
          .then(function (response) {

            console.log("response: " + JSON.stringify(response));
            console.log("response.status: "+response.status);
            console.log("response.data.id: "+response.data.id);
            if(response.data.id && datasetId==-1){
                setDatasetId(response.data.id);
            }
          })
          .catch(function (error) {
            startSwal.close();
            errorSwal.fire({
                title: <strong>Prediction Error</strong>,
                html: <i>{error.message}, please try again</i>,
                icon:'error',
            })
            console.log(error);
        });

    }

    const getFilesFromEvent = e => {
        return new Promise(resolve => {
            getDroppedOrSelectedFiles(e).then(chosenFiles => {
                resolve(chosenFiles.map(f => f.fileObject))
            })
        })
    }

    const P = styled.p`
        color: #2484FF;
        bold: true;
        font-weight: 660;
    `

    const selectFileInput = ({ accept, onFiles, files, getFilesFromEvent }) => {
        const textMsg = files.length > 0 ? 'Upload Again' : 'Select Files';

        return (
            <>

            <P>
                Drag 'n drop files here or click select files
            </P>
            <label className="btn btn-danger">
                {textMsg}
                <input
                    style={{ display: 'none' }}
                    type="file"
                    accept={accept}
                    multiple
                    onChange={e => {
                        getFilesFromEvent(e).then(chosenFiles => {
                            onFiles(chosenFiles)
                        })
                    }}
                />
            </label>

            </>



        )
    }

    const Preview = ({className,style, meta,
        fileWithMeta,extra, canCancel,
        canRemove,
        canRestart}) => {
        const {isUpload, name, percent, status, previewUrl} = meta
        const { cancel, remove, restart } = fileWithMeta
        if (status === 'error_file_size' || status === 'error_validation') {
            return (
              <div className={className} style={style}>
                {status === 'error_file_size' && <span>{meta.size < extra.minSizeBytes ? 'File too small' : 'File too big'}</span>}
                {status === 'error_validation' && <span>{String(meta.validationError)}</span>}
                {canRemove && <span className="dzu-previewButton" onClick={remove}><AiOutlinePause/></span>}
              </div>
            )
        }
        if (status === 'error_upload_params' || status === 'exception_upload' || status === 'error_upload') {
            name = `${name} (upload failed)`
          }
        if (status === 'aborted') name = `${name} (cancelled)`
        return (
            <div className="dzu-previewStatusContainer col py-3">
                <div className='col-6'>
                    {previewUrl &&
                        <img className="imagePreview" alt={name} src={previewUrl}/>
                    }
                    {!previewUrl && <span className="dzu-previewImage" ><AiOutlineFileDone  size={70}></AiOutlineFileDone></span>}
                    <label>{name}</label>
                </div>
                <div className="col-6">
                    <div className="row d-flex justify-content-center">
                        {Math.round(percent)} %
                    </div>
                    <div className="row d-flex justify-content-center">
                        <progress max="100" value={Math.round(percent)}></progress>
                    </div>
                    <div className="row d-flex justify-content-center">
                        {status === 'uploading' && canCancel && (
                            <span className="dzu-previewButton"onClick={cancel}>
                                <AiOutlinePause  size={25}></AiOutlinePause>
                            </span>
                        )}
                        {status !== 'preparing' && status !== 'getting_upload_params' && status !== 'uploading' && canRemove && (
                            <span className="dzu-previewButton"  onClick={remove} >

                                <AiOutlineCloseCircle  size={25}></AiOutlineCloseCircle>
                            </span>
                        )}
                        {['error_upload_params', 'exception_upload', 'error_upload', 'aborted', 'ready'].includes(status) &&
                            canRestart && <span className="dzu-previewButton" onClick={restart}>
                                <AiOutlinePlayCircle  size={25}></AiOutlinePlayCircle>
                        </span>}


                    </div>
                </div>

            </div>

        )
    };
    return (
        <div className="p-2 text-center d-flex justify-content-center">
            <div className="col-12">
            <Dropzone
                    className="row"
                    onSubmit={onSubmit}
                    PreviewComponent={Preview}
                    onChangeStatus={onFileChange}
                    getUploadParams={fileParams}
                    getFilesFromEvent={getFilesFromEvent}
                    InputComponent={selectFileInput}
                    accept=".jpg, .jpeg, .png, .obj, .mtl"
                    maxFiles={3}
                    inputContent={
                        (files, extra) => (extra.reject ? 'Only Image, obj and mtl are accepted!' : 'Select and Drop Files')
                    }
                    styles={{
                        dropzone: {overflow: "auto", border: "1px solid #54a251"},
                        dropzoneActive: { borderColor: 'green' },
                        inputLabel: (files, extra) => (extra.reject ? { color: '#A02800' } : {}),
                    }}
                />
            </div>


        </div>

    );
}

export default DragDropFile
