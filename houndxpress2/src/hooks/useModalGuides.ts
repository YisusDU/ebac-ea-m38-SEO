import { changeModalData } from "../state/guides.slice";
import { useAppDispatch } from "./useStoreTypes";

const useModalGuides = () => {
  //Redux state
  const dispatch = useAppDispatch();

  //Clean Redux state modalData
  const cleanGuideData = () => {
    //Redux dispatch
    dispatch(changeModalData({ guideNumber: "", typeModal: "" }));
  };
  return { cleanGuideData };
};

export { useModalGuides };
