import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './container/home'
import Quize from './container/quize';
import Result from './container/result';
import Dashboard from './container/dashboard';
import Question2 from './container/question2';
import Question1 from './container/question1';

function AppRouter() {
  return (
  <BrowserRouter>
    <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/quize" element={<Quize />} />
        <Route path="/result" element={<Result />} />
        <Route path="/question1" element={<Question1 />} />
        <Route path="/question2" element={<Question2 />} />
        <Route path="/dashboard" element={<Dashboard />} />

    </Routes>
  </BrowserRouter>
  )

}
export default AppRouter;
