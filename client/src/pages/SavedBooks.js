import React, { useState, useEffect } from 'react';
import {
  // Jumbotron,
  Container,
  // CardColumns,
  Card,
  Button
} from 'react-bootstrap';

import { getMe } from '../utils/API';
import {useQuery, useMutation} from '@apollo/client';
import Auth from '../utils/auth';
import { removeBookId} from '../utils/localStorage';
import { REMOVE_BOOK } from '../utils/mutations';
import {GET_ME} from '../utils/queries';

const SavedBooks = () => {
  const {loading, data} = useQuery(GET_ME);
  const userData = data?.me || [];

  const [removeBook, {error}] = useMutation(REMOVE_BOOK);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // const response = await deleteBook(bookId, token);
      const response = await removeBook({
        variables: {
          bookId
        }
      })


      // if (!response.ok) {
      //   throw new Error('something went wrong!');
      // }

      // const updatedUser = await response.json();
      // setUserData(updatedUser);
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  // const saveBookIds = userData.savedBooks.map((book) => book.bookId);
  // saveBookIds(saveBookIds);

  return (
    <>
      <div fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2>
          {userData?.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData?.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <div>
          {userData?.savedBooks.map((book) => {
            return (
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
            );
          })}
        </div>
      </Container>
    </>
  );
};

export default SavedBooks;
