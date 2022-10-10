import { Component } from 'solid-js';
import {createSignal} from 'solid-js';
import Box from '@suid/material/Box';
import Table from "@suid/material/Table";
import TableBody from "@suid/material/TableBody";
import TableCell from "@suid/material/TableCell";
import TableContainer from "@suid/material/TableContainer";
import TableHead from "@suid/material/TableHead";
import TableRow from "@suid/material/TableRow";
import Paper from "@suid/material/Paper";
import Button from "@suid/material/Button";
import Typography from "@suid/material/Typography";
import Modal from "@suid/material/Modal";
import {useNavigate } from '@solidjs/router';
interface Order {
  id: string;
  title: string;
  cost: string; // arrow function
  issuedate : string; 
  accepted  :string;
}

const fetchUser = async () =>
  (await fetch(`http://127.0.0.1:8000/auth/orders`, {
    method: 'GET',
    credentials: "include"
  })).json();

const Accept: Component = () => {
  const navigate = useNavigate()
  const [openedOrder, setOpenedOrder] = createSignal<Order | null>(null)
  const handleOpen = (order : Order) => {
    if(order.accepted == 'null'){
      setOpenedOrder(order)
    }
  };
  const handleClose = () => setOpenedOrder(null);

  const handlePost = (accept: boolean) => {
    setUser(user().map((x)=> { 
      if(x.id == openedOrder()?.id){
        x.accepted = accept ? 'true':'false'  
      }
      return x}))
    setOpenedOrder(null)
  }

  const handleLogout = ()=>{
   navigate('/logout',{replace: true})
  }

  const [user,setUser] = createSignal<Order[]>([]);
  fetchUser().then((data : Order[])=>{setUser(data)})
  return (
    <Box sx={{ width: '80%', minWidth: '700px' }}>
      {/* {user()?.map((item : any) => {
        return(
        <OrderComp {...item}/>
        );
      })} */}
      <Box textAlign='right'>
      <Button onClick={handleLogout} variant='contained'>Odhlásit</Button>
      </Box>
      <TableContainer sx={{overflowX: "initial"}} component={Paper}>
        <Table sx={{  minWidth: 650 }} aria-label="simple table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell >ID</TableCell>
              <TableCell align="right">Název</TableCell>
              <TableCell align="right">Cena</TableCell>
              <TableCell align="right">Datum zadání</TableCell>
              <TableCell align="right">Přijmuto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>


            {user()?.map((prop: any) => (
              
              <TableRow
                onClick={() =>  handleOpen(prop) }
                sx={prop.accepted == 'null' ? { '&:last-child td, &:last-child th': { border: 0 }} : { '&:last-child td, &:last-child th': { border: 0 },backgroundColor: 'lightgray'} }
              >
                <TableCell component="th" scope="row">
                  {prop.id}
                </TableCell>
                <TableCell align="right">{prop.title}</TableCell>
                <TableCell align="right">{prop.cost}</TableCell>
                <TableCell align="right">{prop.issuedate}</TableCell>
                <TableCell align="right" id={prop.id}>{prop.accepted == "true" ? <Box sx={{backgroundColor: 'green', textAlign:'center'}}>P</Box>: prop.accepted == "false" ? <Box sx={{backgroundColor: 'red', textAlign:'center'}}>Z</Box> : <Box sx={{textAlign:'center'}}>Zadat</Box> }</TableCell>
              </TableRow>
            ))}


                 {/* {mapArray(user, (prop : Order, index) => {
          // If an item updates, <li>...</li> will be re-rendered
          return (
            <TableRow
            onClick={() => handleOpen(prop)}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              {prop.id}
            </TableCell>
            <TableCell align="right">{prop.title}</TableCell>
            <TableCell align="right">{prop.cost}</TableCell>
            <TableCell align="right">{prop.issuedate}</TableCell>
            <TableCell align="right" id={prop.id}>{prop.accepted == "true" ? <Box sx={{backgroundColor: 'green', textAlign:'center'}}>P</Box>:<Box sx={{backgroundColor: 'red', textAlign:'center'}}>Z</Box> }</TableCell>
          </TableRow>
          );
        })} */}

          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        open={!!openedOrder()}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '40%', border: '2px solid #000', p: 4, backgroundColor: 'white' }}>
          <Typography id="modal-modal-title" textAlign='center' variant="h5" component="h2">
            Potvrzení
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Detail <br />
            Název : {openedOrder()?.id} <br />
            Cena  : {openedOrder()?.cost} <br />
            Datum : {openedOrder()?.issuedate}
          </Typography>
          <Box sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
            <Button color="success" variant='contained' sx={{ textAlign: 'left' }} onClick={() => handlePost(true)}>Potvrdit</Button>
            <Button color="error" variant='contained' onClick={() => handlePost(false)}>Zamítnout</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default Accept


