import ImageSlider from "./ImageSlider";
const ImageParking = () => {
  const slides = [
    {
      url: "https://hips.hearstapps.com/hmg-prod/images/champagne-beach-espiritu-santo-island-vanuatu-royalty-free-image-1655672510.jpg?crop=1.00xw:0.752xh;0,0.173xh&resize=1200:*",
      title: "beach",
    },
    {
      url: "https://hips.hearstapps.com/hmg-prod/images/algarve-beach-royalty-free-image-1679002691.jpg?crop=0.784xw:1.00xh;0.216xw,0&resize=980:*",
      title: "boat",
    },
    {
      url: "https://hips.hearstapps.com/hmg-prod/images/pier-over-lake-against-sky-at-dusk-royalty-free-image-1655669424.jpg?crop=0.662xw:1.00xh;0.162xw,0&resize=980:*",
      title: "forest",
    },
    {
      url: "https://hips.hearstapps.com/hmg-prod/images/view-from-clifftop-navagio-bay-zakynthos-greece-royalty-free-image-1655672211.jpg?crop=0.66682xw:1xh;center,top&resize=980:*",
      title: "city",
    },
    {
      url: "https://hips.hearstapps.com/hmg-prod/images/gros-piton-the-famous-volcanic-peak-in-st-lucia-royalty-free-image-1655669896.jpg?crop=0.668xw:1.00xh;0.156xw,0&resize=980:*",
      title: "italy",
    },
  ];
  const containerStyles = {
    width: "700px",
    height: "500px",
    margin: "0 auto",
    marginTop: "10%",
  };
  return (
    <div>
      <h1>Hello monsterlessons</h1>
      <div style={containerStyles}>
        <ImageSlider slides={slides} />
      </div>
    </div>
  );
};

export default ImageParking;
