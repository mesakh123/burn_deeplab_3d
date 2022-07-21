import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { ListGroup } from 'react-bootstrap';
const getColor = (props) => {
  if (props.isDragAccept) {
    return '#00e676';
  }
  if (props.isDragReject) {
    return '#ff1744';
  }
  if (props.isFocused) {
    return '#2196f3';
  }
  return '#eeeeee';
};
const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  border-width: 2px;
  border-radius: 10px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: black;
  font-weight: bold;
  font-size: 1.4rem;
  outline: none;
  transition: border 0.24s ease-in-out;
`;
function DropBox({ onDrop }) {
  const {
    getRootProps,
    getInputProps,
    acceptedFiles,
    open,
    isDragAccept,
    isDragActive,
    isFocused,
    isDragReject,
  } = useDropzone({
    accept: 'image/*',
    onDrop,
    noClick: true,
    noKeyboard: true,
  });
  const lists = acceptedFiles.map((list) => (
    <ListGroup.Item key={list.path}>
      {list.path} - {list.size/1000000} MB
    </ListGroup.Item>
  ));
  return (
    <>
      {' '}
    <Container
        {...getRootProps({ isDragAccept, isFocused, isDragReject })}
    >
        <input {...getInputProps()} />

        <div className="text-center">
          {isDragActive ? (
            <p className="dropzone-content">
              Release to drop the files here
            </p>
          ) : (
            <p className="dropzone-content">
              Drag’ n’ drop some files here, or click to select files
            </p>
          )}
          <button type="button" onClick={open} className="btn">
            Click to select files
          </button>
        </div>
    </Container>
    <div className="text-center mt-4">
        <h4>List</h4>
        <ListGroup>{lists}</ListGroup>
    </div>
    </>
  );
}
export default DropBox;
