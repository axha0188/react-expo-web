import React from "react";
import axios from "axios";
import {
  Button,
  Icon,
  Input,
  Grid,
  Container,
  Modal,
  Card
} from "semantic-ui-react";

function App() {
  // controla el modal
  const [open, setOpen] = React.useState(false);
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
    const id = task[task.length - 1].id + 1;
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
      getTask();
    }
    setOpen(false);
    console.log(data);
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
        Task List
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
      <Container style={{ margin: "2rem" }} textAlign="center">
        <Grid stackable stretched columns={2} textAlign="center">
          {task.map((m) => (
            <Grid.Column mobile={12} tablet={6} computer={6}>
              <Card
                style={{ width: "100%" }}
                link
                header={m.title}
                description={m.task}
              />
            </Grid.Column>
          ))}
        </Grid>
      </Container>
    </>
  );
}

export default App;
