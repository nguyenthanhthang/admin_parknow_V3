/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment } from "react";
import { Stage, Layer, Rect, Text, Image } from "react-konva";
import carIcon from "../../../assets/images/Car.svg";
import motorbikeIcon from "../../../assets/images/Motor.svg";
import { useEffect } from "react";
import { useState } from "react";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { setCarSlots, setMotorbikeSlots } from "store/parkingModalSlice";
import FormInput from "./FormInput";

const ParkingModal = ({ floorIndex }) => {
  const [draggingType, setDraggingType] = useState(null);
  const dispatch = useDispatch();
  const slotWidth = 150;
  const slotHeight = 120;
  const spacing = 15;
  const stagePadding = 40;

  const storedParkingModal = localStorage.getItem("parkingModalState");
  const parsedParkingModal = JSON.parse(storedParkingModal);
  const initialParkingModal = parsedParkingModal ? parsedParkingModal : {};

  const {
    numCarSlots,
    numMotorbikeSlots,
    numMotorbikeRows,
    numMotorbikeColumns,
    numCarRows,
    numCarColumns,
    carSlots,
    motorbikeSlots,
  } = useSelector((state) => state.parkingModal[floorIndex]);

  const saveParkingModalState = () => {
    const updatedParkingModal = {
      ...initialParkingModal,
      [floorIndex]: {
        floor: floorIndex + 1,
        numCarSlots,
        numMotorbikeSlots,
        numMotorbikeRows,
        numMotorbikeColumns,
        numCarRows,
        numCarColumns,
        carSlots,
        motorbikeSlots,
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
  }, [
    floorIndex,
    numCarSlots,
    numMotorbikeSlots,
    numMotorbikeRows,
    numMotorbikeColumns,
    numCarRows,
    numCarColumns,
    carSlots,
    motorbikeSlots,
  ]);

  const numRows = numCarRows + numMotorbikeRows;
  const numColumns = Math.max(numCarColumns, numMotorbikeColumns);

  const [stageWidth, setStageWidth] = useState(
    numColumns * (slotWidth + spacing) + stagePadding * 2
  );
  const [stageHeight, setStageHeight] = useState(
    numRows * (slotHeight + spacing) + stagePadding * 2
  );

  const [carImage, setCarImage] = useState(null);
  const [motorbikeImage, setMotorbikeImage] = useState(null);

  useEffect(() => {
    const loadImages = async () => {
      const carImageObject = await loadImage(carIcon);
      const motorbikeImageObject = await loadImage(motorbikeIcon);
      setCarImage(carImageObject);
      setMotorbikeImage(motorbikeImageObject);
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
    if (carSlots.length === 0 || motorbikeSlots.length === 0) {
      const calculatedCarSlots = [];
      for (let row = 0; row < numCarRows; row++) {
        for (let col = 0; col < numCarColumns; col++) {
          const slotIndex = row * numCarColumns + col;
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

      const calculatedMotorbikeSlots = [];
      for (let row = numCarRows; row < numRows; row++) {
        for (let col = 0; col < numMotorbikeColumns; col++) {
          const slotIndex = numMotorbikeColumns * (row - numCarRows) + col;
          if (slotIndex >= numMotorbikeSlots) break;

          calculatedMotorbikeSlots.push({
            id: `motorbike-${row}-${col}`,
            trafficId: 2,
            row: row,
            column: col,
            x: col * (slotWidth + spacing) + stagePadding,
            y: row * (slotHeight + spacing) + stagePadding,
            name: `M${slotIndex + 1}`,
            isDragging: false,
          });
        }
      }
      dispatch(
        setMotorbikeSlots({
          floorIndex: floorIndex,
          motorbikeSlots: calculatedMotorbikeSlots,
        })
      );
    }

    const newStageWidth = numColumns * (slotWidth + spacing) + stagePadding * 2;
    const newStageHeight = numRows * (slotHeight + spacing) + stagePadding * 2;
    setStageWidth(newStageWidth);
    setStageHeight(newStageHeight);
    saveParkingModalState();
  }, [
    numRows,
    numColumns,
    numMotorbikeColumns,
    numMotorbikeRows,
    numCarColumns,
    numCarRows,
    numCarSlots,
    numMotorbikeSlots,
    slotWidth,
    slotHeight,
    spacing,
    stagePadding,
  ]);

  const handleDragStart = (slotId) => {
    const updatedCarSlots = carSlots.map((slot) => {
      if (slot.id === slotId) {
        setDraggingType("car");
        return { ...slot, isDragging: true };
      }
      return slot;
    });
    setCarSlots(updatedCarSlots);

    const updatedMotorbikeSlots = motorbikeSlots.map((slot) => {
      if (slot.id === slotId) {
        setDraggingType("motorbike");
        return { ...slot, isDragging: true };
      }
      return slot;
    });
    console.log("draggingType", draggingType);
    setMotorbikeSlots(updatedMotorbikeSlots);
  };

  const handleDragEnd = (e, slotId) => {
    const updatedSlots = [...carSlots, ...motorbikeSlots].map((slot) => {
      if (slot.id === slotId) {
        const { x, y } = e.target.position();
        const row = Math.floor((y - stagePadding) / (slotHeight + spacing));
        const col = Math.floor((x - stagePadding) / (slotWidth + spacing));

        // Check if the dropped position overlaps with any existing slots of a different type
        const isOverlap = (
          draggingType === "car" ? carSlots : motorbikeSlots
        ).some(
          (otherSlot) =>
            otherSlot.id !== slotId &&
            otherSlot.row === row &&
            otherSlot.column === col &&
            otherSlot.type !== draggingType
        );

        // Check if the dropped position overlaps with any slots occupied by cars
        const isCarOverlap = carSlots.some(
          (carSlot) =>
            carSlot.id !== slotId &&
            carSlot.row === row &&
            carSlot.column === col
        );

        if (
          row < 0 ||
          row >= numRows ||
          col < 0 ||
          col >= numColumns ||
          isOverlap ||
          (draggingType === "motorbike" && isCarOverlap)
        ) {
          Swal.fire({
            icon: "error",
            title: "Sai vị trí",
            text: "Chỉ kéo vị trí trong khoảng hàng, cột chính và không chồng lên nhau",
          });
          if (draggingType === "car") {
            e.target.setAttrs({
              x: slot.x + 40,
              y: slot.y + 55,
            });
          } else if (draggingType === "motorbike") {
            e.target.setAttrs({
              x: slot.x + 35,
              y: slot.y + 50,
            });
          }
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
        carSlots: updatedSlots.filter((slot) => slot.id.startsWith("car")),
      })
    );
    dispatch(
      setMotorbikeSlots({
        floorIndex: floorIndex,
        motorbikeSlots: updatedSlots.filter((slot) =>
          slot.id.startsWith("motorbike")
        ),
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
              {carSlots?.map((slot) => (
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
              ))}
              {motorbikeSlots ? (
                <>
                  {motorbikeSlots?.map((slot) => (
                    <Fragment key={slot.id}>
                      <Rect
                        x={slot.x}
                        y={slot.y}
                        width={slotWidth}
                        height={slotHeight}
                        fill={slot.isDragging ? "yellow" : "lightgreen"}
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
                        y={slot.y - 20}
                        width={slotWidth - 10}
                        height={slotHeight - 10}
                        text={slot.name}
                        fontSize={12}
                        align="center"
                        verticalAlign="middle"
                        fontStyle="bold"
                      />
                      {motorbikeImage && (
                        <Image
                          image={motorbikeImage}
                          align="center"
                          x={slot.x + 35} // Adjust the position as needed
                          y={slot.y + 50} // Adjust the position as needed
                          width={slotWidth - 75} // Adjust the size as needed
                          height={slotHeight - 65} // Adjust the size as needed
                          draggable
                          dash={[5, 5]}
                          onDragStart={() => handleDragStart(slot.id)}
                          onDragEnd={(e) => handleDragEnd(e, slot.id)}
                        />
                      )}
                    </Fragment>
                  ))}
                </>
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
