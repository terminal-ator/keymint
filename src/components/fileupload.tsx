import React from "react";

interface FileUploadProps {
  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
}

const FileUpload = (props: FileUploadProps) => {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      console.log(file.name);
    }
  };
  return (
    <div style={{ marginTop: 10 }}>
      <input type="file" onChange={props.onChange} />
    </div>
  );
};

export default FileUpload;
