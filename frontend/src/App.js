import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import ReactionForm from './components/ReactionForm';
import AdminPage from './components/Admin/Adminpage';
import ProtectedComponent from './components/Protectedroute';
import AddCompany from './components/Admin/AddCompany'; 
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import CompanyDashboard from './components/DashboardCompany';
import AdminAddUser from './components/Admin/AdminCreateUser';
import AdminCompanyDashboard from './components/Admin/AdminCompanyDashboard';
import AdminUserDashboard from './components/Admin/AdminUserDashboard';
import AdminNewQuestion from './components/Admin/AdminNewQuestions';
import AdminEditQuestions from './components/Admin/AdminEditQuestions';
import AdminAddQuestions from './components/Admin/AdminAddQuestions';
import AdminRemoveUser from './components/Admin/AdminRemoveUser';
import AdminRemoveCompany from './components/Admin/AdminRemoveCompany';
import AdminEditOnderwerp from './components/Admin/AdminEditOnderwerp';
import InfoPagina from './components/InfoPagina';
import AdminResetPassword from './components/Admin/AdminResetPassword';
import ResetPassword from './components/ResetPasswordForm';
import InfoReactionForm from './components/InfoReactionForm';
import InforeactionFormOpen from './components/AndereVragen/InfoReactionFormOpen';
import ReactionFormOpen from './components/AndereVragen/ReactionFormOpen';
import OpenDashboard from './components/AndereVragen/OpenDashboard';
import HulpVakjes from './components/Admin/HulpVakjes';
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/reactionform" element={<ReactionForm />} />
                <Route path="/admin" element={<ProtectedComponent><AdminPage /></ProtectedComponent>} />
                <Route path="/admin/addcompany" element={<ProtectedComponent><AddCompany /></ProtectedComponent>} />
                <Route path="/register" element={<RegisterForm />} /> 
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/companydashboard" element={<CompanyDashboard />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/admin/adduser" element={<ProtectedComponent><AdminAddUser /></ProtectedComponent>} />
                <Route path="/admin/companies" element={<ProtectedComponent><AdminCompanyDashboard /></ProtectedComponent>} />
                <Route path="/admin/users" element={<ProtectedComponent><AdminUserDashboard /></ProtectedComponent>} />
                <Route path="/admin/newquestion" element={<ProtectedComponent><AdminNewQuestion /></ProtectedComponent>} />
                <Route path="/admin/newquestions" element={<ProtectedComponent><AdminEditQuestions /></ProtectedComponent>} />
                <Route path="/admin/addquestions" element={<ProtectedComponent><AdminAddQuestions /></ProtectedComponent>} />
                <Route path="/admin/removeuser" element={<ProtectedComponent><AdminRemoveUser /></ProtectedComponent>} />
                <Route path="/admin/removecompany" element={<ProtectedComponent><AdminRemoveCompany /></ProtectedComponent>} />
                <Route path="/admin/editonderwerp" element={<ProtectedComponent><AdminEditOnderwerp /></ProtectedComponent>} />
                <Route path="/info" element={<InfoPagina />} />
                <Route path="/admin/resetpassword" element={<ProtectedComponent><AdminResetPassword /></ProtectedComponent>} />
                <Route path="/resetpassword" element={<ResetPassword />} />
                <Route path="/infoReactionForm" element={<InfoReactionForm />} />
                <Route path="/inforeactionformOpen" element={<InforeactionFormOpen />} />
                <Route path="/reactionformOpen" element={<ReactionFormOpen />} />
                <Route path="/opendashboard" element={<OpenDashboard />} />
                <Route path="/admin/hulpvakjes" element={<ProtectedComponent><HulpVakjes /></ProtectedComponent>} />
            </Routes>
        </Router>
    );
}

export default App;
