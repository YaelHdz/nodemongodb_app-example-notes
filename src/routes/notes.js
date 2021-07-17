const express = require("express");
const router = express.Router();

const Note = require("../models/Note");

// Add New Note
router.get("/notes/add", (req, res) => {
  res.render("notes/new-note");
});

router.post("/notes/new-note", async (req, res) => {
  const { title, description } = req.body;
  const errors = [];
  if (!title) {
    errors.push({ text: "Please write a title" });
  }
  if (!description) {
    errors.push({ text: "Please write  a description" });
  }
  if (errors.length > 0) {
    res.render("notes/new-note", {
      errors,
      title,
      description,
    });
  } else {
    const newNote = new Note({ title, description });
    await newNote.save();
    req.flash("success_msg", "Note Added Successfully");
    res.redirect("/notes");
  }
});

// See All Notes
router.get("/notes", async (req, res) => {
  const notes = await Note.find().sort({ data: "desc" }).lean();
  res.render("notes/all-notes", { notes });
});

// Edit Note
router.get("/notes/edit/:id", async (req, res) => {
  const id = req.params.id;

  const editNote = await Note.findById(id);

  res.render("notes/edit-note", {
    title: editNote.title,
    description: editNote.description,
    _id: editNote._id,
  });
});

// Put = > Edit Note
router.put("/notes/edit-note/:id", async (req, res) => {
  const { title, description } = req.body;
  await Note.findByIdAndUpdate(req.params.id, { title, description });
  req.flash("success_msg", "Note Updated Successfully");
  res.redirect("/notes");
});

// Delete = > Delete Note
router.delete("/notes/delete/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Note Deleted Successfully");
  res.redirect("/notes");
});

module.exports = router;
