import React, { useState } from "react";

export default function AddImage({ captureFile, onSubmit }) {
  return (
    <div className="container rounded border border-5 border-primary p-3 m-2">
      <h2>Add Image</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <input
            type="file"
            className="form-control"
            id="title"
            onChange={captureFile}
            aria-describedby="emailHelp"
          />
        </div>

        <button type="submit" className="btn btn-success btn-lg">
          Add
        </button>
      </form>
    </div>
  );
}
