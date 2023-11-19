import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import { SnackbarProvider } from "notistack";
import EditBook from "../src/pages/EditBook";

jest.mock("axios");

const mockedBook = {
  _id: "123",
  title: "Test Book",
  author: "Test Author",
  publishYear: "2022",
};

test("renders and edits book successfully", async () => {
  axios.get.mockResolvedValueOnce({ data: mockedBook });
  axios.put.mockResolvedValueOnce({});

  const { getByText, getByLabelText } = render(
    <SnackbarProvider>
      <MemoryRouter initialEntries={["/books/123/edit"]}>
        <Routes>
          <Route path="/books/:id/edit" element={<EditBook />} />
        </Routes>
      </MemoryRouter>
    </SnackbarProvider>
  );

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith("http://localhost:5555/books/123");
    expect(getByLabelText("Title")).toBeInTheDocument();
    expect(getByLabelText("Author")).toBeInTheDocument();
    expect(getByLabelText("Publish Year")).toBeInTheDocument();
  });

  fireEvent.change(getByLabelText("Title"), {
    target: { value: "Updated Title" },
  });
  fireEvent.change(getByLabelText("Author"), {
    target: { value: "Updated Author" },
  });
  fireEvent.change(getByLabelText("Publish Year"), {
    target: { value: "2023" },
  });

  axios.put.mockClear();
  fireEvent.click(getByText("Save"));

  await waitFor(() => {
    expect(axios.put).toHaveBeenCalledWith("http://localhost:5555/books/123", {
      title: "Updated Title",
      author: "Updated Author",
      publishYear: "2023",
    });
    expect(getByText("Book Edited successfully")).toBeInTheDocument();
  });
});

test("displays error message on book fetch failure", async () => {
  axios.get.mockRejectedValueOnce(new Error("Failed to fetch book"));

  const { findByRole } = render(
    <SnackbarProvider>
      <MemoryRouter initialEntries={["/books/123/edit"]}>
        <Routes>
          <Route path="/books/:id/edit" element={<EditBook />} />
        </Routes>
      </MemoryRouter>
    </SnackbarProvider>
  );

  try {
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("http://localhost:5555/books/123");
    });
  } catch (error) {
    // Handle the error if Axios request fails
    // You can log or handle the error here
  }

  // Ensure the error message is displayed in the Snackbar
  const errorAlert = await findByRole("alert"); // Update this to match the actual role used for the error message
  expect(errorAlert).toBeInTheDocument();
  expect(errorAlert.textContent).toMatch(
    "An error happened. Please check the console"
  );
});
