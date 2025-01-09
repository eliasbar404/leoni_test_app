// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// // import React from 'react';
// import React, { Suspense } from 'react';
// import { useState, useEffect } from 'react';

// import LoginPage from './pages/LoginPage';
// import Dashboard from './pages/admin/Dashboard';
// // import FormateurDashboard from './pages/formateur/Dashboard';
// import OperateurDashboard from './pages/operateur/Dashboard';
// // import AdminProfile from './components/AdminProfile';
// // import ManageUsers from './components/ManageUsers';
// // import UsersTable from './components/UsersTable';
// // import Tests from './components/Tests';
// // import CreateTests from './components/CreateTests';
// import ProfilePage from './pages/admin/ProfilePage';
// import UpdateProfilePage from './pages/admin/UpdateProfilePage';
// import UsersPage from './pages/admin/UsersPage';
// import CreateUsersPage from './pages/admin/CreateUsersPage';
// import CreateTestsPage from './pages/admin/CreateTestsPage';
// import { TestsListPage } from './pages/admin/TestsListPage';
// import { HomePage } from './pages/admin/HomePage';
// import OperateurProfilePage from './pages/operateur/OperateurProfilePage';
// import UpdateOperateurProfilePage from './pages/operateur/UpdateOperateurProfilePage';
// import TestPage from './pages/operateur/TestPage';
// import OperateurHomePage from './pages/operateur/OperateurHomePage';


// // import OperateursPage from './pages/formateur/OperateursPage';
// // import FormateurProfilePage from './pages/formateur/FormateruProfilePage';
// // import FormateurProfileUpdatePagee from './pages/formateur/FormateurProfileUpdatePage';
// // import CreateOperateurPage from './pages/formateur/CreateOperateursPage';
// import { FormateurTestPage } from './pages/formateur/FormateurTestPage';
// // import FormateurCreateTestsPage from './pages/formateur/FormateurCreateTestsPage';
// // Lazy loading components
// const FormateurDashboard = React.lazy(() => import('./pages/formateur/Dashboard'));
// const FormateurProfilePage = React.lazy(() => import('./pages/formateur/FormateruProfilePage'));
// const FormateurProfileUpdatePage = React.lazy(() => import('./pages/formateur/FormateurProfileUpdatePage'));
// const OperateursPage = React.lazy(() => import('./pages/formateur/OperateursPage'));
// const CreateOperateurPage = React.lazy(() => import('./pages/formateur/CreateOperateursPage'));
// // const {FormateurTestPage} = React.lazy(() => import('./pages/formateur/FormateurTestPage'));
// const FormateurCreateTestsPage = React.lazy(() => import('./pages/formateur/FormateurCreateTestsPage'));
// const Loading = ({ delay = 2000 }) => {
//   const [show, setShow] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setShow(true), delay);
//     return () => clearTimeout(timer);
//   }, [delay]);

//   return show ? <div>Loading...</div> : null;
// };
// function App() {
//   return (
//     <div>
//       <Suspense fallback={<Loading delay={20000} />}>
//       <Router>
      
//       <Routes>
//         <Route path="/" element={<LoginPage/>} />
//         {/* ADMIN DASHBOARD */}
//         <Route path="/admin/dashboard" element={<Dashboard/>}>
//           <Route path="/admin/dashboard" element={<HomePage/>}/>
//           <Route path="/admin/dashboard/profile" element={<ProfilePage/>}/>
//           <Route path="/admin/dashboard/profile/edit" element={<UpdateProfilePage/>}/>
//           <Route path="/admin/dashboard/users" element={<UsersPage/>}/>
//           <Route path="/admin/dashboard/users/create" element={<CreateUsersPage/>}/>

