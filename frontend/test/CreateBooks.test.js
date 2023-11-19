import React, { Component } from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import CreateBooks from "../src/pages/CreateBooks";
import axios from "axios"; // Mock Axios
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";

jest.mock("axios"); // Mock Axios module

describe("CreateBooks Component Tests", () => {
  it("should update state on input change", () => {
    const { getByLabelText } = render(
      <Router>
        <CreateBooks />
      </Router>
    );

    const titleInput = getByLabelText("Title");
    const authorInput = getByLabelText("Author");
    const publishYearInput = getByLabelText("Publish Year");

    fireEvent.change(titleInput, { target: { value: "Sample Title" } });
    fireEvent.change(authorInput, { target: { value: "John Doe" } });
    fireEvent.change(publishYearInput, { target: { value: "2023" } });

    expect(titleInput.value).toBe("Sample Title");
    expect(authorInput.value).toBe("John Doe");
    expect(publishYearInput.value).toBe("2023");
  });

  it("should make an API call when Save button is clicked", async () => {
    axios.post.mockResolvedValue({}); // Mocking a successful API call

    const { getByText } = render(
      <Router>
        <CreateBooks />
      </Router>
    );
    const saveButton = getByText("Save");

    fireEvent.click(saveButton);

    // Wait for the API call to resolve
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5555/books",
        expect.objectContaining({
          title: "",
          author: "",
          publishYear: "",
        })
      );
    });
  });
});
