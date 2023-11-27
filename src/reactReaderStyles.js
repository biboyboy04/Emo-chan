import { ReactReaderStyle } from "react-reader";
const readerStyles = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    backgroundColor: "white",
    color: "black",
    fontWeight: 100,
    fontFamily: "Playpen Sans",
  },
  tocArea: {
    ...ReactReaderStyle.tocArea,
    backgroundColor: "white",
    color: "black",
  },
  tocAreaButton: {
    ...ReactReaderStyle.tocAreaButton,
    backgroundColor: "white",
    color: "black",
    fontFamily: "Playpen Sans",
  },
  tocButtonBar: {
    ...ReactReaderStyle.tocButtonBar,
    backgroundColor: "black",
  },
  tocButton: {
    ...ReactReaderStyle.tocButton,
    backgroundColor: "white",
    color: "black",
  },
  tocButtonExpanded: {
    ...ReactReaderStyle.tocButtonExpanded,
    backgroundColor: "white",
  },
};

const readerStylesMobile = {
  ...readerStyles,
  arrow: {
    ...ReactReaderStyle.arrow,
    backgroundColor: "white",
    color: "black",
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
