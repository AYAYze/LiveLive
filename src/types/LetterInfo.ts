import ImageInfo from "./ImageInfo";
import WriteInfo from "./WriteInfo";

export default interface LetterInfo {
    id:number;
    author: string;
    writes: WriteInfo[];
    title: string;
    thumb: string;
    images: ImageInfo[];
}