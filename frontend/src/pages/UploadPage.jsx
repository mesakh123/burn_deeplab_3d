import React from 'react'
import { Routes,Route,Switch,useRouteMatch} from 'react-router-dom'
import DragDropFile from '../components/DragDropFile'
import ResultVisualize from '../components/ResultVisualize'

function UploadPage() {
  // The `path` lets us build <Route> paths that are
  // relative to the parent route, while the `url` lets
  // us build relative links.

  return (

    <Routes>
      <Route path="/" element={<DragDropFile />} >
      </Route>
      <Route path="/result" element={<ResultVisualize />} >
      </Route>
    </Routes>


  )
}

export default UploadPage
