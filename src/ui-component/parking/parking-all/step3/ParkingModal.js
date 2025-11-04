/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment } from "react";
import { Stage, Layer, Rect, Text, Image } from "react-konva";
import carIcon from "../../../../assets/images/Car.svg";
import { useEffect } from "react";
import { useState } from "react";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { setCarSlots } from "store/parkingModalSlice";
import FormInput from "./FormInput";

const ParkingModal = ({ floorIndex }) => {
  const dispatch = useDispatch();
  const slotWidth = 150;
  const slotHeight = 120;
  const spacing = 15;
  const stagePadding = 40;

  const storedParkingModal = localStorage.getItem("parkingModalState");
  const parsedParkingModal = JSON.parse(storedParkingModal);
  const initialParkingModal = parsedParkingModal ? parsedParkingModal : {};
  console.log("initialParkingModal", initialParkingModal);

  const { numCarSlots, numCarRows, numCarCols, carSlots } = useSelector(
    (state) => state.parkingModal[floorIndex]
  );

  const saveParkingModalState = () => {
    const updatedParkingModal = {
      ...initialParkingModal,
      [floorIndex]: {
        floor: floorIndex + 1,
        numCarSlots: numCarCols,
        numCarRows: numCarRows,
        numCarCols: numCarCols,
        carSlots: carSlots,
      },
    };
    // Store the updatedParkingModal in localStorage
    localStorage.setItem(
      "parkingModalState",
      JSON.stringify(updatedParkingModal)
    );
  };

  useEffect(() => {
    saveParkingModalState();
  }, [floorIndex, numCarSlots, numCarRows, numCarCols, carSlots]);

  //   const numRows = numCarRows;
  //   const numColumns = numCarColumns;

  const [stageWidth, setStageWidth] = useState(
    numCarCols * (slotWidth + spacing) + stagePadding * 2
  );
  const [stageHeight, setStageHeight] = useState(
    numCarRows * (slotHeight + spacing) + stagePadding * 2
  );

  const [carImage, setCarImage] = useState(null);

  useEffect(() => {
    const loadImages = async () => {
      const carImageObject = await loadImage(carIcon);
      setCarImage(carImageObject);
    };

    loadImages();
  }, []);

  const loadImage = (imagePath) => {
    return new Promise((resolve, reject) => {
      const image = new window.Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = imagePath;
    });
  };

  useEffect(() => {
    if (carSlots.length === 0) {
      const calculatedCarSlots = [];
      for (let row = 0; row < numCarRows; row++) {
        for (let col = 0; col < numCarCols; col++) {
          const slotIndex = row * numCarCols + col;
          if (slotIndex >= numCarSlots) break; // Stop creating slots if the limit is reached

          calculatedCarSlots.push({
            id: `car-${row}-${col}`,
            trafficId: 1,
            row: row,
            column: col,
            x: col * (slotWidth + spacing) + stagePadding,
            y: row * (slotHeight + spacing) + stagePadding,
            name: `C${slotIndex + 1}`,
            isDragging: false,
          });
        }
      }
      dispatch(
        setCarSlots({ floorIndex: floorIndex, carSlots: calculatedCarSlots })
      );
    }

    const newStageWidth = numCarCols * (slotWidth + spacing) + stagePadding * 2;
    const newStageHeight =
      numCarRows * (slotHeight + spacing) + stagePadding * 2;
    setStageWidth(newStageWidth);
    setStageHeight(newStageHeight);
    saveParkingModalState();
  }, [
    numCarCols,
    numCarRows,
    numCarSlots,
    slotWidth,
    slotHeight,
    spacing,
    stagePadding,
  ]);

  const handleDragStart = (slotId) => {
    const updatedCarSlots = carSlots.map((slot) => {
      if (slot.id === slotId) {
        return { ...slot, isDragging: true };
      }
      return slot;
    });
    setCarSlots(updatedCarSlots);
  };

  const handleDragEnd = (e, slotId) => {
    const updatedSlots = carSlots.map((slot) => {
      if (slot.id === slotId) {
        const { x, y } = e.target.position();
        const row = Math.floor((y - stagePadding) / (slotHeight + spacing));
        const col = Math.floor((x - stagePadding) / (slotWidth + spacing));

        if (row < 0 || row >= numCarRows || col < 0 || col >= numCarCols) {
          Swal.fire({
            icon: "error",
            title: "Sai vị trí",
            text: "Chỉ kéo vị trí trong khoảng hàng, cột chính",
          });
          e.target.setAttrs({
            x: slot.x + 40,
            y: slot.y + 55,
          });
          return {
            ...slot,
            isDragging: false,
          };
        }

        const targetSlot = carSlots.find(
          (s) => s.column === col && s.row === row
        );
        if (targetSlot && targetSlot.id !== slotId) {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Vị trí này đã có xe đỗ",
          });
          e.target.setAttrs({
            x: slot.x + 40,
            y: slot.y + 55,
          });
          return {
            ...slot,
            isDragging: false,
          };
        }

        const newX = col * (slotWidth + spacing) + stagePadding;
        const newY = row * (slotHeight + spacing) + stagePadding;

        return {
          ...slot,
          row,
          column: col,
          x: newX,
          y: newY,
          isDragging: false,
        };
      }
      return slot;
    });

    dispatch(
      setCarSlots({
        floorIndex: floorIndex,
        carSlots: updatedSlots,
      })
    );

    saveParkingModalState();
  };

  return (
    <div className="scrollable-container">
      <div className="stage-container">
        <FormInput floorIndex={floorIndex} />

        <div className="scrollable-stage">
          <Stage width={stageWidth} height={stageHeight} draggable>
            <Layer>
              {carSlots ? (
                carSlots?.map((slot) => (
                  <Fragment key={slot.id}>
                    <Rect
                      x={slot.x}
                      y={slot.y}
                      width={slotWidth}
                      height={slotHeight}
                      fill={slot.isDragging ? "red" : "lightblue"}
                      stroke="black"
                      strokeWidth={1}
                      draggable={!slot.isDragging}
                      onDragStart={() => handleDragStart(slot.id)}
                      onDragEnd={(e) => handleDragEnd(e, slot.id)}
                      dash={[5, 5]}
                      cornerRadius={10}
                    />
                    <Text
                      x={slot.x + 5}
                      y={slot.y - 25}
                      fill="#5e35b1"
                      width={slotWidth - 10}
                      height={slotHeight - 10}
                      text={slot.name}
                      fontSize={14}
                      align="center"
                      verticalAlign="middle"
                      fontStyle="bold"
                    />
                    {carImage && (
                      <Image
                        image={carImage}
                        align="center"
                        x={slot.x + 40} // Adjust the position as needed
                        y={slot.y + 55} // Adjust the position as needed
                        width={slotWidth - 75} // Adjust the size as needed
                        height={slotHeight - 75} // Adjust the size as needed
                        draggable
                        dash={[5, 5]}
                        onDragStart={() => handleDragStart(slot.id)}
                        onDragEnd={(e) => handleDragEnd(e, slot.id)}
                      />
                    )}
                  </Fragment>
                ))
              ) : (
                <></>
              )}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ParkingModal);
