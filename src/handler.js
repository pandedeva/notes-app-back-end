const { nanoid } = require("nanoid");

const notes = require("./notes");

// menyimpan catatan
const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;

  // menggunakan npm nodemon agar bisa mengambil nomer acak untuk id
  const id = nanoid(16);

  const createdAt = new Date().toISOString();

  const updatedAt = createdAt;

  const newNote = {
    title,
    tags,
    body,
    id,
    createdAt,
    updatedAt,
  };

  notes.push(newNote);

  // eslint-disable-next-line no-shadow
  const isSuccess = notes.filter((notes) => notes.id === id).length > 0;

  // Jika isSuccess bernilai true, maka beri respons berhasil. Jika false, maka beri respons gagal.
  if (isSuccess) {
    const response = h.response({
      status: "success",

      message: "Catatan berhasil ditambahkan",

      data: {
        noteId: id,
      },
    });

    response.code(201);

    return response;
  }

  const response = h.response({
    status: "fail",

    message: "Catatan gagal ditambahkan",
  });

  response.code(500);

  return response;
};

// menampilkan catatan
const getAllNotesHandler = () => ({
  status: "success",
  data: {
    notes,
  },
});

// mengembalikan objek catatan secara spesifik berdasarkan id
const getNoteByIdHandler = (request, h) => {
  // dapatkan dulu nilai id dari request.params
  const { id } = request.params;

  // dapatkan objek note dengan id tersebut dari objek array notes
  const note = notes.filter((n) => n.id === id)[0];

  // pastikan objek note tidak bernilai undefined. Bila undefined, kembalikan dengan respons gagal.
  if (note !== undefined) {
    return {
      status: "success",
      data: {
        note,
      },
    };
  }
  const response = h.response({
    status: "fail",
    message: "Note Not Found",
  });
  response.code(404);
  return response;
};

// mengubah catatan
const editNoteByIdHandler = (request, h) => {
  // mendapatkan nilai id-nya terlebih dahulu
  const { id } = request.params;

  // dapatkan data notes terbaru yang dikirimkan oleh client melalui body request.
  const { title, tags, body } = request.payload;

  // perbarui nilai dari properti updatedAt. menggunakan new Date().toISOString().
  const updatedAt = new Date().toISOString();

  // dapatkan dulu index array pada objek catatan sesuai id yang ditentukan
  const index = notes.findIndex((note) => note.id === id);

  // jika index bukan = -1 maka catatan berhasil diperbarui
  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };
    const response = h.response({
      status: "success",
      message: "Catatan berhasil diperbarui",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui catatan. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

// menghapus note
const deleteNoteByIdHandler = (request, h) => {
  //  dapatkan dulu nilai id yang dikirim melalui path parameters
  const { id } = request.params;

  // dapatkan index dari objek catatan sesuai dengan id yang didapat
  const index = notes.findIndex((note) => note.id === id);

  // Lakukan pengecekan terhadap nilai index, pastikan nilainya tidak -1
  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Catatan berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Catatan gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
