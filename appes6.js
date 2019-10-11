class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }

}
class UI {
    addBookToList(book){
        const list = document.getElementById('book-list');
        //create tr element
        const row = document.createElement('tr');
        // insert cols
        row.innerHTML =`
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete" >X</a></td>
        `;
        list.appendChild(row);
        // console.log(book);


    }

    showAlert(message, className){
                // create div
        const div = document.createElement('div');
        //add classes
        div.className = `alert ${className}`
        //add text
        div.appendChild(document.createTextNode(message));
        //get parent
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        //insert alert
        container.insertBefore(div, form);
        // timeout after 3 sec
        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 3000);

    }

    deleteBook(target){
        if(target.className === 'delete'){
            target.parentElement.parentElement.remove();
        }

    }

    clearfields(){
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';

    }
}
//Local Storage Class

class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static displayBooks(){
        const books = Store.getBooks();
        books.forEach(function(book){
            const ui = new UI;
            //add book to ui
            ui.addBookToList(book);

        });

    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static  removeBook(isbn){
        const books = Store.getBooks();
        books.forEach(function(book, index){
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));

    }
}

//DOM load event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

//event listeners add Book
document.getElementById('book-form').addEventListener('submit', function(e){
    //get form values
    const title = document.getElementById('title').value,
    author = document.getElementById('author').value,
    isbn = document.getElementById('isbn').value;
    
    //instantiate book
    const book = new Book(title, author, isbn);

    //instantiate UI
    const ui = new UI();
   
    //validations
    if(title === '' || author === '' || isbn === ''){
        //error alert
        ui.showAlert("Please fill in all fields", 'error');
    }else{
    
    //add book to list
    ui.addBookToList(book);

    //add BOOK to LS
    Store.addBook(book);




    //show success
    ui.showAlert('Book Added!', 'success');


    ui.clearfields();
    }

    e.preventDefault();
});

//Event Listener for delete
document.getElementById('book-list').addEventListener('click', function(e){
    //Instantiate UI
    const ui = new UI();
    //delete book
    ui.deleteBook(e.target);
    //REMOVE from LS
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //show message.
    ui.showAlert('Book Removed!', 'success');

    e.preventDefault();
});