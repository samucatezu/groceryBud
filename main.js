// **********SELECTORS***********//
// INPUT
const inputText = document.querySelector('.input-text');
const submitBtn = document.querySelector('.submit-btn');
// OUTPUT
const groceryList = document.querySelector('.grocery-list');
const msg = document.querySelector('.msg-container');

// BUTTONS
const editBtn = document.querySelector('.edit-btn');
const deleteBtn = document.querySelector('.delete-btn');
const clearBtn = document.querySelector('.clear-btn');

// **********EVENTS***********//
submitBtn.addEventListener('click', function(e){
    e.preventDefault();
    
    if(inputText.value === ""){
        // USER ERROR MSG
        let type = "error-msg"; 
        let string = "Enter something !";
        msgToUser(type,string);
    } else {

        let groceryItems = getDataFromLocalStorage();
        let check = true;
        if(groceryItems.length !== 0){
            groceryItems.forEach((item) => {
                if(inputText.value === item){
                        // USER ERROR MSG
                        let type = "error-msg"; 
                        let string = "Can't enter same item twice !";
                        msgToUser(type,string);
                    check = false;
                };
            });
        };
        if(check === true){
            // SUBMIT
            if(submitBtn.innerText === "Submit"){
                // Create new item
                let title = inputText.value;
                addItem(title);
                addToLocalStorage(title);
            }
            // EDIT
            else if(submitBtn.innerText === "Edit"){
                submitBtn.innerText = "Submit";
                let newInput = inputText.value;
                inputText.value = "";
                inputText.placeholder = "e.g. eggs"

                const groceryItem = document.querySelectorAll('.grocery-item');
                groceryItem.forEach((item) => {
                    let pItem = item.firstChild.nextSibling;

                    if(pItem.classList[1] === "edit-text"){
                        pItem.classList.remove("edit-text");
                        editLocalStorage(pItem.innerText, newInput);
                        pItem.innerText = newInput;
                        // USER EDIT MSG
                        let type = "edit-msg"; 
                        let string = "Successful Edit !";
                        msgToUser(type,string);
                    } 
                });
            }
        }
    }
});
clearBtn.addEventListener('click', clearItems);
groceryList.addEventListener('click', deleteEdit);
window.addEventListener('DOMContentLoaded', retrieveLocalStorage);

// **********FUNCTIONS***********//
function addItem(title) {
    groceryList.innerHTML = 
    `${groceryList.innerHTML}
    <article class="grocery-item">
        <p class="title">${title}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
            <i class="fa fa-edit"></i>
            </button>
            <button type="button" class="delete-btn">
            <i class="fa fa-trash"></i>
            </button>
        </div>
    </article>`;
};
function clearItems(){
    groceryList.innerHTML = "";

    // CLEAR LOCAL STORAGE
    let groceryItems = [];
    localStorage.setItem('groceryItems',JSON.stringify(groceryItems));
};
function deleteEdit(e){
    let btn = e.target.parentElement;
    let item = btn.parentElement.parentElement;
    let pItem = item.firstChild.nextSibling;
    // DELETE
    if(btn.classList[0] === "delete-btn"){
        item.remove();
        removeFromLocalStorage(pItem.innerText);
    }
    // EDIT
    else if(btn.classList[0] === "edit-btn"){
        submitBtn.innerText = "Edit";
        inputText.value = "";
        inputText.placeholder = `Modify your item : ${pItem.innerText}`;
        pItem.classList.add("edit-text");
    }
}

// LOCAL STORAGE
function addToLocalStorage(itemName){

    let groceryItems = getDataFromLocalStorage();

    groceryItems.push(itemName);
    localStorage.setItem('groceryItems', JSON.stringify(groceryItems));
};
function removeFromLocalStorage(itemName) {

    let groceryItems = getDataFromLocalStorage();

    //REMOVE ITEM NAME FROM ARRAY
    groceryItems.splice(groceryItems.indexOf(itemName), 1);
    localStorage.setItem('groceryItems', JSON.stringify(groceryItems));
};
function editLocalStorage(itemName, newItemName){

    let groceryItems = getDataFromLocalStorage();

    groceryItems.splice(groceryItems.indexOf(itemName), 1, newItemName);
    localStorage.setItem('groceryItems', JSON.stringify(groceryItems));
};
function getDataFromLocalStorage(){
    let groceryItems; //ARRAY OF OBJECTS (items)

    // GET DATA FROM LOCAL STORAGE
    if(JSON.parse(localStorage.getItem('groceryItems')) === null){
        groceryItems = [];
    }
    else {
        groceryItems = JSON.parse(localStorage.getItem('groceryItems'));
    }
    return groceryItems;
}
function retrieveLocalStorage(){
    let groceryItems = getDataFromLocalStorage();
    if(groceryItems.length === 0){
    }else {
    groceryItems.forEach((item) => {
        addItem(item);
    });
    }
}

// ERROR EDIT MSG
function msgToUser(type, string){
    const newMessage = document.createElement('p'); 
    msg.appendChild(newMessage);
    newMessage.classList.add(`${type}`); 
    newMessage.innerText = string;
    newMessage.addEventListener('animationend', function(){
        newMessage.remove();
    });
}