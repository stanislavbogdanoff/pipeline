const express = require("express");
const request = require("supertest");
const { Book } = require("../models/bookModel.js");
import router from "../routes/booksRoute.js";

jest.mock("../models/bookModel.js");

const app = express();
app.use(express.json());
app.use("/", router);

describe("Book API Routes", () => {
  // Test for POST / - Save a new Book
  it("should save a new book", async () => {
    const bookData = {
      title: "Sample Book",
      author: "John Doe",
      publishYear: 2023,
    };

    Book.create.mockResolvedValue(bookData);

    const response = await request(app).post("/").send(bookData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject(bookData);
  });

  // Test for GET / - Get All Books from database
  it("should get all books", async () => {
    const books = [
      { title: "Book 1", author: "Author 1", publishYear: 2022 },
      { title: "Book 2", author: "Author 2", publishYear: 2021 },
    ];

    Book.find.mockResolvedValue(books);

    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data).toEqual(expect.arrayContaining(books));
  });

  // Test for GET /:id - Get One Book from database by ID
  it("should get a book by ID", async () => {
    const mockBook = {
      _id: "someId",
      title: "Test Book",
      author: "Test Author",
      publishYear: 2023,
    };

    Book.findById.mockResolvedValue(mockBook);

    const response = await request(app).get(`/${mockBook._id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockBook);
  });

  // Test for PUT /:id - Update a Book by ID
  it("should update a book by ID", async () => {
    const mockUpdatedBook = { message: "Book updated successfully" };
    const mockBookId = "someId";

    Book.findByIdAndUpdate.mockResolvedValue(mockUpdatedBook);

    const response = await request(app).put(`/${mockBookId}`).send({
      title: "Updated Title",
      author: "Updated Author",
      publishYear: 2023,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUpdatedBook);
  });

  // Test for DELETE /:id - Delete a Book by ID
  it("should delete a book by ID", async () => {
    const mockDeleteMessage = { message: "Book deleted successfully" };
    const mockBookId = "someId";

    Book.findByIdAndDelete.mockResolvedValue(mockDeleteMessage);

    const response = await request(app).delete(`/${mockBookId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockDeleteMessage);
  });
});
