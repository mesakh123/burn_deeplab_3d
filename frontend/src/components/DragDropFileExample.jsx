import React,{useEffect, useState, useReducer} from 'react'
import {ContactContext} from '../contexts/ContactContext';
import {useCookieConsentDispatch,useCookieConsentState} from "../features/cookie/CookieConsent"
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import { getDroppedOrSelectedFiles } from 'html5-file-selector'
import styled from 'styled-components';
import axios from "axios";
function ContactData() {
    const COOKIE_NAME = 'file_upload'

    function getCookie() {
        const regex = new RegExp(`(?:(?:^|.*;\\s*)${COOKIE_NAME}\\s*\\=\\s*([^;]*).*$)|^.*$`)
        const cookie = document.cookie.replace(regex, "$1")
        return cookie.length ? JSON.parse(cookie) : undefined
    }

    // Initial value is cookie value OR prefered value but not yet set
    let initialCookieValue = getCookie() || {
        file_list:[]
    }
    for(let i = 0; i < initialCookieValue.file_list.length; i++){
        console.log(initialCookieValue.file_list[i])
    }
    const [fileList,setFileList] = useState(initialCookieValue.file_list);


    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
          case 'uploadData':
            if (state.file_list.length>3){
                state.file_list = state.file_list.shift();
            }
            console.log("dispatch action")
            if (state.file_list.length <=0){
                console.log({
                    ...state,
                    file_list: action.payload
                  });

                return{
                    ...state,
                    file_list: action.payload
                  }
            }
            console.log({
                ...state,
                file_list: action.payload
            });
            return {
                ...state,
                file_list: action.payload
            }
          case 'declineAll':
            return {
                file_list:[]
            }
          case 'showCookiePopup':
            return state
          default:
            throw new Error()
        }
      }, initialCookieValue)

    // Update the cookie when state changes
    useEffect(() => {
        document.cookie = `${COOKIE_NAME}=${JSON.stringify(state)}`
    }, [state])



    const fileParams = ({ meta }) => {
        return { url: 'https://httpbin.org/post' }
    }

    const onFileChange = ({ meta, file }, status) => {
        if(status=="done"){
            while(fileList.length >=3 ){
                setFileList(fileList.shift());
            }
            fileList.push(file);
            dispatch({
                type: "uploadData",
                payload: fileList
            });
            setFileList(fileList);
        }
    }

    const onSubmit = (files, allFiles) => {
        let formData = new FormData();
        let formFiles = [];
        files.map( f=>{
            formData.append("files", f.file)
        }
        );

        axios.post('/api/upload/',formData,
            {headers:{
                'Content-Type': 'multipart/form-data',
            }}
        )
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    const getFilesFromEvent = e => {
        console.log("getFilesFromEvent")
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

    const Preview = ({ meta }) => {
        const { name, percent, status } = meta
        return (
        <span style={{ alignSelf: 'flex-start', margin: '10px 3%', fontFamily: 'Helvetica' }}>
            {name}, {Math.round(percent)}%, {status}
        </span>
        )
    };
    return (
        <div className="p-2 text-center d-flex justify-content-center">
            <div className="col-6">
            <Dropzone
                    className="row"
                    onSubmit={onSubmit}
                    onChangeStatus={onFileChange}
                    getUploadParams={fileParams}
                    getFilesFromEvent={getFilesFromEvent}
                    InputComponent={selectFileInput}
                    accept=".jpg, .jpeg, .png, .obj, .mtl"
                    maxFiles={3}
                    inputContent={(files, extra) => (extra.reject ? 'Only Image, obj and mtl are accepted!' : 'Select and Drop Files')}
                    // PreviewComponent={Preview}
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

export default ContactData
