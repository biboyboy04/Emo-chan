import { ReactReaderStyle } from "react-reader";
console.log(ReactReaderStyle);
const readerStyles = {
  ...ReactReaderStyle,

  readerArea: {
    ...ReactReaderStyle.readerArea,
    backgroundColor: "var(--primary-color)",
    color: "var(--secondary-color)",
  },
  reader: {
    ...ReactReaderStyle.reader,
    backgroundColor: "var(--primary-color)",
    color: "white",
  },
  arrow: {
    ...ReactReaderStyle.arrow,
    backgroundColor: "transparent",
    color: "var(--secondary-color)",
    fontWeight: 100,
    fontFamily: "Playpen Sans",
  },
  tocArea: {
    ...ReactReaderStyle.tocArea,
    backgroundColor: "var(--primary-color)",
    color: "var(--secondary-color)",
  },
  tocAreaButton: {
    ...ReactReaderStyle.tocAreaButton,
    backgroundColor: "var(--primary-color)",
    color: "var(--secondary-color)",
    fontFamily: "Playpen Sans",
  },

  tocButtonBar: {
    ...ReactReaderStyle.tocButtonBar,
    backgroundColor: "var(--secondary-color)",
    color: "red",
  },
  tocButton: {
    ...ReactReaderStyle.tocButton,
    backgroundColor: "var(--primary-color)",
    color: "var(--secondary-color)",
  },
  tocButtonExpanded: {
    ...ReactReaderStyle.tocButtonExpanded,
    backgroundColor: "#b4b4b4",
  },
};

const readerStylesMobile = {
  ...readerStyles,
  arrow: {
    ...ReactReaderStyle.arrow,
    backgroundColor: "transparent",
    color: "var(--secondary-color)",
    fontWeight: 300,
    fontFamily: "Playpen Sans",
    fontSize: "2rem",
    padding: "0px",
    marginTop: "-10px",
    zIndex: "100",
  },
  next: {
    ...ReactReaderStyle.next,
    top: "10px",
    right: "10px",
  },
  prev: {
    ...ReactReaderStyle.prev,
    top: "10px",
    right: "40px",
    left: "auto",
  },
  reader: {
    ...ReactReaderStyle.reader,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    height: "calc(100% - 50px)",
    marginTop: "20px",
  },
};

export { readerStyles, readerStylesMobile };
