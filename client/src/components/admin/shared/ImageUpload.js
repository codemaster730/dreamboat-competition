import React from "react";

import { Button } from "reactstrap";

import defaultImage from "assets/img/Upload-PNG-Image-File.png";

function ImageUpload(props) {
  const [file, setFile] = React.useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState(defaultImage);


  if(props.boatImages[0]){
    setImagePreviewUrl(props.boatImages[0]);
    //const [imagePreviewUrl, setImagePreviewUrl] = React.useState(props.boatImages[0]);
  }else{
    
  }
  
  //
  // const [banner, setBanner] = React.useState("");
  const fileInput = React.createRef();
  const handleImageChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      setFile(file);
      setImagePreviewUrl(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
    
  };

  const handleClick = () => {
    fileInput.current.click();
  };

  // const handleRemove = () => {
  //   setFile(null);
  //   setImagePreviewUrl(defaultImage);
  //   fileInput.current.value = null;
  // };

  return (
    <div className="fileinput text-center">
      <input type="file" onChange={handleImageChange} ref={fileInput} />
      <div
        className={
          "fileinput-new thumbnail"
        }
      >
        <img src={imagePreviewUrl} alt="..." />
      </div>
      <div>
        {file === null ? (
          <Button className="btn-cpp" onClick={handleClick}>
            Click Here To Upload
          </Button>
        ) : (
          <span>
            <Button className="btn-cpp" onClick={handleClick}>
              Change
            </Button>
            {null}
            <Button color="primary" className="btn-cpp" onClick={() => props.handleUploadEvent(file)}>
              <i className="now-ui-icons arrows-1_cloud-upload-94"/> Submit
            </Button>
          </span>
        )}
      </div>
      <p className="description">Please upload file with 256*256 size to make the super look</p>
      {/* <div className="text-banner">
        <FormGroup>
          <Input
            value={banner}
            defaultValue=""
            placeholder="Your Text Banner Here"
            type="text"
            onChange={e => setBanner(e.target.value)}
          ></Input>
        </FormGroup>
      </div> */}
    </div>
  );
}

export default ImageUpload;
