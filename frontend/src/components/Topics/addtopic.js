import React, { useState } from "react";
import "./addtopic.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Modal from "react-modal";

Modal.setAppElement("#root");

const AddTopic = () => {
  const navigate = useNavigate();
  const { idCurso } = useParams();
  const location = useLocation();
  const cursoTitulo = location.state?.cursoTitulo || "Curso no especificado";

  const [youtubeLinks, setYoutubeLinks] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [fileDescription, setFileDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [newYoutubeLink, setNewYoutubeLink] = useState("");
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [material, setMaterial] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleNextClick = async () => {
    if (titulo.trim() === "") {
      setErrorMessage("El título es obligatorio.");
      console.log("Error:", "El título es obligatorio.");
      return;
    }
    setErrorMessage("");

    const data = {
      idCurso,
      titulo,
      subtitulo,
      material,
      youtubeLinks,
      uploadedFiles: uploadedFiles.map(({ file, description }) => ({
        name: file.name,
        description,
      })),
    };

    if (uploadedFiles.length > 0) {
      try {
        const formData = new FormData();
        formData.append("tema", titulo); 
        uploadedFiles.forEach(({ file }) => {
          formData.append("file", file);
        });

        const response = await fetch("http://localhost:3000/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Error al subir archivos");
        }

        console.log("Archivos subidos exitosamente");
      } catch (error) {
        console.error(error);
        setErrorMessage("Hubo un problema al subir los archivos.");
        return;
      }
    }

    navigate(`/anadir-tema/${idCurso}/grafica`, {
      state: { cursoTitulo, data },
    });
  };

  const handleOpenModal = () => setModalIsOpen(true);
  const handleCloseModal = () => {
    setModalIsOpen(false);
    setFileDescription("");
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setFileList(files);
  };

  const handleAddFile = () => {
    const newFiles = fileList.map((file) => ({
      file,
      description: fileDescription,
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
    setFileList([]);
    setFileDescription("");
    handleCloseModal();
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleEditDescription = (index, newDescription) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles[index].description = newDescription;
    setUploadedFiles(updatedFiles);
  };

  const handleAddYoutubeLink = () => {
    if (newYoutubeLink.trim() !== "") {
      setYoutubeLinks([...youtubeLinks, newYoutubeLink.trim()]);
      setNewYoutubeLink("");
    }
  };

  const handleRemoveYoutubeLink = (index) => {
    setYoutubeLinks(youtubeLinks.filter((_, i) => i !== index));
  };

  const handleEditYoutubeLink = (index, newLink) => {
    const updatedLinks = [...youtubeLinks];
    updatedLinks[index] = newLink;
    setYoutubeLinks(updatedLinks);
  };

  return (
    <div className="add-topic-container">
      <h1 className="tema">Añadir Tema para {cursoTitulo}</h1>
      <form>
        <div className="section">
          <h2>Teoría</h2>
          <div className="titulos">
            <div className="input-group-2">
              <input
                type="text"
                placeholder="Título *"
                value={titulo}
                onChange={(e) => {
                  setTitulo(e.target.value);
                  setErrorMessage("");
                }}
              />
              <input
                type="text"
                placeholder="Subtítulo"
                value={subtitulo}
                onChange={(e) => setSubtitulo(e.target.value)}
              />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
        </div>
        <div className="section">
          <h2>Material</h2>
          <textarea
            className="material-content"
            placeholder="Material"
            rows="10"
            cols="20"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
          ></textarea>
        </div>

        <div className="section attachment-sections">
          <div className="attachment-section">
            <h2>Enlaces</h2>
            <input
              type="text"
              placeholder="Añadir enlace"
              value={newYoutubeLink}
              onChange={(e) => setNewYoutubeLink(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAddYoutubeLink}
              style={{ marginTop: "10px" }}
            >
              Añadir
            </button>
            <ul className="youtube-links-list">
              {youtubeLinks.map((link, index) => (
                <li key={index}>
                  <input
                    type="text"
                    value={link}
                    onChange={(e) =>
                      handleEditYoutubeLink(index, e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveYoutubeLink(index)}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="attachment-section">
            <h2>Archivos Subidos</h2>
            <button type="button" onClick={handleOpenModal}>
              Subir
            </button>
            <ul className="uploaded-files">
              {uploadedFiles.map((fileObj, index) => (
                <li key={index}>
                  <span>{fileObj.file.name}</span>
                  <input
                    type="text"
                    value={fileObj.description}
                    onChange={(e) =>
                      handleEditDescription(index, e.target.value)
                    }
                  />
                  <button type="button" onClick={() => handleRemoveFile(index)}>
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="input-conf">
          <button
            type="button"
            className="next-button"
            onClick={handleNextClick}
          >
            Siguiente
          </button>
        </div>
        <div className="dots">
          <span className="dot"></span>
          <span className="dot active"></span>
          <span className="dot"></span>
        </div>
      </form>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Subir Archivos</h2>
        <input type="file" multiple onChange={handleFileUpload} />
        <input
          type="text"
          placeholder="Descripción del archivo"
          value={fileDescription}
          onChange={(e) => setFileDescription(e.target.value)}
        />
        <div className="modal-button-container">
          <a className="modalb1" type="button" onClick={handleAddFile}>
            Añadir archivo
          </a>
          <a className="modalb2" type="button" onClick={handleCloseModal}>
            Cerrar
          </a>
        </div>
      </Modal>
    </div>
  );
};

export default AddTopic;