//           <Route path="/admin/dashboard/tests" element={<TestsListPage/>}/>
//           <Route path="/admin/dashboard/tests/create" element={<CreateTestsPage/>}/>
//         </Route>
//         {/* FORMATEUR DASHBOARD */}
//         <Route path="/formateur/dashboard" element={<FormateurDashboard/>} >
//           <Route path="/formateur/dashboard/" element={<div>Home page for Formateur Dashboard</div>}/>
//           <Route path="/formateur/dashboard/profile" element={<FormateurProfilePage/>}/>
//           <Route path="/formateur/dashboard/profile/edit" element={<FormateurProfileUpdatePage/>}/>
//           <Route path="/formateur/dashboard/operateurs" element={<OperateursPage/>}/>
//           <Route path="/formateur/dashboard/operateurs/create" element={<CreateOperateurPage/>}/>
//           <Route path="/formateur/dashboard/tests" element={<FormateurTestPage/>}/>
//           <Route path="/formateur/dashboard/tests/create" element={<FormateurCreateTestsPage/>}/>
//         </Route>
//         {/* OPERATEUR DASHBOARD */}
//         <Route path="/operateur/dashboard" element={<OperateurDashboard/>}>
//           <Route path="/operateur/dashboard/" element={<OperateurHomePage/>}/>
//           <Route path="/operateur/dashboard/test/:id" element={<TestPage/>}/>
//           <Route path="/operateur/dashboard/profile" element={<OperateurProfilePage/>}/>
//           <Route path="/operateur/dashboard/profile/edit" element={<UpdateOperateurProfilePage/>}/>
//         </Route>
//       </Routes>
      
//     </Router>
//     </Suspense>
//     </div>
//   );
// }

// export default App;




















import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Lazy loading components
const FormateurDashboard = React.lazy(() => import('./pages/formateur/Dashboard'));
const FormateurHomePage = React.lazy(() => import('./pages/formateur/HomePage'));

const FormateurProfilePage = React.lazy(() => import('./pages/formateur/FormateruProfilePage'));
const FormateurProfileUpdatePage = React.lazy(() => import('./pages/formateur/FormateurProfileUpdatePage'));
const OperateursPage = React.lazy(() => import('./pages/formateur/OperateursPage'));
const CreateOperateurPage = React.lazy(() => import('./pages/formateur/CreateOperateursPage'));
const FormateurTestsPage = React.lazy(() => import('./pages/formateur/FormateurTestsPage'));
const FormateurCreateTestsPage = React.lazy(() => import('./pages/formateur/FormateurCreateTestsPage'));
const FormateurGroupesPage = React.lazy(() => import('./pages/formateur/FormateurGroupesPage'));
const FormateurCreateGroupesPage = React.lazy(() => import('./pages/formateur/FormateurCreateGroupesPage'));
const FormateurEditGroupPage = React.lazy(() => import('./pages/formateur/FormateurEditGroupPage'));
const FormateurEditOperateurPage = React.lazy(() => import('./pages/formateur/FormateurEditOperateurPage'));

const FormateurUpdateTestPage =  React.lazy(() => import('./pages/formateur/FormateurUpdateTestPage'));


const GroupOperateurPage =  React.lazy(() => import('./pages/formateur/GroupOperateurPage'));



const OperateurInfo =  React.lazy(() => import('./pages/formateur/Operateur-Info'));

// const AbsenceBoard =  React.lazy(() => import('./pages/formateur/AbsenceBoard'));

const ManageAbsenceBoard =  React.lazy(() => import('./pages/formateur/ManageAbsenceBoard'));









// Eagerly loaded components
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/admin/Dashboard';
import ProfilePage from './pages/admin/ProfilePage';
import UpdateProfilePage from './pages/admin/UpdateProfilePage';
import UsersPage from './pages/admin/UsersPage';
import CreateUsersPage from './pages/admin/CreateUsersPage';
import CreateTestsPage from './pages/admin/CreateTestsPage';
import { TestsListPage } from './pages/admin/TestsListPage';
import { HomePage } from './pages/admin/HomePage';
import OperateurDashboard from './pages/operateur/Dashboard';
import OperateurProfilePage from './pages/operateur/OperateurProfilePage';
import UpdateOperateurProfilePage from './pages/operateur/UpdateOperateurProfilePage';
import TestPage from './pages/operateur/TestPage';
import OperateurHomePage from './pages/operateur/OperateurHomePage';

