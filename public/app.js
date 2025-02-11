const API_URL = 'http://localhost:3000/api/tasks';

// Obtener las tareas
const fetchTasks = async () => {
    try {
        const response = await fetch(API_URL);
        const tasks = await response.json();
        displayTasks(tasks);
    } catch (error) {
        console.error('Error al obtener las tareas:', error);
    }
};

// Mostrar las tareas en el HTML
const displayTasks = (tasks) => {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Limpiar el contenedor de tareas

    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.innerHTML = `
            <strong>${task.title}</strong> - ${task.description} <br>
            Estado: ${task.completed ? 'Completada' : 'Pendiente'}
            <button onclick="toggleCompleted('${task._id}', ${task.completed})">${task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}</button>
            <button onclick="deleteTask('${task._id}')">Eliminar</button>
        `;
        taskList.appendChild(taskElement);
    });
};

// Crear una nueva tarea
const createTask = async (title, description) => {
    const task = { title, description };
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });
        const newTask = await response.json();
        fetchTasks(); // Recargar las tareas
    } catch (error) {
        console.error('Error al crear la tarea:', error);
    }
};

// Actualizar el estado de "completed" de una tarea
const toggleCompleted = async (id, currentStatus) => {
    const updatedStatus = !currentStatus;
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: updatedStatus }),
        });
        const updatedTask = await response.json();
        fetchTasks(); // Recargar las tareas
    } catch (error) {
        console.error('Error al actualizar el estado de la tarea:', error);
    }
};

// Eliminar una tarea
const deleteTask = async (id) => {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        fetchTasks(); // Recargar las tareas
    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
    }
};

// Manejo del formulario para crear tareas
document.getElementById('task-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;

    createTask(title, description);

    document.getElementById('task-title').value = ''; // Limpiar campo
    document.getElementById('task-description').value = ''; // Limpiar campo
});

// Cargar las tareas al inicio
fetchTasks();
