$(document).ready(function () {

    const $noteTitle = $(".note-title");
    const $noteText = $(".note-textarea");
    const $saveNoteBtn = $(".save-note");
    const $newNoteBtn = $(".new-note");
    const $noteList = $(".list-container .list-group");

    // activeNote is used to keep track of the note in the textarea
    let activeNote = {};

    // A function for getting all notes from the db
    let getNotes = function() {
      return $.get("/api/notes")
    };

    // A function for saving a note to the db
    let saveNote = function(note) {
      return $.post("/api/notes", note)
    }

    // A function for deleting a note from the db
    let deleteNote = function(id) {
      return $.ajax({
        url: "api/notes/" + id,
        method: "DELETE"
      });
    };

    // If there is an activeNote, display it, otherwise render empty inputs
    let renderActiveNote = function() {
      $saveNoteBtn.hide();

      if (activeNote.id) {

        $noteTitle.attr("readonly", true);
        $noteText.attr("readonly", true);
        $noteTitle.val(activeNote.title);
        $noteText.val(activeNote.text);
      } else {
        $noteTitle.attr("readonly", false);
        $noteText.attr("readonly", false);
        $noteTitle.val("");
        $noteText.val("");
      }
    };

    // Get the note data from the inputs, save it to the db and update the view
    let handleNoteSave = function () {
      let newNote = {
          title: $noteTitle.val().trim(),
          text: $noteText.val().trim(),
          id: Math.floor(Math.random() * 89999 + 10000),
      };
      saveNote(newNote).then(function (data) {
        getAndRenderNotes();
      });
    }

    // Delete the clicked note
    let handleNoteDelete = function(event) {
      // prevents the click listener for the list from being called when the button inside of it is clicked
      event.stopPropagation();
      
      let note = $(this)
        .parent(".list-group-item")
        .data();

      //not sure what this does, having trouble with activeNote
      if (activeNote.id === note.id) {
        activeNote = {};
      }

      deleteNote(note.id).then(function() {
        getAndRenderNotes();
      });
    };

    // Sets the activeNote and displays it
    let handleNoteView = function() {
      activeNote = $(this).data();
      renderActiveNote();
    };

    // If a note's title or text are empty, hide the save button
    // Or else show it
    let handleRenderSaveBtn = function() {
      if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
        $saveNoteBtn.hide();
      } else {
        $saveNoteBtn.show();
      }
    };

    // Render's the list of note titles
    let renderNoteList = function(notes) {
      $noteList.empty();

      let noteListItems = [];

      for (let i = 0; i < notes.length; i++) {
        let note = notes[i];

        let $li = $("<li class='list-group-item'>").data(note);
        let $span = $("<span>").text(note.title);
        let $delBtn = $(
          "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
        );

        $li.append($span, $delBtn);
        noteListItems.push($li);
      }

      $noteList.append(noteListItems);
    };

    // Gets notes from the db and renders them to the sidebar
    let getAndRenderNotes = function() {
      return getNotes().then(function(data) {
        renderNoteList(data);
      });
    };

    let handleNewNoteView = function() {
        activeNote = {};
        renderActiveNote();
      };
      

    //Saving new note
    $saveNoteBtn.on("click", handleNoteSave);
    //Delete note
    $noteList.on("click", ".delete-note", handleNoteDelete);
    //View note & set active note
    $noteList.on("click", ".list-group-item", handleNoteView);

    $newNoteBtn.on("click", handleNewNoteView);

    //Render save button
    $noteTitle.on("keyup", handleRenderSaveBtn);
    $noteText.on("keyup", handleRenderSaveBtn);

    // Gets and renders the initial list of notes
    getAndRenderNotes();

});