// Custom Loading Component with Delay
const DelayedLoading = ({ delay = 2000 }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return show ? <div>Loading...</div> : null;
};

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          {/* ADMIN DASHBOARD */}
          <Route path="/admin/dashboard" element={<Dashboard />}>
            <Route path="/admin/dashboard" element={<HomePage />} />
            <Route path="/admin/dashboard/profile" element={<ProfilePage />} />
            <Route path="/admin/dashboard/profile/edit" element={<UpdateProfilePage />} />
            <Route path="/admin/dashboard/users" element={<UsersPage />} />
            <Route path="/admin/dashboard/users/create" element={<CreateUsersPage />} />
            <Route path="/admin/dashboard/tests" element={<TestsListPage />} />
            <Route path="/admin/dashboard/tests/create" element={<CreateTestsPage />} />
          </Route>
          {/* FORMATEUR DASHBOARD */}
          <Route
            path="/formateur/dashboard"
            element={
              <Suspense fallback={<DelayedLoading />}>
                <FormateurDashboard />
              </Suspense>
            }
          >
            <Route path="/formateur/dashboard/" element={<FormateurHomePage/>} />
            <Route
              path="/formateur/dashboard/profile"
              element={
                <Suspense fallback={<DelayedLoading />}>
                  <FormateurProfilePage />
                </Suspense>
              }
            />
            <Route
              path="/formateur/dashboard/profile/edit"
              element={
                <Suspense fallback={<DelayedLoading />}>
                  <FormateurProfileUpdatePage />
                </Suspense>
              }
            />
            {/* Groupes Page */}
            <Route
              path="/formateur/dashboard/groupes"
              element={
                <Suspense fallback={<DelayedLoading />}>
                  <FormateurGroupesPage />
                </Suspense>
              }
            />
            {/* Groupes Page */}
            <Route
              path="/formateur/dashboard/groupes/create"
              element={
                <Suspense fallback={<DelayedLoading />}>
                  <FormateurCreateGroupesPage />
                </Suspense>
              }
            />
            <Route
              path="/formateur/dashboard/groupe/:id"
              element={
                <Suspense fallback={<DelayedLoading />}>
                  <FormateurEditGroupPage />
                </Suspense>
              }
            />
            <Route
              path="/formateur/dashboard/groupe/:groupId/operateurs"
              element={
                <Suspense fallback={<DelayedLoading />}>
                  <GroupOperateurPage />
                </Suspense>
              }
            />
            
            <Route
              path="/formateur/dashboard/operateurs"
              element={
                <Suspense fallback={<DelayedLoading />}>
                  <OperateursPage />
                </Suspense>
              }
            />
            <Route
              path="/formateur/dashboard/operateurs/create"
              element={
                <Suspense fallback={<DelayedLoading />}>
                  <CreateOperateurPage />
                </Suspense>
              }
            />
            <Route
              path="/formateur/dashboard/operateur/:id/edit"
              element={
                <Suspense fallback={<DelayedLoading />}>
                  <FormateurEditOperateurPage />
                </Suspense>
              }
            />
                        <Route
              path="/formateur/dashboard/operateur/:id/info"
              element={
                <Suspense fallback={<DelayedLoading />}>
                  <OperateurInfo />
                </Suspense>
              }
            />
            
            <Route
              path="/formateur/dashboard/tests"
              element={
                <Suspense fallback={<DelayedLoading />}>
                  <FormateurTestsPage />
                </Suspense>
              }
            />
            <Route
              path="/formateur/dashboard/tests/create"
              element={
                <Suspense fallback={<DelayedLoading />}>
                  <FormateurCreateTestsPage />
                </Suspense>
              }
            />
            <Route
              path="/formateur/dashboard/test/:id/edit"
              element={
                <Suspense fallback={<DelayedLoading />}>
                  <FormateurUpdateTestPage />
                </Suspense>
              }
            />

            <Route
              path="/formateur/dashboard/présences"
              element={
                <Suspense fallback={<DelayedLoading />}>
                  <ManageAbsenceBoard/>
                </Suspense>
              }
            />
            

            {/* <Route
              path="/formateur/dashboard/absence/manage"
              element={
                <Suspense fallback={<DelayedLoading />}>
                  <ManageAbsenceBoard/>
                </Suspense>
              }
            /> */}
            
          </Route>
          

         

          {/* OPERATEUR DASHBOARD */}
          <Route path="/operateur/dashboard" element={<OperateurDashboard />}>
            <Route path="/operateur/dashboard/" element={<OperateurHomePage />} />
            <Route path="/operateur/dashboard/test/:id" element={<TestPage />} />
            <Route path="/operateur/dashboard/profile" element={<OperateurProfilePage />} />
            <Route path="/operateur/dashboard/profile/edit" element={<UpdateOperateurProfilePage />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

