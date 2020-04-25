const fs = require('fs');

class Book {
    constructor() {
        const data = fs.readFileSync('./model/data.json');
        this.books = JSON.parse(data)
    }

    // Promise 예제
    getBookList() {
        if (this.books) {
            return this.books;
        }
        else {
            return [];
        }
    }

    addBook(title, writer, year, summary) {
        return new Promise((resolve, reject) => {
            let last = this.books[this.books.length - 1];
            let index = last.index + 1;

            let newBook = {index, title, writer, year, summary};
            this.books.push(newBook);

            resolve(newBook);
        });
    }

    // Promise - Reject
    getBookDetail(bookIndex) {
        return new Promise((resolve, reject) => {
            for (var book of this.books ) {
                if ( book.index == bookIndex ) {
                    resolve(book);
                    return;
                }
            }
            reject({msg:'Can not find book', code:404});
        });
    }

    getBookSearch(title, writer, year) {
        return new Promise((resolve, reject) => {
            if(title && !writer && !year){
                for (var book of this.books ) {
                    if ( book.title == title ) {
                        resolve(book);
                        return;
                    }
                }
            }
            else if(!title && writer && !year){
                for (var book of this.books ) {
                    if ( book.writer == writer ) {
                        resolve(book);
                        return;
                    }
                }
            }
            else if(!title && !writer && year){
                for (var book of this.books ) {
                    if ( book.year == year ) {
                        resolve(book);
                        return;
                    }
                }
            }
            else if(!title && writer && year){
                for (var book of this.books ) {
                    if ( book.year == year && book.writer == writer) {
                        resolve(book);
                        return;
                    }
                }
            }
            else if(title && !writer && year){
                for (var book of this.books ) {
                    if ( book.year == year && book.title == title) {
                        resolve(book);
                        return;
                    }
                }
            }
            else if(title && writer && !year){
                for (var book of this.books ) {
                    if ( book.title == title && book.writer == writer) {
                        resolve(book);
                        return;
                    }
                }
            }
            else if(title && writer && year){
                for (var book of this.books ) {
                    if ( book.year == year && book.title == title && book.writer == writer ) {
                        resolve(book);
                        return;
                    }
                }
            }

            reject({msg:'Can not find book', code:404});            
        });
    }
}

module.exports = new Book();