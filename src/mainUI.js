import logo from './images/logo.svg';
import addIcon from './images/plus.png';
import minusIcon from './images/minus.png';
import {addAllTasks, modal, submitDesc} from "./tasks.js";

const plannerObjects = [
    { title: "Inbox" },
    { title: "Today" },
    { title: "This Month"},
];

let projectObjects = localStorage.getItem("projectObjects");
projectObjects = JSON.parse(projectObjects) || [];

const sectionLists = [
    { title: "Planner", list: plannerObjects },
    { title: "Projects", list: projectObjects}
]

export function makeUI() {
    if (!localStorage.getItem("currentList")) {
        localStorage.setItem("currentList", "Inbox");
    }

    makeHeader();
    makeSidebar();
    makeContent();
}

function makeHeader() {
    const header = document.getElementById("header");

    const headerLogo = document.createElement("img");
    headerLogo.id = "headerLogo";
    headerLogo.src = logo;

    const headerTitle = document.createElement("p")
    headerTitle.id = "headerTitle";
    headerTitle.textContent = "Unorganized";

    header.appendChild(headerLogo);
    header.appendChild(headerTitle);
}

function makeSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.innerHTML = "";

    sectionLists.forEach(({title, list}) => {
        sidebar.appendChild(makeSidebarSection(title, list));
    })
}

function makeSidebarSection(title, list) {
    const section = document.createElement("div");
    section.classList.add("sidebarSection")

    const sectionTitle = document.createElement("p")
    sectionTitle.classList.add("sectionTitle")
    sectionTitle.textContent = title;

    const addProject = document.createElement("p")
    addProject.classList.add("sectionItem")
    addProject.textContent = "+ Add Project";

    addProject.onclick = function() {
        const input = document.getElementById("descInput");
        input.value = "";

        const dateLabel = document.getElementById("dateLabel");
        dateLabel.style.display = "none";

        const dateInput = document.getElementById("dateInput");
        dateInput.style.display = "none";

        const modalContainer = document.getElementById("modalContainer");
        modalContainer.style.display = "block";

        const submitBtn = document.getElementById("button");

        submitBtn.onclick = function() {
            let projectTitle = submitDesc("project");
            let projectPresent = projectObjects.some(project => project.title.trim() === projectTitle.trim());

            if (!projectTitle) {
                alert("Please enter a project name");
                modalContainer.style.display = "block";
            } else if(projectPresent) {
                alert("Please enter a unique project name");
                modalContainer.style.display = "block";
            } else if (projectTitle && !projectPresent) {
                projectObjects.push({ title: projectTitle });
                localStorage.setItem("projectObjects", JSON.stringify(projectObjects));
                localStorage.setItem("currentList",projectTitle);

                makeSidebar();
                makeContent();
            }
        };
    }

    section.appendChild(sectionTitle);

    if (title == "Projects") {section.appendChild(addProject)};

    list.forEach(({title}) => {
        const sectionItem = document.createElement("p")
        sectionItem.classList.add("sectionItem")
        sectionItem.textContent = title;

        if (localStorage.getItem("currentList") === title) {
            sectionItem.style.backgroundColor = "rgba(0, 0, 0, 0.20)";
            sectionItem.style.borderRadius = "10px";
        };

        sectionItem.onclick = function() {
            localStorage.setItem("currentList",title);

            makeSidebar();
            makeContent();
        }

        section.appendChild(sectionItem);
    })

    return section;
}

function makeContent() {
    const content = document.getElementById("content")
    content.innerHTML = "";

    const titleContainer = document.createElement("div");
    titleContainer.id = "titleContainer";

    const removeProjectBtn = document.createElement("img");
    removeProjectBtn.id = "removeProjectBtn";
    removeProjectBtn.src = minusIcon;
    removeProjectBtn.onclick = function() {
        const confirmRemove = window.confirm("Are you sure want to remove " + listTitle.textContent + "?");

        if (confirmRemove) {
            removeProject(listTitle.textContent);
        }
    }

    const listTitle = document.createElement("p");
    listTitle.id = "listTitle";
    listTitle.textContent = localStorage.getItem("currentList");

    const addTaskBtn = document.createElement("img");
    addTaskBtn.id = "addTaskBtn";
    addTaskBtn.src = addIcon;
    
    addTaskBtn.onclick = function() {
        const input = document.getElementById("descInput");
        input.value = "";

        const dinput = document.getElementById("dateInput");
        dinput.value = "";

        const modalContainer = document.getElementById("modalContainer");
        modalContainer.style.display = "block";

        const submitBtn = document.getElementById("button");
        submitBtn.onclick = function() {
            let currentList = localStorage.getItem("currentList");
            let taskDesc = submitDesc("add");
            let tasksStorage = JSON.parse(localStorage.getItem(currentList + "Tasks")) || [];
            
            if (taskDesc) {
                tasksStorage.push(taskDesc);
                localStorage.setItem(currentList + "Tasks", JSON.stringify(tasksStorage));
    
                addAllTasks();
            }
        }
    }

    const line = document.createElement("div");
    line.id = "line";

    const allTasksContainer = document.createElement("div");
    allTasksContainer.id = "allTasksContainer";

    titleContainer.appendChild(removeProjectBtn);
    titleContainer.appendChild(listTitle);
    titleContainer.appendChild(addTaskBtn);

    if (listTitle.textContent === "Today" || listTitle.textContent === "This Month") {
        addTaskBtn.style.display = "none";
    } else {
        addTaskBtn.style.display = "block";
    }

    if (listTitle.textContent === "Inbox" || listTitle.textContent === "Today" || listTitle.textContent === "This Month") {
        removeProjectBtn.style.display = "none";
    } else {
        removeProjectBtn.style.display = "block";
    }
    
    content.appendChild(titleContainer);
    content.appendChild(line);
    content.appendChild(allTasksContainer);
    content.appendChild(modal());

    addAllTasks();
}

function removeProject(projectName) {
    const projectIndex = projectObjects.findIndex(project => project.title.trim() === projectName.trim());

    if (projectIndex !== -1) {
        projectObjects.splice(projectIndex, 1);

        localStorage.setItem("projectObjects", JSON.stringify(projectObjects));
        localStorage.setItem("currentList", "Inbox");
        
        makeSidebar();
        makeContent();
    }
}