const express = require('express');
const bodyParser = require('body-parser');
const books = require('./books.json');
const fs = require('fs');

const PORT = 5000;

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).json(books);
})

app.get('/:id', (req, res) => {
    const book = books.find((book) => book.id == req.params.id);
    if (!book) {
        res.status(404).send('Book not found');
    }else {
        res.status(200).json(book);
    }
})

app.post('/', (req, res) => {
    if (req.body.title && req.body.author) {
        const newBook = {
            id: Math.floor((Math.random() + 1) * 100000),
            title: req.body.title,
            author: req.body.author
        };
        books.push(newBook);
        fs.writeFile("books.json", JSON.stringify(books), (err) => {
            if (err) {
                console.log(err);
            }
        });
        res.status(201).json(newBook);
    }else {
        res.status(404).send('The Title or Author fields are empty.');
    }

})


app.put('/:id', (req, res) => {
    const bookIndex = books.findIndex((book) => book.id == req.params.id);
    if (bookIndex  == -1) {
        res.status(404).send('Book not found');
    }else{
        if (req.body.title && req.body.author) {
            books[bookIndex].title = req.body.title;
            books[bookIndex].author = req.body.author;
            fs.writeFile("books.json", JSON.stringify(books), (err) => {
                if (err) {
                    console.log(err);
                }
            });
            res.status(200).json(books[bookIndex]);
        }else {
            res.status(404).send('The Title or Author fields are empty.');
        }
    }

})

app.delete('/:id', (req, res) => {
    const bookIndex = books.findIndex((book) => book.id == req.params.id);
    if (bookIndex  == -1) {
        res.status(404).send('Book not found');
    }else {
        books.splice(bookIndex, 1);
        fs.writeFile("books.json", JSON.stringify(books), (err) => {
            if (err) {
                console.log(err);
            }
        });
        res.status(200).send(`Book ${req.params.id} deleted`);
    }
})

app.listen(PORT, () => console.log(`SERVER STARTED ON PORT ${PORT}`))