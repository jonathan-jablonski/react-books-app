import React, { useState, useEffect } from "react";
import Jumbotron from "../components/Jumbotron";
import DeleteBtn from "../components/DeleteBtn";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import { Input, TextArea, FormBtn } from "../components/Form";
import { Link } from "react-router-dom";
import API from "../utils/API";

function Books() {
  // Initialize books as an empty array
    const [books, setBooks] = useState([]);
    const [formObject, setFormObject] = useState({})
    const initialBookData = {
      title: "",
      author: "",
      synopsis: "",
    }

    
    useEffect(() => {
      loadBooks();
    }, []);

    function loadBooks() {
      // Add code here to get all books from the database and store them using setBooks
      API.getBooks(books)
        .then(res => {
          console.log(res.data)
          setBooks(res.data)
        })
        .catch(err => console.log(err));
    };

    function handleFormSubmit(e) {
      // add code here to post a new book to the api
      e.preventDefault();

      API.saveBook(formObject)
        .then(res => {
          console.log(res.data);
          setFormObject(initialBookData);
          loadBooks();
      })
      .catch(err => console.log(err))
    }

    function deleteBook(id) {
      // add code here to remove a book using API
      API.deleteBook(id)
        .then(res => {
          console.log(res.data);
          loadBooks();
        })
        .catch(err => console.log(err));
    }
    
    const { title, author, synopsis } = formObject;

    return (
      <Container fluid>
        <Row>
          <Col size="md-6">
            <Jumbotron>
              <h1>What Books Should I Read?</h1>
            </Jumbotron>
            <form>
              <Input 
                name="title" 
                placeholder="Title (required)" 
                onChange={(e) => setFormObject({...formObject, title: e.target.value })}
                value={title}
              />
              <Input 
                name="author" 
                placeholder="Author (required)" 
                onChange={(e) => setFormObject({...formObject, author: e.target.value })}
                value={author}
                />
              <TextArea 
                name="synopsis" 
                placeholder="Synopsis (Optional)" 
                onChange={(e) => setFormObject({...formObject, synopsis: e.target.value })}
                value={synopsis}
                />
              <FormBtn
                disabled={!(author && title)}
                onClick={handleFormSubmit}
              >
                Submit Book
              </FormBtn>
            </form>
          </Col>
          <Col size="md-6 sm-12">
            <Jumbotron>
              <h1>Books On My List</h1>
            </Jumbotron>
            {books.length ? (
              <List>
                {books.map(book => (
                  <ListItem key={book._id}>
                    <Link to={"/books/" + book._id}>
                      <strong>
                        {book.title} by {book.author}
                      </strong>
                    </Link>
                    <DeleteBtn onClick={_ => deleteBook(book._id)}/>
                  </ListItem>
                ))}
              </List>
            ) : (
              <h3>No Results to Display</h3>
            )}
          </Col>
        </Row>
      </Container>
    );
  }

export default Books;
