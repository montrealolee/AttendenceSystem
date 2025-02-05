import React, { useRef, useState, useEffect } from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Typography, Button, Divider } from '@mui/material';
import { useLocation } from 'react-router-dom';
import DialogAttendence from '../objects/DialogAttendence';
import CustomHrSelect from './time';
import { Location } from "history";
import { userInfo } from "./login"
import moment from 'moment';
import './css/kindai.css';

type T = {
  status: number,
  
}

function getDates(month: number) {
  let startDate = moment().month(month).startOf("month");
  const endDate = moment().month(month).endOf("month").format('YYYY/MM/DD');
  const dateArray = [];
  const stopDate = moment(endDate);
  while (startDate <= stopDate) {
      dateArray.push( moment(startDate).format('YYYY/MM/DD') )
      startDate = moment(startDate).add(1, 'days');
  }
  return dateArray;
}



function Kindai() : JSX.Element{  
  const location = useLocation();
  const state = location.state as userInfo;
  const [userString, setUserString] = useState({familyName: '', firstName: '', email: '', id: -1, remainHoliday: -1});
  const dateArray = getDates(moment().month());

  const [dialogOpen, setDialogOpen] = useState(false);
  const [workdate,getWorkedDate]=useState('');
  const [workdatecategory,getWorkdatecategory]=useState('');
  const [startTime,getStartTime]=useState('');
  const [endtime,getEndtime]=useState('');
  const [offTime,getOffTime]=useState('');
  const [workedContent,getWorkedContent]=useState('');


  const callBackendAPI = async (): Promise<T> => {
    const requestOptions = {
      crossDomain: true,
      method: 'POST',
      headers: { 
        "access-control-allow-origin" : "*",
        'Content-Type': 'application/json'
       },
      body: JSON.stringify({workdate,workdatecategory,startTime,endtime,offTime,workedContent})
  }
  const response = await fetch('/api/get-datas', requestOptions);
  return response;
};
console.log(workdate.toString());

  useEffect(()=> {
    if(state) {
      setUserString({
        id: state?.id,
        email: state?.email,
        firstName: state?.firstName,
        familyName: state?.familyName,
        remainHoliday: state?.remainHoliday,
      });
    }
    else{
      setUserString(JSON.parse(String(window.localStorage.getItem('attendence_user_data'))));
    }
    
  }, []);

  return (
    <div className="kindai-area">
      {userString ? (
        // ユーザー情報がある場合
        <div>
          <DialogAttendence open={dialogOpen} setOpen={(bool) => setDialogOpen(bool)} userString={userString} setUserString={(userInfo) => setUserString(userInfo)} dateArray={dateArray}/>
          <div className="title-area">
            <div>
              <Typography>Welcome To Attendence System</Typography>
            </div>
            <div>
              <Typography>User: {userString.familyName} {userString.firstName}</Typography>
            </div>
          </div>
          <div className="button-area">
            <Button onClick={()=> setDialogOpen(true)}>勤怠登録</Button>
          </div>
          <div className="output-area">
          <TableContainer >
              <Table aria-label="customized table" size='medium'>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">勤務回数</TableCell>
                    <TableCell align="center">休日</TableCell>
                    <TableCell align="center">残有給数</TableCell>
                    <TableCell align="center">実績時間</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableCell align="center">110</TableCell>
                      <TableCell align="center">15</TableCell>
                      <TableCell align="center">10</TableCell>
                      <TableCell align="center">164</TableCell>
                    </TableBody>
                    </Table>
            </TableContainer>
          </div>

          
          <div className="table-area">
            <TableContainer component={Paper}>
              <Table aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">日付</TableCell>
                    <TableCell align="center">業務区分</TableCell>
                    <TableCell align="center">開始時間</TableCell>
                    <TableCell align="center">終了時間</TableCell>
                    <TableCell align="center">休憩時間</TableCell>
                    <TableCell align="center">実働時間</TableCell>
                    <TableCell align="center">業務内容</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dateArray.map((row) => (
                    <TableRow key={`date${row}`}>
                      <TableCell align="center" size="small">{row}</TableCell>
                      <TableCell align="center">
                     
                      </TableCell>
                      <TableCell align="center"></TableCell>
                      <TableCell align="center"></TableCell>
                      <TableCell align="center"></TableCell>
                      <TableCell align="center"></TableCell>
                      <TableCell align="center"></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      ) 
      :(
        // ユーザー情報がない場合
        <div>
          No User Data
        </div>
      )}
    </div>
  );
      
}
export default Kindai;
