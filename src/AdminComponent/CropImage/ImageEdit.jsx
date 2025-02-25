import React, { useEffect, useRef, useState } from "react";
import { CropperRef, Cropper } from "react-advanced-cropper";
import getCroppedImg from "./CropImage";

const ImageEdit = ({
  modalVisible,
  setModalVisible2,
  setCroppedImage,
  setCroppedImageUrl,
  image,
}) => {
  const [edit, setEdit] = useState(true);
  const cropperRef = useRef(null);
  const [imageName, setImageName] = useState();
  const [files, setFiles] = useState([]);
  const [selectedImage, setSelectedImage] = useState({ blob: image });
  const [finish, setFinish] = useState(true);

  console.log(selectedImage, image);

  const onCrop = async () => {
    try {
      if (cropperRef.current) {
        const pixelCrop = cropperRef.current.getCoordinates();
        console.log(pixelCrop);
        const croppedImageData = await getCroppedImg(
          selectedImage,
          pixelCrop,
          imageName
        );
        
        setCroppedImage(croppedImageData);
        setCroppedImageUrl(URL.createObjectURL(croppedImageData));

        if (!edit) {
          setModalVisible2(false);
        }
      } else {
        console.error("error on image uploading");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const closeModal = () => {
    setModalVisible2(false);
  };

  const onFileSelection = (e, key) => {
    setImageName(e.target.files[0].name);
    setFiles({ ...files, [key]: e.target.files[0] });
    setSelectedImage(URL.createObjectURL(e.target.files[0]));
    if (e.target.files[0]) {
      setModalVisible2(true);
    }
  };

  const handleCropChange = () => {
    console.log("Cropping...");
  };

  useEffect(() => {
    if (image) {
      setSelectedImage({ blob: image });
    }
  }, [image]);

  return (
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Selected Image</h5>
          <button
            type="button"
            className="close close_btn"
            onClick={() => {
              closeModal();
              // const fileInput = document.getElementById("cateImgEdit");
              // if (fileInput) {
              //   fileInput.value = "";
              // }
            }}
          >
            <span aria-hidden="true">
              <i class="fa-solid fa-xmark"></i>
            </span>
          </button>
        </div>
        <p className="my-3 text-center">
          Zoom & Drag to crop & select the image
        </p>
        {edit ? (
          <div className="ps-2 pe-4">
            <input
              type="file"
              className="form-control mx-2 w-100 py-3"
              defaultValue=""
              accept="image/*"
              name="editImage"
              id="editImage"
              onChange={(e) => onFileSelection(e, "editImage")}
            />
          </div>
        ) : null}
        <div style={{ height: "400px" }} className="modal-body">
          <div style={{ height: "400px" }} className="modal-body">
            <Cropper
              key={selectedImage || image} // Force re-render on source change
              ref={cropperRef}
              src={selectedImage}
              onChange={handleCropChange}
              className={"cropper"}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="comman_btn"
            onClick={() => {
              onCrop();
              setFinish(false);
              setEdit(false);
              setModalVisible2(false);
            }}
            disabled={!selectedImage}
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageEdit;
