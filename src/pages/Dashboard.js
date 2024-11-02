import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
// import WidgetsDropdown from '../pages/widgets/WidgetsDropdown'

const Dashboard = () => {
  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Traffic & Sales</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs={6}>
                  <div className="border-start border-start-4 border-start-info py-1 px-3">
                    <div className="text-body-secondary text-truncate small">New Clients</div>
                    <div className="fs-5 fw-semibold">9,123</div>
                  </div>
                </CCol>
                <CCol xs={6}>
                  <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                    <div className="text-body-secondary text-truncate small">Recurring Clients</div>
                    <div className="fs-5 fw-semibold">22,643</div>
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
