import React from "react";
import axios from "axios";
import {
  Button,
  Icon,
  Input,
  Grid,
  Container,
  Modal,
  Card,
  Message,
  Header,
  Statistic
} from "semantic-ui-react";

function App() {
  // controla el mensaje
  const [message, setMessage] = React.useState({
    variant: false,
    title: "",
    message: "",
    visible: false
  });
  // controla el modal
  const [open, setOpen] = React.useState(false);
  const [opendialog, setOpenDialog] = React.useState(false);
  // lista de tareas
  const [task, setTask] = React.useState([]);
  // lista de tareas para buscar
  const [taskc, setTaskc] = React.useState([]);
  // formulario task
  const [formtask, setFormtask] = React.useState({
    title: "",
    task: ""
  });
  // filtrar tarea
  const searchTask = (e) => {
    console.log(e);
    console.log(task);
    const filtertask = taskc.filter(
      (t) =>
        `${t.title}`.toLowerCase().includes(e) ||
        `${t.task}`.toLowerCase().includes(e)
    );
    setTask(filtertask);
  };
  // add tarea
  const addTask = async () => {
    try {
      const id = task.length !== 0 ? task[task.length - 1].id + 1 : 1;
      console.log(id);
      const jsonsubmit = {
        id,
        title: formtask.title,
        task: formtask.task
      };
      console.log(jsonsubmit);
      const { data } = await axios.post(
        "https://allan26.pythonanywhere.com/createtask",
        jsonsubmit
      );
      if (data.status) {
        setMessage({
          variant: true,
          title: "Tarea agregada",
          message: "Tarea agregada correctamente",
          visible: true
        });
        setFormtask({
          title: "",
          task: ""
        });
        getTask();
      }
    } catch (error) {
      console.log(error);
      setMessage({
        variant: false,
        title: "Error en la operacion",
        message: "Error al agregar la tarea",
        visible: true
      });
    } finally {
      setOpen(false);
    }
  };
  const deleteTask = async (id) => {
    try {
      const { data } = await axios(
        `https://allan26.pythonanywhere.com/deletetask/${id}`
      );
      if (data.status) {
        setMessage({
          variant: true,
          title: "Tarea Eliminada",
          message: "Tarea Eliminada correctamente",
          visible: true
        });
        getTask();
      }
    } catch (error) {
      console.log("miraa", error);
      setMessage({
        variant: false,
        title: "Error en la operacion",
        message: "Error al eliminar la tarea!",
        visible: true
      });
    } finally {
      setOpen(false);
    }
  };
  // peticion http
  async function getTask() {
    const { data } = await axios("https://allan26.pythonanywhere.com/alltask");
    setTask(data);
    setTaskc(data);
  }
  // peticiones
  React.useEffect(() => {
    getTask();
  }, []);
  return (
    <>
      <Modal
        basic
        onClose={() => setOpenDialog(false)}
        onOpen={() => setOpenDialog(true)}
        open={opendialog}
        size="small"
      >
        <Header icon>
          <Icon name="trash icon" />
          Mensaje del sistema
        </Header>
        <Modal.Content style={{ textAlign: "center" }}>
          <h3>¿Estas seguro de eliminar la tarea?</h3>
        </Modal.Content>
        <Modal.Actions>
          <Button
            basic
            color="red"
            inverted
            onClick={() => setOpenDialog(false)}
          >
            <Icon name="remove" /> NO
          </Button>
          <Button
            color="green"
            inverted
            onClick={() => deleteTask(window.localStorage.getItem("idtask"))}
          >
            <Icon name="checkmark" /> SI
          </Button>
        </Modal.Actions>
      </Modal>
      <Modal size="tiny" open={open} onClose={() => setOpen(false)}>
        <Modal.Header>Add task</Modal.Header>
        <Modal.Content>
          <Grid container>
            <Grid.Row>
              <Input
                icon="star"
                style={{ width: "100%" }}
                size="huge"
                placeholder="Title..."
                value={formtask.title}
                onChange={(e) => {
                  setFormtask({
                    ...formtask,
                    title: e.target.value
                  });
                }}
              />
            </Grid.Row>
            <Grid.Row>
              <Input
                icon="tasks icon"
                placeholder="Task..."
                style={{ width: "100%" }}
                size="huge"
                value={formtask.task}
                onChange={(e) => {
                  setFormtask({
                    ...formtask,
                    task: e.target.value
                  });
                }}
              />
            </Grid.Row>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button
            negative
            onClick={() => {
              addTask();
            }}
          >
            Add task
          </Button>
        </Modal.Actions>
      </Modal>
      {/* app */}
      <h2 className="ui center aligned icon header">
        <i className="github alternate icon"></i>
        TASK LIST
      </h2>
      <Container textAlign="center">
        <Grid stackable stretched columns={2} textAlign="center">
          <Grid.Column mobile={16} tablet={6} computer={6}>
            <Input
              size="huge"
              icon="search"
              placeholder="Buscar..."
              onChange={(e) => {
                searchTask(e.target.value.toLocaleLowerCase());
              }}
            />
          </Grid.Column>
          <Grid.Column mobile={16} tablet={3} computer={3}>
            <Button animated size="huge" onClick={() => setOpen(true)}>
              <Button.Content visible>Add</Button.Content>
              <Button.Content hidden>
                <Icon name="add to calendar" />
              </Button.Content>
            </Button>
          </Grid.Column>
        </Grid>
      </Container>
      <Container textAlign="center">
        <Grid stackable stretched columns={1} textAlign="center">
          <Grid.Column mobile={16} tablet={9} computer={9}>
            {message.visible ? (
              <Message
                onDismiss={() => {
                  setMessage({
                    ...message,
                    visible: false
                  });
                }}
                positive={message.variant}
                negative={!message.variant}
                header={message.title}
                content={message.message}
              />
            ) : (
              ""
            )}
          </Grid.Column>
        </Grid>
      </Container>

      <Container style={{ margin: "2rem" }} textAlign="center">
        <Grid stackable stretched columns={2} textAlign="center">
          {task.length !== 0 ? (
            task.map((m) => (
              <Grid.Column key={m.id} mobile={12} tablet={6} computer={6}>
                <Card
                  style={{ width: "100%" }}
                  link
                  header={m.title}
                  description={m.task}
                  onClick={(e) => {
                    setOpenDialog(true);
                    console.log(m.id);
                    window.localStorage.setItem("idtask", m.id);
                  }}
                />
              </Grid.Column>
            ))
          ) : (
            <Statistic>
              <Statistic.Value>No hay Tareas</Statistic.Value>
              <Statistic.Label>agrega tarea</Statistic.Label>
            </Statistic>
          )}
        </Grid>
      </Container>
    </>
  );
}

export default App;
