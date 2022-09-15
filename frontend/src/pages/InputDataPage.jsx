import React from 'react'
import { Routes,Route,Switch,useRouteMatch} from 'react-router-dom'
import InputData from '../components/InputData'

function InfoDataPage() {
  return (



    <Routes>
      <Route path="/" element={<InputData />} >
      </Route>
    </Routes>
  )
}

export default InfoDataPage
