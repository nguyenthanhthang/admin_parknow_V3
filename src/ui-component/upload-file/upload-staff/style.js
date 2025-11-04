import styled from "styled-components";

export const BoxUpload = styled.div`
  box-sizing: content-box;
  height: 130px;
  width: 200px;
  display: grid;
  place-items: center;
  border: 1px dashed #799cd9;
  padding: 36px 48px;
  border-radius: 20px;
  background: #fbfbff;

  .image-upload {
    display: flex;
    flex-wrap: wrap;

    label {
      cursor: pointer;

      :hover {
        opacity: 0.8;
      }
    }

    > input {
      display: none;
    }
  }
`;

export const ImagePreview = styled.div`
  position: relative;
  .close-icon {
    background: #000;
    border-radius: 5px;
    opacity: 0.8;
    position: absolute;
    z-index: 10;
    right: 15px;
    top: 20px;
    cursor: pointer;
    :hover {
      opacity: 1;
    }
  }
`;
