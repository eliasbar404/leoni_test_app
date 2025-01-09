import OperateurLayout from '../../layouts/OperateurLayout';

import { Outlet } from 'react-router-dom';
import OperateurNavbar from '../../components/OperateurNavbar';

const Dashboard = () => {
  return (
    <OperateurLayout>
        <div style={{display:"flex" ,flexDirection:"column"}}>
            <OperateurNavbar/>

            <div style={{margin:"100px auto",width:"95%"}}>
                <Outlet/>
            </div>
        </div>
    </OperateurLayout>
  )
}

export default Dashboard