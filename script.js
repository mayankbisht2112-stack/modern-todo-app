document.addEventListener('DOMContentLoaded', ()=>{
    const taskInput=document.getElementById('task-input');//it'll store the text entered by user//
    const addTaskBtn=document.getElementById('addtask-btn');//user will click this button to add the task//
    const taskList=document.getElementById('ul-task-list');//script will add dynamically task into the tasklist//
    const emptyImg=document.querySelector('.empty-image');
    const todocontainer=document.querySelector('.todos-container');
    const progressBar=document.getElementById('progress');
    const progressNumber=document.getElementById('numbers');
    const toggleEmptyState=() => {
        const totalTasks=taskList.querySelectorAll('li').length;
        emptyImg.style.display = totalTasks === 0 ? 'block' : 'none';
        todocontainer.style.width = totalTasks > 0 ? '100%' : '50%';
    };
    const updateProgress=(checkedCompletion=true)=>{
        const totalTask=taskList.querySelectorAll('li').length;
        const completedTask=taskList.querySelectorAll('.completed').length;
        progressBar.style.width=totalTask ? `${(completedTask/totalTask)*100}%` : `0%`;
        progressNumber.textContent=`${completedTask}/${totalTask}`;
        if(checkedCompletion && totalTask > 0 && completedTask === totalTask){
            launchConfetti();
        }
    };

    const saveTaskToLocalStorage = () => {
        const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
            text: li.querySelector('span').textContent,
            completed: li.querySelector('.checkbox').checked
        }));
        localStorage.setItem('tasks',JSON.stringify(tasks));
    };

    const loadTasksFromLocalStorage = () => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(({text, completed }) => addTask(text, completed, false));
        toggleEmptyState();
        updateProgress();
    };
    const addTask = (text, completed = false, checkedCompletion=true) => {
        const taskText=text || taskInput.value.trim();
        if(!taskText){
            return;
        }
        const li=document.createElement('li');
        li.innerHTML=`
        <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}>
        <span>${taskText}</span>
        <div class="task-button">
        <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        </div>
        `;
        const checkbox=li.querySelector('.checkbox');
        const editbtn=li.querySelector('.edit-btn');

        if(completed){
            li.classList.add('completed');
            editbtn.disabled=true;
            editbtn.style.opacity='0.5';
            editbtn.style.pointerEvents='none';
        };

        checkbox.addEventListener('change',()=>{
            const isChecked=checkbox.checked;
            li.classList.toggle('completed',isChecked);
            editbtn.disabled=isChecked;
            editbtn.style.opacity=isChecked? '0.5' : '1';
            editbtn.style.pointerEvents=isChecked ? 'none' : 'auto';
            updateProgress();
            saveTaskToLocalStorage();
        });
        editbtn.addEventListener('click',()=>{
            if(!checkbox.checked){
                taskInput.value=li.querySelector('span').textContent;// it takes task to the input field again to edit
                li.remove();
                toggleEmptyState();
                updateProgress(false);//why false because during editing we dont want to update progress
            }
            saveTaskToLocalStorage();
        });
        li.querySelector('.delete-btn').addEventListener('click',()=> {
            li.remove();
            saveTaskToLocalStorage();
            toggleEmptyState();// UI updater function to check is the tasklist empty or not and to show or not the empty image accordingly
            updateProgress(false);
        });
        taskList.appendChild(li);
        taskInput.value='';
        toggleEmptyState();
        updateProgress(checkedCompletion);
        saveTaskToLocalStorage();
    };
    
    const form= document.querySelector('.input-area');
    form.addEventListener('submit',(e) => {
        e.preventDefault();
        addTask();
    });
    loadTasksFromLocalStorage();
});
const launchConfetti=()=>{ //The library ALSO provides a global function named: confetti thats why launchConfetti
    const count = 200,
  defaults = {
    origin: { y: 0.7 },
  };

function fire(particleRatio, opts) {
  confetti(
    Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio),
    })
  );
}

fire(0.25, {
  spread: 26,
  startVelocity: 55,
});

fire(0.2, {
  spread: 60,
});

fire(0.35, {
  spread: 100,
  decay: 0.91,
  scalar: 0.8,
});

fire(0.1, {
  spread: 120,
  startVelocity: 25,
  decay: 0.92,
  scalar: 1.2,
});

fire(0.1, {
  spread: 120,
  startVelocity: 45,
});
}

